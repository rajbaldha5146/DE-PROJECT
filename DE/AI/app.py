import os
import tempfile
from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader
import google.generativeai as genai
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.chains import ConversationalRetrievalChain
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure API key
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Flask app setup
app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

# Create upload folder if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# PDF processing functions
def get_pdf_text(pdf_files):
    """Extract text from PDF files"""
    text = ""
    for pdf in pdf_files:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

def get_text_chunks(text):
    """Split text into chunks"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks

def create_vector_store(text_chunks):
    """Create FAISS vector store from text chunks"""
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embeddings)
    return vector_store

def get_conversational_chain(vector_store):
    """Create a conversational chain with RAG and Gemini"""
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vector_store.as_retriever(search_kwargs={"k": 3}),
        return_source_documents=True
    )
    return conversation_chain

def process_query(query, vector_store, chat_history):
    """Process user query and return response"""
    if vector_store is None:
        return "Please upload PDF files first."
    
    conversation_chain = get_conversational_chain(vector_store)
    response = conversation_chain(
        {"question": query, "chat_history": chat_history}
    )
    
    return response["answer"]

# Initialize session variables
@app.before_request
def initialize_session():
    if 'conversation_history' not in session:
        session['conversation_history'] = []
    if 'chat_history' not in session:
        session['chat_history'] = []
    if 'vector_store' not in session:
        session['vector_store_exists'] = False
    if 'uploaded_filenames' not in session:
        session['uploaded_filenames'] = []


@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'pdf_files' not in request.files:
        return jsonify({
            'success': False,
            'message': 'No files selected',
            'data': None
        }), 400
    
    files = request.files.getlist('pdf_files')
    
    if not files or files[0].filename == '':
        return jsonify({
            'success': False,
            'message': 'No files selected',
            'data': None
        }), 400
    
    # Save uploaded files temporarily
    temp_files = []
    filenames = []
    for file in files:
        if file and file.filename.endswith('.pdf'):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            temp_files.append(filepath)
            filenames.append(filename)
    
    if temp_files:
        # Process PDFs
        raw_text = get_pdf_text(temp_files)
        
        # Store filenames in session instead of deleting files
        session['uploaded_filenames'] = filenames
        
        # Process the extracted text
        text_chunks = get_text_chunks(raw_text)
        vector_store = create_vector_store(text_chunks)
        
        # Save vector store to disk
        vector_store_path = os.path.join(app.config['UPLOAD_FOLDER'], 'faiss_index')
        vector_store.save_local(vector_store_path)
        session['vector_store_exists'] = True
        
        return jsonify({
            'success': True,
            'message': f'Successfully processed {len(filenames)} PDF files',
            'data': {
                'filenames': filenames
            }
        }), 200
    else:
        return jsonify({
            'success': False,
            'message': 'No valid PDF files were found',
            'data': None
        }), 400

@app.route('/query', methods=['POST'])
def query():
    query = request.form.get('query', '')
    
    if not query:
        return jsonify({
            'success': False,
            'message': 'No query provided',
            'data': None
        }), 400
    
    if not session.get('uploaded_filenames', []):
        return jsonify({
            'success': False,
            'message': 'Please upload PDF files first',
            'data': None
        }), 400
    
    # Load vector store from disk
    vector_store_path = os.path.join(app.config['UPLOAD_FOLDER'], 'faiss_index')
    
    # Check if vector store exists
    if not os.path.exists(vector_store_path):
        return jsonify({
            'success': False,
            'message': 'Error: Vector store not found. Please upload PDFs again.',
            'data': None
        }), 400
        
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.load_local(vector_store_path, embeddings, allow_dangerous_deserialization=True)
    
    # Get chat history
    chat_history = session.get('chat_history', [])
    
    # Process the query
    answer = process_query(query, vector_store, chat_history)
    
    # Update chat history
    chat_history.append((query, answer))
    session['chat_history'] = chat_history
    
    # Update conversation history
    conversation_history = session.get('conversation_history', [])
    conversation_history.append({'role': 'user', 'content': query})
    conversation_history.append({'role': 'assistant', 'content': answer})
    session['conversation_history'] = conversation_history
    
    return jsonify({
        'success': True,
        'message': 'Query processed successfully',
        'data': {
            'query': query,
            'answer': answer,
            'conversation_history': conversation_history
        }
    }), 200

@app.route('/clear-vector-data', methods=['POST'])
def clear_vector_data():
    session['conversation_history'] = []
    session['chat_history'] = []
    
    # Clear uploaded files
    for filename in session.get('uploaded_filenames', []):
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(filepath):
            os.remove(filepath)
    
    session['uploaded_filenames'] = []
    
    return jsonify({
        'success': True,
        'message': 'All data has been cleared',
        'data': None
    }), 200

if __name__ == '__main__':
    app.run(debug=True)