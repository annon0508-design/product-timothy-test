import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes } from "firebase/storage";
import { storage } from '../services/firebase';

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileChange = async (files) => {
    const file = files[0];
    if (!file) return;

    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/flac', 'audio/mp4'];
    if (!allowedTypes.includes(file.type)) {
        setError('지원되지 않는 파일 형식입니다. (mp3, wav, webm, flac, m4a 등)');
        return;
    }

    setIsUploading(true);
    setError(null);

    const storageRef = ref(storage, `audio/${Date.now()}_${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      navigate(`/result?file=${encodeURIComponent(storageRef.name.split('/').pop())}`);
    } catch (err) {
      console.error("업로드 실패:", err);
      setError("파일 업로드에 실패했습니다. 다시 시도해주세요.");
      setIsUploading(false);
    }
  };

  const handleAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">음성 증거 분석기</h1>
        <p className="mt-3 text-lg text-gray-500">음성 파일을 업로드하고, 텍스트 변환 및 키워드 분석 결과를 확인하세요.</p>
      </div>

      <div className="w-full max-w-lg px-4">
        <div 
          onClick={handleAreaClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex justify-center items-center w-full h-64 px-6 transition-all duration-300 bg-white border-2 border-dashed rounded-xl cursor-pointer ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
          <div className="text-center pointer-events-none">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-4 text-lg font-semibold text-gray-600">파일을 드래그 앤 드롭하거나 클릭하여 업로드</p>
            <p className="mt-1 text-sm text-gray-500">MP3, WAV, M4A 등 오디오 파일</p>
            <input 
              ref={fileInputRef} 
              id="file-upload"
              name="file-upload" 
              type="file" 
              className="sr-only" 
              onChange={(e) => handleFileChange(e.target.files)} 
              disabled={isUploading} 
            />
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="mt-8 text-center">
          <p className="text-lg font-medium text-blue-600">파일 업로드 및 분석 중... 잠시만 기다려주세요.</p>
          <p className="text-sm text-gray-500">파일 크기에 따라 시간이 다소 소요될 수 있습니다.</p>
        </div>
      )}

      {error && (
        <div className="mt-8 text-center">
          <p className="text-lg font-medium text-red-600">오류: {error}</p>
        </div>
      )}
    </div>
  );
}
