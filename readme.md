# Medhya - Mental Health and Neurological Care Platform

## 📋 Overview

Medhya is a comprehensive digital mental health platform designed to provide accessible, AI-powered neurological and psychological care. The system integrates advanced machine learning models, real-time communication, and comprehensive assessment tools to support students, counselors, administrators, and healthcare providers.

## 🏗️ System Architecture

### Backend Architecture

**Main Backend Server** (`/backend`)
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time Communication**: Socket.IO for WebRTC video calls and live chat
- **Authentication**: JWT-based authentication with role-based access control
- **File Management**: Cloudinary integration for medical reports and images
- **Email Services**: Nodemailer for notifications and medicine order confirmations

**Routes Structure**:
- **User Management**: User registration, authentication, profile management
- **Assessment Routes**: Mental health assessments, stress evaluation, depression screening
- **Appointment System**: Booking and management of counseling sessions
- **Chat System**: Real-time messaging between students and counselors
- **Crisis Management**: Emergency response and alert systems
- **Resource Hub**: Educational content and mental health resources
- **Community Features**: Peer support groups and forums
- **Journal Routes**: Daily mood tracking and journaling
- **Counselor Dashboard**: Session management and analytics
- **Admin Routes**: System administration and analytics
- **Payment Integration**: Fee management for services
- **Games Routes**: Cognitive assessment games
- **Medicine Orders**: Online pharmacy integration with supplier management
- **Prescription Management**: Digital prescription handling
- **Reports System**: Medical report upload and management

### Frontend Architecture

**Frontend Stack** (`/frontend`)
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS with custom components
- **Routing**: React Router DOM v7
- **State Management**: React Context API
- **Real-time Features**: Socket.IO client for live communication
- **UI Components**: Radix UI primitives with custom styling
- **Charts**: Chart.js and Recharts for data visualization
- **Authentication**: Clerk authentication integration

**Key Components**:
- **Landing Page**: Marketing and service overview
- **Authentication Flow**: Multi-step user registration and login
- **Student Dashboard**: Main interface for students with wellness tracking
- **Counselor Dashboard**: Session management and client oversight
- **Admin Dashboard**: System analytics and management tools
- **AI Chat**: Neurological assistant powered by OpenRouter API
- **Assessment Tools**: Various mental health and cognitive assessments
- **Games Suite**: 8 cognitive assessment games (Go/No-Go, Pattern Replication, etc.)
- **Appointment Booking**: Real-time scheduling with counselor availability
- **Peer Support**: Community forums and support groups
- **Medical Reports**: Document upload and management system
- **Medicine Delivery**: Online pharmacy with supplier integration
- **Crisis Management**: Emergency response coordination
- **Resource Hub**: Educational content and mental health resources

### Machine Learning Services

**EEG Prediction Service** (`/main.py`)
- **Framework**: FastAPI
- **Model**: Custom CNN-LSTM-Attention neural network
- **Purpose**: Epileptic seizure detection from EEG data
- **Input**: CSV files with EEG signal data
- **Output**: Classification into 5 categories (Healthy to Seizure state)
- **Deployment**: Standalone service on port 8001

**Alzheimer's MRI Classifier** (`/alzheimer_flask.py`)
- **Framework**: Flask
- **Model**: ResNet18 fine-tuned for medical imaging
- **Purpose**: Alzheimer's disease detection from MRI scans
- **Input**: MRI images (JPG/PNG)
- **Output**: Classification into 4 impairment levels
- **Deployment**: Standalone service on port 8000

**Neuro Chatbot** (`/app.py`)
- **Framework**: FastAPI
- **AI Model**: Llama 3.3 via OpenRouter API
- **Purpose**: Neurological consultation and mental health guidance
- **Features**: Medical advice, cognitive exercises, wellness tips
- **Deployment**: Standalone service on port 5100

## 🔧 Technical Stack

### Backend Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Real-time**: Socket.IO
- **Authentication**: JWT, bcrypt
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Validation**: Validator.js

### Frontend Technologies
- **Runtime**: Node.js
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context
- **Charts**: Chart.js, Recharts
- **UI Components**: Radix UI
- **Build Tool**: Vite
- **Deployment**: Vercel

### Machine Learning Stack
- **Framework**: PyTorch
- **API Framework**: FastAPI, Flask
- **Data Processing**: pandas, scikit-learn
- **Image Processing**: Pillow, torchvision
- **Model Serving**: FastAPI, Flask
- **AI API**: OpenRouter

### DevOps & Tools
- **Version Control**: Git
- **Package Management**: npm, pip
- **Environment**: dotenv
- **CORS**: Custom middleware
- **Testing**: Various API test utilities
- **Deployment**: Multiple platform support (Vercel, Netlify, etc.)

## 🎯 Core Features

### For Students
- **Comprehensive Dashboard**: Mood tracking, wellness metrics, appointment management
- **AI-Powered Chat**: 24/7 neurological consultation
- **Mental Health Assessments**: Stress, depression, anxiety evaluations
- **Cognitive Games**: 8 specialized games for brain health assessment
- **Appointment Booking**: Real-time counselor scheduling
- **Peer Support**: Community forums and support groups
- **Daily Journal**: Mood tracking and reflection tools
- **Medical Reports**: Secure document management
- **Medicine Delivery**: Online pharmacy services
- **Resource Library**: Educational content and self-help materials

