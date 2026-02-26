import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";
import { searchKeywords } from "../services/search";
import { DEFAULT_KEYWORDS } from "../utils/keywords";

import SearchBar from "../components/SearchBar";
import KeywordChips from "../components/KeywordChips";

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substr(14, 5);

export default function Result() {
  const [searchParams] = useSearchParams();
  const fileId = searchParams.get("file");

  const [fileData, setFileData] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [activeKeywords, setActiveKeywords] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    if (!fileId) {
      setError("파일이 지정되지 않았습니다.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "files", fileId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFileData(data);

          const audioFileRef = ref(storage, data.filePath);
          const url = await getDownloadURL(audioFileRef);
          setAudioUrl(url);

          const initialKeywords = [...DEFAULT_KEYWORDS];
          setActiveKeywords(initialKeywords);
          setSearchResults(searchKeywords(data.segments, initialKeywords));

        } else {
          setError("음성 변환 데이터를 찾을 수 없습니다. 아직 처리 중일 수 있습니다.");
        }
      } catch (err) {
        console.error("데이터 조회 오류:", err);
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fileId]);

  const handleSearch = (newKeyword) => {
    if (!newKeyword || activeKeywords.includes(newKeyword)) return;
    const updatedKeywords = [...activeKeywords, newKeyword];
    setActiveKeywords(updatedKeywords);
    setSearchResults(searchKeywords(fileData.segments, updatedKeywords));
  };
  
  const handleKeywordSelect = (keyword) => {
    const updatedKeywords = activeKeywords.includes(keyword)
      ? activeKeywords.filter(k => k !== keyword)
      : [...activeKeywords, keyword];
    setActiveKeywords(updatedKeywords);
    setSearchResults(searchKeywords(fileData.segments, updatedKeywords));
  };

  const playSegment = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      audioRef.current.play().catch(e => console.error("오디오 재생 오류:", e));
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-50"><div className="text-lg font-medium text-gray-600">결과를 불러오는 중...</div></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-gray-50"><div className="text-lg font-medium text-red-500">{error}</div></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 font-sans">
          <header className="mb-8">
              <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">음성 분석 결과</h1>
              <div className="mt-2 flex items-center space-x-4">
                <p className="text-gray-500">파일명: {fileData.filePath.split('/').pop()}</p>
                {fileData.pdfUrl && (
                    <a href={fileData.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline">
                      <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 2 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      PDF 보고서 다운로드
                    </a>
                )}
              </div>
          </header>
          
          <main className="grid md:grid-cols-3 gap-8">
              {/* Left Column: Audio Player & Transcript */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
                  {audioUrl && (
                      <audio ref={audioRef} src={audioUrl} controls className="w-full mb-6 rounded-md shadow-sm"></audio>
                  )}
                  <h2 className="text-3xl font-bold mb-4 text-gray-700">전체 변환 내용</h2>
                  <div className="h-[60vh] overflow-y-auto pr-3 space-y-2">
                      {fileData.segments.map((seg, index) => (
                          <button key={index} onClick={() => playSegment(seg.start)} className="text-left w-full p-3 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <span className="font-bold text-blue-600 mr-3">{formatTime(seg.start)}</span>
                              <span className="text-gray-800">{seg.text}</span>
                          </button>
                      ))}
                  </div>
              </div>
              
              {/* Right Column: Search & Results */}
              <aside className="space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-3xl font-bold mb-4 text-gray-700">키워드 분석</h2>
                    <SearchBar onSearch={handleSearch} />
                    <div className="mt-4">
                        <p className="font-semibold text-gray-600 mb-2">추천 키워드</p>
                        <KeywordChips onSelect={handleKeywordSelect} selectedKeywords={activeKeywords} />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-3xl font-bold mb-4 text-gray-700">검색 결과</h3>
                  <div className="h-[40vh] overflow-y-auto pr-3 space-y-3">
                      {searchResults.length > 0 ? (
                          searchResults.sort((a,b) => a.start - b.start).map((result, index) => (
                              <button key={index} onClick={() => playSegment(result.start)} className="text-left w-full p-3 rounded-lg border hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                                  <div className="font-bold flex justify-between items-center">
                                      <span className="inline-block bg-red-100 text-red-700 text-sm px-2 py-1 rounded-full">'{result.keyword}'</span>
                                      <span className="text-blue-600">{formatTime(result.start)}</span>
                                  </div>
                                  <p className="text-gray-700 mt-2 pl-1">{result.text}</p>
                              </button>
                          ))
                      ) : (
                          <p className="text-gray-500 text-center mt-8">선택된 키워드가 포함된 내용이 없습니다.</p>
                      )}
                  </div>
                </div>
              </aside>
          </main>
      </div>
    </div>
  );
}
