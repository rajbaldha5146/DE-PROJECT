import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';


const LoadingSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
);

const PDFUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast.error('Please select a valid PDF file');
      e.target.value = null;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      const response = await api.post('/pdf/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.data) {
        toast.success('PDF uploaded successfully');
        setSelectedFile(null);
        if (response.data.data?.data?.filenames) {
          setUploadedFiles(prev => [...prev, ...response.data.data.data.filenames]);
        }

        const pdfDocument = response.data.data._id ||
          (response.data.pdf && response.data.pdf._id) ||
          (response.data.data && response.data.data._id);

        if (pdfDocument) {
          const filename = selectedFile.name;
          setUploadedFiles(prev => [...prev, { id: pdfDocument, name: filename }]);
          navigate(`/qna?pdfId=${pdfDocument}`);
        } else {
          console.error('No PDF ID in response', response.data);
          toast.error('Could not retrieve PDF ID from the server');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pdf-upload-container max-w-md mx-auto p-4">
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select PDF File
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={uploading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!selectedFile || uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {uploading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
              <span className="ml-2">Uploading...</span>
            </div>
          ) : (
            'Upload PDF'
          )}
        </button>
      </form>

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h6 className="text-sm font-medium text-gray-700">Uploaded Files:</h6>
          <div className="flex flex-wrap gap-2 mt-2">
            {uploadedFiles.map((filename, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
              >
                {filename}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUpload; 