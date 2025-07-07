import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiSend, FiX, FiArrowLeft, FiUser, FiFileText } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';

const QnAPage = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [pdfId, setPdfId] = useState(null);
  const [endingChat, setEndingChat] = useState(false);
  const [pdfName, setPdfName] = useState('');
  const navigate = useNavigate();

  // Extract pdfId from URL query parameters when component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('pdfId');
    
    if (id) {
      setPdfId(id);
      fetchPdfDetails(id);
    } else {
      toast.error('No PDF selected. Redirecting to upload page...');
      setTimeout(() => navigate('/'), 2000);
    }
  }, [location, navigate]);

  const fetchPdfDetails = async (id) => {
    try {
      const response = await api.get(`/pdf/pdfs/${id}`);
      if (response.data && response.data.pdf) {
        setPdfName(response.data.pdf.originalname || 'Document');
      }
    } catch (error) {
      console.error('Error fetching PDF details:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    if (!pdfId) {
      toast.error('No PDF selected');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/pdf/query', { question, pdfId });
      
      if (response.data) {
        // Set the current answer
        setCurrentAnswer(response.data.answer);
        
        // Update conversation history
        if (response.data.conversation_history) {
          setConversation(response.data.conversation_history);
        }
        
        setQuestion(''); // Clear the input
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to get answer');
    } finally {
      setLoading(false);
    }
  };

  const handleEndChat = async () => {
    try {
      setEndingChat(true);
      const response = await api.post('/pdf/clear-vector-data', { pdfId });
      
      if (response.data.data?.success) {
        toast.success('Chat ended and history cleared');
        // Clear all state
        setQuestion('');
        setCurrentAnswer('');
        setConversation([]);
        // Redirect to home page after a short delay to show the toast
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to end chat');
    } finally {
      setEndingChat(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <div className="bg-white rounded-xl shadow-soft mb-8 p-6 border border-indigo-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              Ask Questions About Your PDF
            </h2>
            {pdfName && (
              <p className="text-gray-600 mt-2 flex items-center">
                <FiFileText className="mr-2" /> Currently analyzing: <span className="font-medium ml-1">{pdfName}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Question Input Form */}
      <div className="bg-white rounded-xl shadow-soft mb-8 p-6 border border-indigo-50 animate-slide-up">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="question">
              Your Question
            </label>
            <div className="relative">
              <textarea
                id="question"
                rows="3"
                className="form-input pl-4 pr-12 py-3"
                placeholder="Ask any question about the document..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading || endingChat}
              ></textarea>
              <button 
                type="submit" 
                disabled={loading || endingChat || !question.trim()}
                className={`absolute right-3 bottom-3 p-2 rounded-full ${
                  loading || endingChat || !question.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'
                } transition-colors`}
              >
                {loading ? <LoadingSpinner small white /> : <FiSend className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Current Answer */}
      {currentAnswer && (
        <div className="bg-white rounded-xl shadow-soft mb-8 overflow-hidden border border-indigo-50 animate-slide-up">
          <div className="bg-gradient-to-r from-primary-600 to-indigo-600 px-6 py-3">
            <h5 className="font-medium text-white flex items-center">
              <FiMessageSquare className="mr-2" /> Latest Answer
            </h5>
          </div>
          <div className="p-6">
            <div className="markdown-content">
              <ReactMarkdown>{currentAnswer}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Conversation History */}
      {conversation.length > 0 && (
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <h4 className="text-xl font-semibold text-gray-800">Conversation History</h4>
            <div className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">
              {conversation.length / 2} Q&A pairs
            </div>
          </div>
          <div className="space-y-4">
            {conversation.map((item, index) => (
              <div key={index} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-3/4 rounded-xl px-5 py-3 ${
                    item.role === 'user' 
                      ? 'bg-primary-600 text-white rounded-tr-none shadow-soft' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none shadow-soft'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1 rounded-full ${item.role === 'user' ? 'bg-white/20' : 'bg-primary-100'}`}>
                      {item.role === 'user' ? <FiUser className="h-3 w-3" /> : <FiMessageSquare className="h-3 w-3 text-primary-600" />}
                    </div>
                    <div className="text-xs opacity-80">
                      {item.role === 'user' ? 'You' : 'AI Assistant'}
                    </div>
                  </div>
                  {item.role === 'user' ? (
                    <p className="whitespace-pre-line">{item.content}</p>
                  ) : (
                    <div className="markdown-content">
                      <ReactMarkdown>{item.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* End Chat Button */}
      {conversation.length > 0 && (
        <div className="text-center animate-slide-up mt-10">
          <button
            onClick={handleEndChat}
            disabled={endingChat}
            className={`py-3 px-8 flex items-center justify-center gap-2 mx-auto rounded-lg shadow-sm text-sm font-medium ${
              endingChat ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
            } transition-colors`}
          >
            {endingChat ? (
              <>
                <LoadingSpinner small />
                <span>Ending Chat...</span>
              </>
            ) : (
              <>
                <FiX className="h-4 w-4" />
                End Chat Session
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            This will clear the current conversation history and return to the dashboard
          </p>
        </div>
      )}
    </div>
  );
};

export default QnAPage;