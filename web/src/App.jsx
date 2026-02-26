import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Result from './pages/Result';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
        <header className="bg-white shadow-sm">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
              <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                음성 증거 분석기
              </Link>
              {/* 향후 네비게이션 링크 추가 가능 */}
            </div>
          </nav>
        </header>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </main>

        <footer className="bg-white mt-auto">
          <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} 음성 증거 분석기. 모든 권리 보유.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
