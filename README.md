# 🌿 Leaf Disease Detection

An AI-powered agricultural application that detects plant leaf diseases using deep learning and provides personalized treatment recommendations through real-time chat.

## 📋 Project Overview

**Leaf Disease Detection** is a full-stack web application designed to help farmers and agricultural professionals identify crop diseases at an early stage. The application uses a trained neural network model to analyze leaf images and diagnoses diseases, while leveraging Google's Gemini AI to provide actionable treatment recommendations.

### Key Features

- 🖼️ **AI-Powered Image Analysis** - Upload leaf images and get instant disease detection powered by a pre-trained Keras model
- 💬 **Real-Time Chat Interface** - Interactive socket-based messaging with AI responses using WebSocket technology
- 🔬 **Disease Classification** - Detects Potato diseases including Early Blight, Late Blight, and Health status
- 💊 **Smart Treatment Recommendations** - Integrated Gemini API provides expert agronomic treatment advice
- ⚡ **Real-Time Updates** - Live chat rooms and instant message delivery using Socket.IO
- 📦 **Docker Support** - Containerized deployment with Redis caching for scalability

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 with Vite
- Socket.IO Client for real-time communication
- React Markdown for formatted message rendering
- Emoji Picker for interactive messaging

**Backend:**
- Flask with Flask-SocketIO for WebSocket support
- TensorFlow/Keras for ML model inference
- Google Generative AI (Gemini) for treatment recommendations
- Redis for message caching and chat persistence
- Flask-CORS for cross-origin requests

**Infrastructure:**
- Docker & Docker Compose for containerization
- Redis database for message storage and chat history

### Language Composition
- JavaScript: 39.3% (Frontend)
- Python: 33.3% (Backend & ML)
- CSS: 26.1% (Styling)
- HTML: 1.3% (Markup)

## 📁 Project Structure

```
leaf_disease_detection/
├── backend/
│   ├── app.py                          # Flask app with Socket.IO setup
│   ├── model_handler.py               # ML model inference & Gemini integration
│   ├── requirements.txt                # Python dependencies
│   └── .gitignore
├── frontend/
│   ├── src/                           # React components
│   ├── public/                        # Static assets
│   ├── index.html                     # Entry HTML
│   ├── package.json                   # Node dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── eslint.config.js              # Linting rules
│   └── .gitignore
├── docker-compose.yml                 # Docker services configuration
└── README.md                          # This file
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- Docker & Docker Compose (optional)
- Google Gemini API key (for treatment recommendations)

### Installation

#### Option 1: Local Development

**Backend Setup:**
```bash
cd backend
pip install -r requirements.txt
export GEMINI_API_KEY="your_gemini_api_key_here"
# Ensure Redis is running on localhost:6379
python app.py
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

#### Option 2: Docker Compose

```bash
docker-compose up --build
```

This will start:
- Redis server (port 6379)
- Backend Flask server (port 5000)
- Frontend development server

### Environment Variables

Create a `.env` file in the `backend` directory:
```
GEMINI_API_KEY=your_api_key_here
```

## 📊 How It Works

### 1. Image Upload & Disease Detection
- User uploads a leaf image through the chat interface
- Image is sent to the backend as base64 string
- `model_handler.py` decodes and preprocesses the image (224x224 RGB)
- Pre-trained Keras model predicts disease class
- Prediction includes confidence scores

### 2. Treatment Recommendation
- Upon disease detection, `model_handler.py` calls Google Gemini API
- Gemini generates expert agronomic treatment advice based on the disease
- Recommendations include fungicides, organic remedies, and best practices
- Response is cached for performance optimization

### 3. Real-Time Chat
- Socket.IO enables bidirectional communication
- Chat messages and AI responses are stored in Redis
- Chat history is persisted and retrievable
- Multiple chat rooms support concurrent conversations
- Typing indicators and read status for better UX

## 🎯 API Endpoints & Events

### Socket.IO Events

**Client → Server:**
- `connect` - Client establishes connection
- `get_chats` - Request list of available chat rooms
- `create_chat` - Create a new chat session
- `join_chat` - Join a specific chat room
- `send_message` - Send message with optional image

**Server → Client:**
- `update_chats` - Updated chat list with latest messages
- `chat_history` - Historical messages for a room
- `receive_message` - New incoming message
- `typing` - Typing indicator status

## 🔧 Configuration

### Model Details
- **Model Path:** `Potato_leaf_disease_detection.h5`
- **Input Size:** 224x224 RGB images
- **Classes:** 
  - Potato Early Blight
  - Potato Late Blight
  - Potato Healthy

### Redis Configuration
- **Host:** localhost
- **Port:** 6379
- **Database:** 0
- **Persistence:** AOF enabled via Docker Compose

## 📦 Dependencies

### Backend
- Flask 3.1.3
- TensorFlow/Keras (implicit in model_handler)
- Flask-SocketIO 5.6.1
- Redis 7.4.0
- Google Generative AI
- python-dotenv

### Frontend
- React 19.2.4
- Vite 8.0.4
- Socket.IO Client 4.8.3
- React Markdown 10.1.0

## 🐛 Troubleshooting

### Redis Connection Failed
```
❌ Failed to connect to Redis. Make sure your Redis server is running.
```
**Solution:** Ensure Redis is running via `docker-compose up` or manual Redis installation.

### Gemini API Key Missing
```
❌ GEMINI_API_KEY not found in .env file. AI suggestions will be disabled.
```
**Solution:** Add `GEMINI_API_KEY` to the `.env` file in the backend directory.

### Model Load Failed
```
❌ Failed to load model: [error]
```
**Solution:** Ensure `Potato_leaf_disease_detection.h5` is in the backend root directory.

## 🚦 Future Enhancements

- [ ] Support for multiple crop types (tomato, wheat, corn, etc.)
- [ ] Batch image analysis for field-wide assessments
- [ ] Historical disease tracking per user
- [ ] Mobile app with offline capabilities
- [ ] Integration with weather APIs for predictive analysis
- [ ] Multi-language support
- [ ] User authentication and farm profiles

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📧 Contact & Support

For questions or support, please open an issue on the GitHub repository.

---

**Made with ❤️ for sustainable agriculture**
