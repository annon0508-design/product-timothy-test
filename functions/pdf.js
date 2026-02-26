const PDFDocument = require("pdfkit");
const admin = require("firebase-admin");
const path = require("path");

exports.generatePDF = (transcriptData, destinationPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const bucket = admin.storage().bucket();
    const file = bucket.file(destinationPath);
    const writeStream = file.createWriteStream({
      metadata: {
        contentType: 'application/pdf',
      },
    });

    // 한국어 폰트 (NanumGothic.ttf 파일이 functions 폴더에 있어야 합니다)
    const fontPath = path.join(__dirname, 'NanumGothic.ttf');
    try {
      doc.font(fontPath);
    } catch (e) {
      console.error(`폰트 로딩 실패: ${fontPath}. 한국어가 제대로 표시되지 않을 수 있습니다.`);
      doc.font('Helvetica'); 
    }

    writeStream.on('error', (err) => {
      console.error("PDF 업로드 오류:", err);
      reject(err);
    });

    writeStream.on('finish', async () => {
      try {
        await file.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
        resolve(publicUrl);
      } catch (err) {
        console.error("PDF 공개 처리 오류:", err);
        reject(err);
      }
    });

    doc.pipe(writeStream);

    // --- PDF 내용 --- //
    doc.fontSize(24).fillColor('#1E3A8A').text('음성 증거 분석 보고서', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(10).fillColor('#6B7280')
       .text(`보고서 생성일: ${new Date().toLocaleString('ko-KR')}`)
       .text(`원본 파일: ${transcriptData.filePath || 'N/A'}`);
    doc.moveDown(2);

    doc.fontSize(16).fillColor('#111827').text('전체 녹취록', { underline: true });
    doc.moveDown();

    if (transcriptData.segments && transcriptData.segments.length > 0) {
        transcriptData.segments.forEach(seg => {
            const timestamp = `[${new Date(seg.start * 1000).toISOString().substr(11, 8)}]`;
            doc.fontSize(12).fillColor('#374151').text(`${timestamp} ${seg.text}`);
            doc.moveDown(0.5);
        });
    } else {
        doc.fontSize(12).fillColor('#6B7280').text('녹취 데이터가 없습니다.');
    }

    doc.moveDown(2);

    doc.fontSize(10).fillColor('#6B7280').text('Voice Evidence Finder에서 생성됨', {
        align: 'center',
        lineGap: 10,
      });

    doc.end();
  });
};