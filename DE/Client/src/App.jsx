import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './Pages/HomePage';
import SignupPage from './Pages/Signup';
import LoginPage from './Pages/Login';
import QnAPage from './Pages/QnAPage';
import { AuthProvider } from './context/AuthContext';
import MyDocuments from './Pages/MyDocuments';
import QnaHistory from './Pages/QnaHistory';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-16 lg:pt-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/qna" element={<QnAPage />} />
              <Route path='/my-documents' element={<MyDocuments />} />
              <Route path='/qnahistory' element={<QnaHistory />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
