import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import PDFUpload from "../components/PDFUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUpload, FaFolder, FaHistory, FaRobot, FaBook, FaSearch, FaClock, FaBrain } from "react-icons/fa";
import { FiFileText, FiZap, FiShield, FiTrendingUp } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";

const HomePage = () => {
  const navigate = useNavigate();
  const { currentUser, logout, loading } = useAuth();
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [recentQueries, setRecentQueries] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);

  useEffect(() => {
    // Fetch recent data if user is logged in
    if (currentUser) {
      fetchRecentData();
    }
  }, [currentUser]);

  const fetchRecentData = async () => {
    try {
      // This would be replaced with actual API calls
      setRecentDocuments([
        { id: 1, name: "Financial_Report_2024.pdf", date: "22 Apr 2025" },
        { id: 2, name: "Technical_Documentation.pdf", date: "15 Apr 2025" },
      ]);

      setRecentQueries([
        {
          id: 1,
          document: "Financial_Report_2024.pdf",
          question: "What was the Q1 revenue?",
          date: "23 Apr 2025",
        },
        {
          id: 2,
          document: "Technical_Documentation.pdf",
          question: "Explain the system architecture",
          date: "17 Apr 2025",
        },
      ]);

      setActiveSessions([
        {
          id: 1,
          document: "Research_Paper.pdf",
          startTime: "28 Apr 2025, 10:30 AM",
        },
      ]);
    } catch (error) {
      toast.error("Failed to fetch recent data");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleViewDoc = () => {
    navigate("/my-documents");
  };

  const handleViewHistory = () => {
    navigate("/qnahistory");
  };

  const handleStartChat = (documentId) => {
    navigate(`/qna/${documentId}`);
  };

  const handleEndChat = async (sessionId) => {
    try {
      // This would call your API endpoint to end the session
      toast.success("Chat session ended successfully");
      // Remove from active sessions
      setActiveSessions(
        activeSessions.filter((session) => session.id !== sessionId)
      );
    } catch (error) {
      toast.error("Failed to end chat session");
    }
  };

  const handleNewQuery = () => {
    navigate("/my-documents");
    toast.info("Please select a document to start a new Q&A session");
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {currentUser ? (
        // User is logged in - show dashboard
        <div className="container mx-auto py-6 px-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-soft mb-8 p-6 border border-indigo-50">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                  Welcome back, {currentUser.name}
                </h2>
                <p className="text-gray-600 mt-2">
                  Access your documents and get AI-powered insights instantly
                </p>
              </div>
              <button
                className="mt-4 lg:mt-0 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition flex items-center gap-2"
                onClick={handleLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm7 4a1 1 0 10-2 0v4a1 1 0 102 0V7z"
                    clipRule="evenodd"
                  />
                  <path d="M8 11V7a1 1 0 10-2 0v4a1 1 0 102 0z" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-soft p-6 border border-indigo-50">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-primary-100 text-primary-600">
                  <FiFileText size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Documents</p>
                  <h3 className="text-2xl font-bold text-gray-800">12</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-soft p-6 border border-indigo-50">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-accent-100 text-accent-600">
                  <FaRobot size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">AI Sessions</p>
                  <h3 className="text-2xl font-bold text-gray-800">48</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-soft p-6 border border-indigo-50">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <FaSearch size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Queries</p>
                  <h3 className="text-2xl font-bold text-gray-800">165</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-soft p-6 border border-indigo-50">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                  <FaClock size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Time Saved</p>
                  <h3 className="text-2xl font-bold text-gray-800">24 hrs</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <MdDashboard className="text-primary-600" /> Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-soft border border-indigo-50 transition-transform hover:-translate-y-1 duration-300">
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-br from-blue-500 to-primary-600 p-3 rounded-lg text-white">
                    <FaUpload className="text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold">Upload PDF</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Upload a PDF document to extract information and ask questions
                  about its content.
                </p>
                <PDFUpload />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-soft border border-indigo-50 transition-transform hover:-translate-y-1 duration-300">
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-lg text-white">
                    <FaFolder className="text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold">My Documents</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  View and manage your previously uploaded documents. Start a
                  Q&A session with any document.
                </p>
                <button
                  className="mt-auto btn-primary w-full"
                  onClick={handleViewDoc}
                >
                  View Documents
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-soft border border-indigo-50 transition-transform hover:-translate-y-1 duration-300">
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-br from-accent-500 to-green-500 p-3 rounded-lg text-white">
                    <FaHistory className="text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold">Q&A History</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Access your past questions and the AI-generated answers for
                  reference and continuation.
                </p>
                <button
                  className="mt-auto btn-primary w-full"
                  onClick={handleViewHistory}
                >
                  View History
                </button>
              </div>
            </div>
          </div>

          {/* Recent Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Documents */}
            <div className="bg-white rounded-xl shadow-soft border border-indigo-50">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                  <FaBook className="text-primary-600" /> Recent Documents
                </h3>
                <button
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  onClick={handleViewDoc}
                >
                  View All
                </button>
              </div>
              <div className="p-4">
                {recentDocuments.length > 0 ? (
                  <ul>
                    {recentDocuments.map((doc) => (
                      <li
                        key={doc.id}
                        className="py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="bg-red-100 p-2 rounded-md">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-red-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="font-medium">{doc.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-3">
                              {doc.date}
                            </span>
                            <button 
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                              onClick={() => handleStartChat(doc.id)}
                            >
                              <FaRobot size={16} />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FiFileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No documents yet</p>
                    <button 
                      className="mt-4 px-4 py-2 bg-primary-50 text-primary-600 rounded-md text-sm font-medium hover:bg-primary-100 transition-colors"
                      onClick={() => {}}
                    >
                      Upload your first document
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Queries */}
            <div className="bg-white rounded-xl shadow-soft border border-indigo-50">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                  <FaRobot className="text-primary-600" /> Recent Q&A
                </h3>
                <button
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  onClick={handleViewHistory}
                >
                  View All
                </button>
              </div>
              <div className="p-4">
                {recentQueries.length > 0 ? (
                  <ul>
                    {recentQueries.map((query) => (
                      <li
                        key={query.id}
                        className="py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-2">
                            <div className="bg-primary-100 p-2 rounded-md mt-1">
                              <FaRobot className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-800 block">
                                {query.question}
                              </span>
                              <span className="text-xs text-gray-500">
                                {query.document}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {query.date}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FaRobot className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No queries yet</p>
                    <button
                      className="mt-4 px-4 py-2 bg-primary-50 text-primary-600 rounded-md text-sm font-medium hover:bg-primary-100 transition-colors"
                      onClick={handleNewQuery}
                    >
                      Start your first Q&A session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // User is not logged in - show landing page
        <div className="animate-fade-in">
          {/* Hero section */}
          <section className="bg-gradient-to-br from-gray-50 to-indigo-50 py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-10 animate-slide-up">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                      AI-Powered Document Analysis 
                    </span>{" "}
                    Made Simple
                  </h1>
                  <p className="text-xl text-gray-700 mb-8">
                    Upload your documents, ask questions, and get instant insights. Transform how you interact with documents using the power of AI.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => navigate('/signup')}
                      className="btn-primary"
                    >
                      Get Started - It's Free
                    </button>
                    <button 
                      onClick={() => navigate('/login')}
                      className="btn-secondary"
                    >
                      Already have an account? Login
                    </button>
                  </div>
                </div>
                <div className="md:w-1/2 mt-12 md:mt-0 animate-slide-up delay-200">
                  <div className="bg-white p-2 rounded-2xl shadow-2xl">
                    <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                      {/* Background */}
                      <rect width="800" height="500" fill="#f8fafc" rx="12" ry="12"/>
                      
                      {/* Chat container with subtle shadow */}
                      <rect x="50" y="50" width="700" height="400" fill="white" rx="12" ry="12" stroke="#e2e8f0" strokeWidth="2"/>
                      <rect x="52" y="52" width="696" height="396" fill="none" rx="10" ry="10" stroke="#f1f5f9" strokeWidth="1"/>
                      
                      {/* Header with gradient */}
                      <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4338ca"/>
                        <stop offset="100%" stopColor="#6366f1"/>
                      </linearGradient>
                      <rect x="50" y="50" width="700" height="60" fill="url(#headerGradient)" rx="12" ry="12"/>
                      <rect x="50" y="90" width="700" height="20" fill="url(#headerGradient)" rx="0" ry="0"/>
                      
                      {/* Header Text with enhanced styling */}
                      <text x="120" y="85" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="white">Financial_Report_2024.pdf</text>
                      
                      {/* PDF icon in header - enhanced design */}
                      <rect x="80" y="65" width="30" height="35" fill="#f43f5e" rx="3" ry="3"/>
                      <path d="M85,73 L105,73 M85,78 L105,78 M85,83 L105,83 M85,88 L95,88" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M100,67 L107,74 L100,74 Z" fill="white"/>
                      
                      {/* PDF File preview - more realistic */}
                      <rect x="80" y="130" width="160" height="200" fill="#f8fafc" rx="6" ry="6" stroke="#e2e8f0" strokeWidth="1"/>
                      
                      {/* Title section */}
                      <rect x="90" y="140" width="140" height="15" fill="#cbd5e1" rx="2" ry="2"/>
                      <circle cx="100" cy="148" r="4" fill="#4f46e5"/>
                      <rect x="110" y="145" width="110" height="6" fill="#94a3b8" rx="1" ry="1"/>
                      
                      {/* Text blocks with varying lengths and styles */}
                      <rect x="90" y="165" width="140" height="4" fill="#94a3b8" rx="1" ry="1"/>
                      <rect x="90" y="175" width="120" height="4" fill="#94a3b8" rx="1" ry="1"/>
                      <rect x="90" y="185" width="130" height="4" fill="#94a3b8" rx="1" ry="1"/>
                      <rect x="90" y="195" width="110" height="4" fill="#94a3b8" rx="1" ry="1"/>
                      
                      {/* Data section with chart visualization */}
                      <rect x="90" y="215" width="140" height="30" fill="#e0e7ff" rx="2" ry="2"/>
                      <rect x="100" y="235" width="30" height="10" fill="#4f46e5" rx="1" ry="1"/>
                      <rect x="135" y="230" width="30" height="15" fill="#6366f1" rx="1" ry="1"/>
                      <rect x="170" y="225" width="30" height="20" fill="#818cf8" rx="1" ry="1"/>
                      <text x="130" y="225" fontFamily="Arial, sans-serif" fontSize="8" fill="#1e293b" fontWeight="bold">Q1 Revenue</text>
                      
                      <rect x="90" y="255" width="140" height="4" fill="#94a3b8" rx="1" ry="1"/>
                      <rect x="90" y="265" width="120" height="4" fill="#94a3b8" rx="1" ry="1"/>
                      <rect x="90" y="275" width="130" height="4" fill="#94a3b8" rx="1" ry="1"/>
                      
                      {/* Financial data table visualization */}
                      <rect x="90" y="290" width="140" height="40" fill="#f1f5f9" rx="2" ry="2"/>
                      <line x1="90" y1="300" x2="230" y2="300" stroke="#cbd5e1" strokeWidth="1"/>
                      <line x1="90" y1="310" x2="230" y2="310" stroke="#cbd5e1" strokeWidth="1"/>
                      <line x1="90" y1="320" x2="230" y2="320" stroke="#cbd5e1" strokeWidth="1"/>
                      <line x1="140" y1="290" x2="140" y2="330" stroke="#cbd5e1" strokeWidth="1"/>
                      <line x1="180" y1="290" x2="180" y2="330" stroke="#cbd5e1" strokeWidth="1"/>
                      <text x="110" y="297" fontFamily="Arial, sans-serif" fontSize="6" fill="#475569" fontWeight="bold">Metric</text>
                      <text x="160" y="297" fontFamily="Arial, sans-serif" fontSize="6" fill="#475569" fontWeight="bold">Value</text>
                      <text x="200" y="297" fontFamily="Arial, sans-serif" fontSize="6" fill="#475569" fontWeight="bold">YoY</text>
                      <text x="105" y="307" fontFamily="Arial, sans-serif" fontSize="6" fill="#475569">Revenue</text>
                      <text x="155" y="307" fontFamily="Arial, sans-serif" fontSize="6" fill="#475569">$14.2M</text>
                      <text x="195" y="307" fontFamily="Arial, sans-serif" fontSize="6" fill="#22c55e">+12%</text>
                      <text x="105" y="317" fontFamily="Arial, sans-serif" fontSize="6" fill="#475569">Costs</text>
                      <text x="155" y="317" fontFamily="Arial, sans-serif" fontSize="6" fill="#475569">$8.5M</text>
                      <text x="195" y="317" fontFamily="Arial, sans-serif" fontSize="6" fill="#ef4444">+5%</text>
                      <text x="105" y="327" fontFamily="Arial, sans-serif" fontSize="6" fill="#475569">Profit</text>
                      <text x="155" y="327" fontFamily="Arial, sans-serif" fontSize="6" fill="#475569">$5.7M</text>
                      <text x="195" y="327" fontFamily="Arial, sans-serif" fontSize="6" fill="#22c55e">+21%</text>
                      
                      {/* Chat messages area with subtle grid pattern */}
                      <rect x="260" y="130" width="470" height="240" fill="#f8fafc" rx="6" ry="6"/>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="0.5"/>
                      </pattern>
                      <rect x="260" y="130" width="470" height="240" fill="url(#grid)" rx="6" ry="6" opacity="0.5"/>
                      
                      {/* User message 1 with improved styling */}
                      <linearGradient id="userBubbleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4f46e5"/>
                        <stop offset="100%" stopColor="#4338ca"/>
                      </linearGradient>
                      <rect x="500" y="140" width="220" height="50" fill="url(#userBubbleGradient)" rx="12" ry="12"/>
                      <path d="M720,165 L730,170 L720,175 Z" fill="#4338ca"/>
                      <text x="520" y="165" fontFamily="Arial, sans-serif" fontSize="14" fill="white" fontWeight="500">What was the Q1 revenue?</text>
                      <text x="695" y="180" fontFamily="Arial, sans-serif" fontSize="10" fill="#a5b4fc" textAnchor="end">12:42 PM</text>
                      
                      {/* AI response 1 with improved styling */}
                      <filter id="dropShadow">
                        <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1"/>
                      </filter>
                      <rect x="270" y="200" width="330" height="80" fill="#f1f5f9" rx="12" ry="12" filter="url(#dropShadow)"/>
                      <path d="M270,225 L260,230 L270,235 Z" fill="#f1f5f9"/>
                      <text x="320" y="225" fontFamily="Arial, sans-serif" fontSize="14" fill="#1e293b">
                        <tspan x="320" dy="0">According to the financial report, the Q1 revenue</tspan>
                        <tspan x="320" dy="20">was $14.2 million, which represents a 12% increase</tspan>
                        <tspan x="320" dy="20">compared to the same period last year.</tspan>
                      </text>
                      <text x="580" y="270" fontFamily="Arial, sans-serif" fontSize="10" fill="#94a3b8" textAnchor="end">12:43 PM</text>
                      
                      {/* Modern AI avatar instead of basic circle */}
                      <circle cx="290" cy="230" r="20" fill="#4f46e5"/>
                      <circle cx="290" cy="230" r="18" fill="#ffffff" opacity="0.1"/>
                      <path d="M290,220 C296,220 302,226 292,236 C282,226 288,220 290,220 Z" fill="white"/> {/* Stylized AI/assistant icon */}
                      <circle cx="285" cy="226" r="2" fill="white"/>
                      <circle cx="295" cy="226" r="2" fill="white"/>
                      
                      {/* User message 2 with improved styling */}
                      <rect x="430" y="290" width="290" height="50" fill="url(#userBubbleGradient)" rx="12" ry="12"/>
                      <path d="M720,310 L730,315 L720,320 Z" fill="#4338ca"/>
                      <text x="450" y="315" fontFamily="Arial, sans-serif" fontSize="14" fill="white" fontWeight="500">How does that compare to forecasts?</text>
                      <text x="695" y="330" fontFamily="Arial, sans-serif" fontSize="10" fill="#a5b4fc" textAnchor="end">12:45 PM</text>
                      
                      {/* Enhanced input area */}
                      <linearGradient id="inputGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff"/>
                        <stop offset="100%" stopColor="#f8fafc"/>
                      </linearGradient>
                      <rect x="260" y="380" width="470" height="50" fill="url(#inputGradient)" rx="25" ry="25" stroke="#e2e8f0" strokeWidth="2"/>
                      <rect x="262" y="382" width="466" height="46" fill="none" rx="23" ry="23" stroke="#f1f5f9" strokeWidth="1"/>
                      <text x="290" y="410" fontFamily="Arial, sans-serif" fontSize="14" fill="#94a3b8">Ask a question about this document...</text>
                      
                      {/* Enhanced send button */}
                      <linearGradient id="sendBtnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4f46e5"/>
                        <stop offset="100%" stopColor="#4338ca"/>
                      </linearGradient>
                      <circle cx="690" cy="405" r="20" fill="url(#sendBtnGradient)"/>
                      <circle cx="690" cy="405" r="18" fill="none" stroke="white" strokeWidth="1" opacity="0.2"/>
                      <path d="M680,405 L700,405 M690,395 L700,405 L690,415" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      
                      {/* AI actions panel with enhanced styling */}
                      <rect x="80" y="340" width="160" height="90" fill="white" rx="6" ry="6" stroke="#e2e8f0" strokeWidth="1" filter="url(#dropShadow)"/>
                      <text x="100" y="360" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#1e293b">AI Actions</text>
                      
                      {/* Enhanced action buttons with icons */}
                      <rect x="90" y="370" width="140" height="25" fill="#f8fafc" rx="4" ry="4" stroke="#e2e8f0" strokeWidth="1"/>
                      <text x="120" y="387" fontFamily="Arial, sans-serif" fontSize="12" fill="#1e293b">Summarize document</text>
                      <circle cx="104" cy="382" r="8" fill="#4f46e5" opacity="0.1"/>
                      <path d="M101,382 L107,382 M101,378 L107,378 M101,386 L105,386" stroke="#4f46e5" strokeWidth="1" strokeLinecap="round"/>
                      
                      <rect x="90" y="400" width="140" height="25" fill="#f8fafc" rx="4" ry="4" stroke="#e2e8f0" strokeWidth="1"/>
                      <text x="120" y="417" fontFamily="Arial, sans-serif" fontSize="12" fill="#1e293b">Extract key figures</text>
                      <circle cx="104" cy="412" r="8" fill="#4f46e5" opacity="0.1"/>
                      <path d="M104,408 L104,416 M101,410 L107,414 M101,414 L107,410" stroke="#4f46e5" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Choose Questify?
                </h2>
                <p className="text-gray-600 text-lg">
                  Our platform combines advanced AI technology with a seamless user experience to help you extract insights from your documents faster than ever.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-gray-50 rounded-xl p-6 shadow-soft border border-gray-100 animate-slide-up delay-100">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg w-12 h-12 flex items-center justify-center text-white mb-4">
                    <FaBrain size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
                  <p className="text-gray-600">
                    Our advanced AI models understand context and nuance in your documents for more accurate answers.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 shadow-soft border border-gray-100 animate-slide-up delay-200">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg w-12 h-12 flex items-center justify-center text-white mb-4">
                    <FiZap size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                  <p className="text-gray-600">
                    Get answers in seconds, no matter how complex your documents or questions are.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 shadow-soft border border-gray-100 animate-slide-up delay-300">
                  <div className="bg-gradient-to-br from-accent-500 to-green-500 rounded-lg w-12 h-12 flex items-center justify-center text-white mb-4">
                    <FiShield size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
                  <p className="text-gray-600">
                    Your documents are encrypted and never shared with third parties. Your data stays yours.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 shadow-soft border border-gray-100 animate-slide-up delay-400">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg w-12 h-12 flex items-center justify-center text-white mb-4">
                    <FiTrendingUp size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Actionable Insights</h3>
                  <p className="text-gray-600">
                    Extract valuable information and insights that help you make better decisions faster.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-3xl mx-auto animate-slide-up">
                <h2 className="text-3xl font-bold mb-6">
                  Ready to Transform Your Document Experience?
                </h2>
                <p className="text-xl mb-8 text-primary-100">
                  Join thousands of users who have simplified their document workflows with Questify.
                </p>
                <button 
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-white text-primary-700 font-medium rounded-lg shadow-lg hover:bg-primary-50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Get Started for Free
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default HomePage;
