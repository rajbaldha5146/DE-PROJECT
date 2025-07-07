import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactMarkdown from 'react-markdown';
import api from '../utils/api';
import { FiHome, FiSearch, FiClock, FiChevronDown, FiChevronUp, FiFile } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

const QnaHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { pdfId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(20);
  const [expandedItems, setExpandedItems] = useState({});
  
  const navigate = useNavigate();
  // Use either URL param or search param for PDF ID
  const activePdfId = pdfId || searchParams.get('pdfId');

  const fetchHistory = async () => {
    try {
      setLoading(true);

      // Build query params
      const params = new URLSearchParams();
      if (activePdfId) params.append('pdfId', activePdfId);
      if (searchTerm) params.append('search', searchTerm);
      params.append('limit', limit.toString());

      const response = await api.get(`/pdf/history?${params.toString()}`);
      setHistory(response.data.history);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load question history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [activePdfId, limit]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleLoadMore = () => {
    setLimit(prevLimit => prevLimit + 20);
  };

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Get truncated text with ellipsis
  const truncateText = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Group history items by PDF
  const groupHistoryByPdf = () => {
    const grouped = {};
    
    history.forEach(item => {
      const pdfId = item.pdf?._id || 'unknown';
      const pdfName = item.pdf?.originalname || item.pdf?.filename || 'Unknown PDF';
      
      if (!grouped[pdfId]) {
        grouped[pdfId] = {
          pdfName,
          items: []
        };
      }
      
      grouped[pdfId].items.push(item);
    });
    
    return grouped;
  };

  const groupedHistory = groupHistoryByPdf();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <div className="bg-white rounded-xl shadow-soft mb-8 p-6 border border-indigo-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              Question & Answer History
            </h2>
            <p className="text-gray-600 mt-2">
              Browse your previous Q&A sessions and search for specific information
            </p>
          </div>
          <button 
            onClick={handleHome}
            className="mt-4 md:mt-0 btn-primary flex items-center gap-2"
          >
            <FiHome />
            Back To Dashboard
          </button>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-soft mb-8 p-6 border border-indigo-50 animate-slide-up">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search questions or answers..."
              className="form-input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn-primary md:w-auto w-full"
            disabled={loading}
          >
            {loading ? <LoadingSpinner small white /> : 'Search'}
          </button>
        </form>
      </div>

      {/* History List */}
      {loading && history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-soft border border-indigo-50 animate-pulse">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 font-medium">Loading history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-soft border border-indigo-50 animate-slide-up">
          <div className="bg-primary-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <FiClock className="h-8 w-8 text-primary-600" />
          </div>
          <h4 className="text-xl font-semibold mb-2 text-gray-800">No Questions Found</h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven't asked any questions yet. Try uploading a document and start a Q&A session.
          </p>
          {activePdfId && (
            <button
              onClick={() => navigate(`/qna?pdfId=${activePdfId}`)}
              className="btn-primary mx-auto"
            >
              Start asking questions
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-slide-up">
          {Object.entries(groupedHistory).map(([pdfId, pdfGroup]) => (
            <div key={pdfId} className="bg-white rounded-xl shadow-soft overflow-hidden border border-indigo-50">
              {/* PDF Header */}
              <div className="bg-gradient-to-r from-primary-50 to-indigo-50 border-b border-indigo-100 px-6 py-4">
                <div className="flex items-center">
                  <FiFile className="text-primary-600 mr-2 h-5 w-5" />
                  <div>
                    <h3 className="font-medium text-gray-900">{pdfGroup.pdfName}</h3>
                    <p className="text-xs text-primary-600">{pdfGroup.items.length} questions</p>
                  </div>
                </div>
              </div>
              
              {/* Questions for this PDF */}
              <div className="divide-y divide-gray-100">
                {pdfGroup.items.map((item, index) => (
                  <div key={index} className="hover:bg-gray-50 transition-colors">
                    <div 
                      className="px-6 py-4 cursor-pointer flex justify-between items-center"
                      onClick={() => toggleExpand(item._id)}
                    >
                      <div className="flex-grow pr-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary-100 p-2 rounded-lg mt-1 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{truncateText(item.question)}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(item.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-400 flex-shrink-0">
                        {expandedItems[item._id] ? (
                          <FiChevronUp className="h-5 w-5" />
                        ) : (
                          <FiChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    
                    {expandedItems[item._id] && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 animate-fade-in">
                        <h4 className="font-medium text-primary-600 mb-2">Answer:</h4>
                        <div className="markdown-content">
                          <ReactMarkdown>{item.answer}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Load More Button */}
          {history.length >= limit && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 border border-primary-300 text-primary-600 rounded-lg shadow-sm hover:bg-primary-50 transition-colors"
              >
                Load More Questions
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QnaHistoryPage;