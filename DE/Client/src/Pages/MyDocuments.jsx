import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsFileEarmarkPdf, BsTrash } from 'react-icons/bs';
import { FiFileText, FiSearch, FiEye, FiTrash2 } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pdf/pdfs');
      setDocuments(response.data.pdfs || []);
      setError(null);
    } catch (err) {
      setError('Failed to load documents. Please try again later.');
      console.error('Error fetching documents:', err);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await api.delete(`/pdf/pdfs/${id}`);
        // Refresh the documents list
        fetchDocuments();
      } catch (err) {
        setError('Failed to delete document. Please try again.');
        console.error('Error deleting document:', err);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-soft mb-8 p-6 border border-indigo-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              My Documents
            </h2>
            <p className="text-gray-600 mt-2">
              View and manage your uploaded PDF documents
            </p>
          </div>
          <button
            className="mt-4 md:mt-0 btn-primary flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <FiFileText />
            Back to Dashboard
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 animate-fade-in">
          {error}
        </div>
      )}

      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-3/4 p-2 relative">
            <button
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg text-red-500 hover:text-red-600 transition-colors"
              onClick={() => setSelectedPdf(null)}
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
            <iframe
              src={selectedPdf}
              width="100%"
              height="100%"
              title="PDF Viewer"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-soft p-8 text-center border border-indigo-50 animate-slide-up">
          <div className="bg-primary-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <FiFileText className="h-8 w-8 text-primary-600" />
          </div>
          <h4 className="text-xl font-semibold mb-2 text-gray-800">No Documents Found</h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven't uploaded any PDF documents yet. Upload your first document to start analyzing.
          </p>
          <button
            className="btn-primary flex items-center gap-2 mx-auto"
            onClick={() => navigate('/')}
          >
            <FiFileText />
            Upload Your First Document
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-soft border border-indigo-50 overflow-hidden animate-slide-up">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FiSearch className="text-primary-600" /> 
                All Documents ({documents.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {documents.map((doc) => (
                    <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-red-100 p-2 rounded-lg mr-3">
                            <BsFileEarmarkPdf className="text-red-600 h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{doc.originalname}</div>
                            <div className="text-xs text-gray-500">{Math.round(doc.size / 1024)} KB</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-600">{formatDate(doc.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Ready
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedPdf(doc.fileUrl)}
                            className="px-3 py-1 flex items-center gap-1 border border-primary-400 text-primary-600 rounded-md text-sm font-medium hover:bg-primary-50 transition-colors"
                          >
                            <FiEye className="h-3.5 w-3.5" />
                            View
                          </button>
                          <button
                            className="px-3 py-1 flex items-center gap-1 border border-red-400 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                            onClick={() => handleDelete(doc._id)}
                          >
                            <FiTrash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDocuments;