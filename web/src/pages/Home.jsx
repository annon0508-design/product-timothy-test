import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '../main'; // 경로 수정

const Home = () => {
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    const file = acceptedFiles[0];

    uploadFile(
      file,
      (progress) => {
        setUploadProgress(progress);
      },
      (errorMessage) => {
        setError(errorMessage);
        setIsUploading(false);
      },
      () => {
        console.log('업로드 성공!');
        setIsUploading(false);
      }
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="container">
      <header>
        <h1>음성 증거 분석기</h1>
      </header>
      <main>
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>파일을 여기에 놓으세요...</p>
          ) : (
            <p>분석할 음성 파일을 드래그 앤 드랍하거나, 여기를 클릭하여 파일을 선택하세요.</p>
          )}
        </div>
        {isUploading && (
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
        {error && <p className="error-message">오류: {error}</p>}
      </main>
    </div>
  );
};

export default Home;
