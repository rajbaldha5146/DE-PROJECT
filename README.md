# 📚 PDF Q&A AI Platform

A comprehensive AI-powered platform that allows users to upload PDF documents and interact with them using natural language queries. Built with React, Node.js, and Python Flask, featuring Google's Gemini AI for intelligent document analysis.

## 🌟 Features

### 🔐 User Authentication
- Secure user registration and login system
- JWT-based authentication with refresh tokens
- Password encryption using bcrypt
- Email verification with OTP

### 📄 Document Management
- Upload multiple PDF documents
- Secure file storage with user-specific access
- Document organization and management
- File validation and size restrictions

### 🤖 AI-Powered Q&A
- **Google Gemini 2.0 Flash** integration for intelligent responses
- **RAG (Retrieval-Augmented Generation)** for context-aware answers
- **FAISS vector database** for efficient document indexing
- **LangChain** framework for advanced AI workflows
- Real-time conversation with uploaded documents

### 📊 User Dashboard
- Interactive dashboard with usage statistics
- Recent documents and query history
- Active chat sessions management
- Quick access to frequently used features

### 🔍 Advanced Search
- Semantic search across document content
- Context-aware question answering
- Conversation history tracking
- Source document references

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Node.js Server │    │  Python AI API  │
│                 │    │                 │    │                 │
│ • User Interface│◄──►│ • Authentication│◄──►│ • PDF Processing│
│ • File Upload   │    │ • File Storage  │    │ • AI Integration│
│ • Chat Interface│    │ • User Management│   │ • Vector Search │
│ • Dashboard     │    │ • API Gateway   │    │ • RAG Pipeline  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend (React)
- **React 18** with Vite for fast development
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Bootstrap** for UI components
- **Axios** for API communication
- **React Toastify** for notifications
- **React Icons** for iconography

### Backend (Node.js)
- **Express.js** web framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Nodemailer** for email services
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

### AI Service (Python)
- **Flask** web framework
- **Google Generative AI** (Gemini 2.0 Flash)
- **LangChain** for AI workflows
- **FAISS** for vector similarity search
- **PyPDF2** for PDF text extraction
- **Python-dotenv** for environment management

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB
- Google AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd DE
   ```

2. **Install Client Dependencies**
   ```bash
   cd Client
   npm install
   ```

3. **Install Server Dependencies**
   ```bash
   cd ../Server
   npm install
   ```

4. **Install AI Service Dependencies**
   ```bash
   cd ../AI
   pip install -r requirements.txt
   ```

### Environment Setup

1. **Server Environment Variables** (`Server/.env`)
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

2. **AI Service Environment Variables** (`AI/.env`)
   ```env
   GOOGLE_API_KEY=your_google_ai_api_key
   FLASK_SECRET_KEY=your_flask_secret_key
   ```

### Running the Application

1. **Start the Server**
   ```bash
   cd Server
   npm run dev
   ```
   Server will run on `http://localhost:3500`

2. **Start the AI Service**
   ```bash
   cd AI
   python app.py
   ```
   AI service will run on `http://localhost:5000`

3. **Start the Client**
   ```bash
   cd Client
   npm run dev
   ```
   Client will run on `http://localhost:5173`

## 📁 Project Structure

```
DE/
├── Client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── Pages/         # Page components
│   │   ├── context/       # React context
│   │   └── utils/         # Utility functions
│   └── package.json
├── Server/                # Node.js Backend
│   ├── config/           # Database configuration
│   ├── controller/       # Route controllers
│   ├── middlewares/      # Custom middlewares
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── package.json
├── AI/                   # Python AI Service
│   ├── app.py           # Flask application
│   ├── requirements.txt # Python dependencies
│   └── uploads/         # PDF storage
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-otp` - Email verification

### PDF Management
- `POST /api/pdf/upload` - Upload PDF files
- `GET /api/pdf/documents` - Get user documents
- `DELETE /api/pdf/:id` - Delete document

### AI Q&A
- `POST /ai/upload` - Upload PDFs for AI processing
- `POST /ai/query` - Ask questions about documents
- `POST /ai/clear-vector-data` - Clear AI session data

## 🤖 AI Features

### RAG Pipeline
1. **Document Processing**: PDF text extraction and chunking
2. **Vector Embedding**: Convert text chunks to embeddings using Google AI
3. **Indexing**: Store embeddings in FAISS vector database
4. **Retrieval**: Semantic search for relevant context
5. **Generation**: Generate answers using Gemini 2.0 Flash

### Key AI Components
- **Text Chunking**: Recursive character text splitting for optimal context
- **Vector Search**: FAISS for fast similarity search
- **Conversation Memory**: Maintain chat history for context
- **Source Tracking**: Reference original document sections

## 🔒 Security Features

- **Password Encryption**: bcrypt hashing
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Cross-origin request security
- **File Validation**: PDF type and size validation
- **User Isolation**: Document access control
- **Environment Variables**: Secure configuration management

## 📱 User Interface

### Dashboard Features
- **Statistics Overview**: Document count, AI sessions, queries, time saved
- **Quick Actions**: Upload documents, start new queries, view history
- **Recent Activity**: Latest documents and queries
- **Active Sessions**: Manage ongoing AI conversations

### Chat Interface
- **Real-time Q&A**: Interactive conversation with documents
- **Context Awareness**: AI remembers conversation history
- **Source References**: Links to relevant document sections
- **File Management**: Easy document switching

## 🚀 Deployment

### Production Setup
1. Set up MongoDB Atlas or self-hosted MongoDB
2. Configure environment variables for production
3. Set up reverse proxy (Nginx) for load balancing
4. Use PM2 for Node.js process management
5. Deploy to cloud platforms (AWS, Vercel, Heroku)

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI** for providing Gemini 2.0 Flash
- **LangChain** for the AI framework
- **FAISS** for vector similarity search
- **React** and **Node.js** communities for excellent documentation

## 📞 Support

For support and questions:
- Create an issue in the repository

---

**Built with ❤️ using React, Node.js, and Python** 
