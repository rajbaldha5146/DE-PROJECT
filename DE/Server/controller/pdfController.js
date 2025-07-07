    const axios = require('axios');
    const path = require('path');
    const fs = require('fs');
    const FormData = require('form-data');
    const PDF = require('../models/PDF');
    const QueryHistory = require('../models/QueryHistory');


    // Configure axios with AI server base URL
    const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://localhost:5000';

    // Create a dedicated axios instance for AI server
    const aiAxios = axios.create({
        baseURL: AI_SERVER_URL,
        withCredentials: true
    });

    // Store cookies between requests
    let cookies = '';
    aiAxios.interceptors.response.use(response => {
        // Store cookies from response
        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
            cookies = setCookieHeader;
        }
        return response;
    });
    aiAxios.interceptors.request.use(config => {
        // Add cookies to request
        if (cookies) {
            config.headers.Cookie = cookies;
        }
        return config;
    });

    const pdfController = {
        // Upload PDF and send to AI server
        uploadPDF: async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ error: 'No PDF file uploaded' });
                }

                // Create form data with the actual file
                const formData = new FormData();
                formData.append('pdf_files', fs.createReadStream(req.file.path), {
                    filename: req.file.originalname,
                    contentType: 'application/pdf'
                });

                console.log('Sending PDF to AI server:', req.file.originalname);

                // Send to AI server
                const response = await aiAxios.post('/upload', formData, {
                    headers: {
                        ...formData.getHeaders()
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                });

                console.log('AI server response:', response.data);

                // Save PDF metadata to database
                const pdf = new PDF({
                    filename: req.file.filename,
                    originalname: req.file.originalname,
                    path: req.file.path,
                    user: req.user._id
                });
                const savedPdf = await pdf.save();

                res.json({
                    message: 'PDF uploaded successfully',
                    data: {
                        _id: savedPdf._id, // Include the MongoDB document ID
                        filename: savedPdf.filename,
                        originalname: savedPdf.originalname
                    },
                    aiResponse: response.data
                });
            } catch (error) {
                console.error('Upload error:', error.message);
                if (error.response) {
                    console.error('Response error data:', error.response.data);
                    return res.status(error.response.status).json({ error: error.response.data.message || 'Error from AI server' });
                }
                res.status(500).json({ error: 'Error uploading PDF: ' + error.message });
            }
        },
    
        // Query PDF and store history
        queryPDF: async (req, res) => {
            try {
                const { question,pdfId } = req.body;
                if (!question) {
                    return res.status(400).json({ error: 'Question is required' });
                }
                if (!pdfId) {
                    return res.status(400).json({ error: 'PDF ID is required' });
                }

                // Verify PDF exists and belongs to user
            const pdf = await PDF.findOne({ _id: pdfId, user: req.user._id });
            if (!pdf) {
                return res.status(404).json({ error: 'PDF not found or not authorized' });
            }

                console.log('Sending query to AI server:', question);

                // Send query to AI server using URLSearchParams for form data
                const params = new URLSearchParams();
                params.append('query', question);

                const response = await aiAxios.post('/query', params);

                console.log('AI server query response:', response.data);

                // Check if we have a valid response
                if (!response.data || !response.data.data) {
                    return res.status(500).json({ error: 'Invalid response from AI server' });
                }

                // Store query history
                const queryHistory = new QueryHistory({
                    question,
                    answer: response.data.data.answer,
                    user: req.user._id,
                    pdf: pdfId  // Add PDF reference
                });
                await queryHistory.save();

                res.json({
                    answer: response.data.data.answer,
                    conversation_history: response.data.data.conversation_history
                });
            } catch (error) {
                console.error('Query error:', error.message);
                if (error.response) {
                    console.error('Response error data:', error.response.data);
                    return res.status(error.response.status || 500).json({
                        error: error.response.data.message || 'Error from AI server'
                    });
                }
                res.status(500).json({ error: 'Error processing query: ' + error.message });
            }
        },

        // Clear vector data
        clearVectorData: async (req, res) => {
            try {
                console.log('Sending clear vector data request to AI server');

                // Send request to AI server
                const response = await aiAxios.post('/clear-vector-data');

                console.log('AI server clear vector data response:', response.data);

                res.json({
                    message: 'Vector data cleared successfully',
                    data: response.data
                });
            } catch (error) {
                console.error('Clear vector data error:', error.message);
                if (error.response) {
                    console.error('Response error data:', error.response.data);
                    return res.status(error.response.status || 500).json({
                        error: error.response.data.message || 'Error from AI server'
                    });
                }
                res.status(500).json({ error: 'Error clearing vector data: ' + error.message });
            }
        },

        // Get all PDFs for the logged-in user
            getAllPDFs: async (req, res) => {
            try {
                // Find all PDFs for the current user
                const pdfs = await PDF.find({ user: req.user._id })
                    .select('-path') // Exclude the server path for security
                    .sort({ createdAt: -1 }); // Sort by newest first

                    // Add fileUrl to each PDF
        const pdfsWithUrls = pdfs.map((pdf) => ({
            ...pdf._doc,
            fileUrl: `${req.protocol}://${req.get('host')}/uploads/${pdf.filename}`,
        }));

                res.json({
                    count: pdfsWithUrls.length,
            pdfs: pdfsWithUrls,
                });
            } catch (error) {
                console.error('Error fetching PDFs:', error.message);
                res.status(500).json({ error: 'Error fetching PDF list: ' + error.message });
            }
        },

        deletePDF: async (req, res) => {
            try {
            const { id } = req.params;
            
            // Check if PDF exists and belongs to user
            const pdf = await PDF.findOne({ _id: id, user: req.user._id });
            
            if (!pdf) {
                return res.status(404).json({ error: 'PDF not found or not authorized' });
            }
            
            
            // Delete file from filesystem
            fs.unlink(pdf.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });

            // Delete all associated query history entries
        await QueryHistory.deleteMany({ pdf: id });
            // Delete from database
        await PDF.deleteOne({ _id: id });
        
        res.json({ message: 'PDF deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error.message);
        res.status(500).json({ error: 'Error deleting PDF: ' + error.message });
    }
    },

    // Get query history for the logged-in user
    getQueryHistory: async (req, res) => {
        try {

            const { limit = 50, search } = req.query;
            const filter = { user: req.user._id };
            
            if (search) {
                filter.$or = [
                    { question: { $regex: search, $options: 'i' } },
                    { answer: { $regex: search, $options: 'i' } }
                ];
            }
        // Find all query history entries for the current user
        const history = await QueryHistory.find(filter)
                .populate('pdf', 'originalname filename') // Include PDF info
                .sort({ createdAt: -1 })
                .limit(parseInt(limit));
        res.json({
            count: history.length,
            history: history
        });
        } catch (error) {
        console.error('Error fetching query history:', error.message);
        res.status(500).json({ error: 'Error fetching query history: ' + error.message });
        }
    }


    };

    module.exports = pdfController; 