### For Counselors
- **Session Management**: Client appointments and progress tracking
- **Real-time Chat**: Live messaging with students
- **Video Calling**: WebRTC-based video consultations
- **Analytics Dashboard**: Client progress and session analytics
- **Crisis Management**: Emergency response coordination
- **Payment Tracking**: Session fee management
- **Profile Management**: Professional profile and availability

### For Administrators
- **System Analytics**: User engagement, service utilization metrics
- **Counselor Management**: Staff onboarding and oversight
- **Crisis Monitoring**: Real-time emergency response dashboard
- **Institution Management**: Multi-institution support
- **Resource Oversight**: Content management and distribution
- **Payment Analytics**: Revenue and transaction monitoring

### For Suppliers
- **Order Management**: Medicine order processing and fulfillment
- **Inventory Tracking**: Stock management and alerts
- **Delivery Coordination**: Logistics and delivery tracking
- **Payment Processing**: Supplier fee management

## 🧠 AI/ML Capabilities

### EEG Analysis
- **Model Architecture**: CNN-LSTM-Attention network
- **Input**: Time-series EEG data (CSV format)
- **Classification**: 5-level epileptic activity detection
- **Accuracy**: Trained on medical-grade EEG datasets
- **Real-time Processing**: Fast inference for clinical use

### Alzheimer's Detection
- **Model Architecture**: ResNet18 fine-tuned
- **Input**: MRI brain scans
- **Classification**: 4-stage impairment assessment
- **Medical Validation**: Based on established medical imaging standards
- **Secure API**: API key protected endpoints

### AI Assistant
- **Model**: Meta Llama 3.3 70B Instruct
- **Capabilities**:
  - Neurological symptom assessment
  - Mental health guidance
  - Cognitive exercise recommendations
  - Wellness and lifestyle advice
  - Medical information (with disclaimers)
- **Safety**: Built-in disclaimers and professional boundaries

## 🔒 Security & Privacy

### Authentication & Authorization
- **Multi-role System**: Student, Counselor, Admin, Supplier roles
- **JWT Tokens**: Secure session management
- **Password Security**: bcrypt hashing with salt
- **Profile Completion**: Required verification for certain features

### Data Protection
- **Medical Data**: HIPAA-compliant handling procedures
- **File Security**: Encrypted storage via Cloudinary
- **API Security**: Key-based authentication for ML services
- **CORS Protection**: Configurable origin restrictions

### Privacy Features
- **Data Encryption**: End-to-end encryption for sensitive communications
- **Access Control**: Role-based data access restrictions
- **Audit Logging**: Comprehensive activity tracking
- **Consent Management**: User data sharing controls

## 🚀 Deployment & Scaling

### Service Architecture
- **Microservices Design**: Independent deployment of ML services
- **Container Ready**: Docker-compatible architecture
- **Load Balancing**: Designed for horizontal scaling
- **Database Sharding**: MongoDB clustering support

### Environment Configuration
- **Development**: Local development with hot reload
- **Staging**: Pre-production testing environment
- **Production**: Optimized builds with error monitoring

### Monitoring & Analytics
- **Health Checks**: Automated service monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time and throughput monitoring
- **User Analytics**: Engagement and usage statistics

## 📊 Database Schema

### Core Collections
- **Users**: Student, counselor, and admin profiles
- **Appointments**: Session scheduling and management
- **Messages**: Chat history and real-time communications
- **Assessments**: Test results and progress tracking
- **Games**: Cognitive game scores and analytics
- **Journals**: Daily mood and reflection entries
- **Reports**: Medical document storage and metadata
- **Orders**: Medicine order tracking and fulfillment
- **Community**: Posts, comments, and peer support content

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB
- Git

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### ML Services Setup
```bash
# EEG Service
pip install fastapi uvicorn torch scikit-learn pandas
python main.py

# Alzheimer's Service
pip install flask torch torchvision pillow scikit-learn
python alzheimer_flask.py

# AI Chat Service
pip install fastapi uvicorn requests python-dotenv
python app.py
```

## 📈 Future Roadmap

### Planned Enhancements
- **Mobile App**: Native iOS and Android applications
- **Advanced AI**: Integration with more specialized medical AI models
- **Telemedicine**: Enhanced video consultation features
- **IoT Integration**: Wearable device data integration
- **Multi-language**: Support for additional languages
- **Offline Mode**: Limited functionality without internet
- **Advanced Analytics**: Predictive health insights
- **Integration APIs**: EHR system integrations

### Research & Development
- **Clinical Validation**: Partnership with medical institutions
- **Model Improvement**: Continuous ML model training and validation
- **Feature Expansion**: New assessment tools and therapeutic content
- **User Experience**: UX research and iterative improvements

## 🤝 Contributing

Medhya welcomes contributions from healthcare professionals, developers, and mental health advocates. Please review our contribution guidelines and code of conduct.

## 📜 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📞 Support & Contact

For technical support, feature requests, or partnership inquiries, please contact the development team or create an issue in the project repository.

## ⚕️ Medical Disclaimer

This platform is designed to complement, not replace, professional medical care. All AI-generated advice includes appropriate disclaimers, and users are encouraged to consult licensed healthcare providers for diagnosis and treatment.