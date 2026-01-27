# Personal Assistant Dashboard

A comprehensive AI-powered personal assistant dashboard with task management, resume building, and job preparation features.

## Features

### 🔐 Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes

### 🤖 AI Assistant (Gemini-powered)
- Context-aware responses
- Resume improvement suggestions
- Interview practice with feedback
- Communication coaching
- Question generation

### ✅ Task Management
- Create, edit, and delete tasks
- Priority levels (low, medium, high)
- Status tracking (pending, in progress, completed)
- Due date management

### 📝 Notes
- Personal note-taking
- Tag organization
- Link notes to tasks or job roles

### 📄 Resume Builder
- Multiple resumes for different job roles
- AI-powered improvement suggestions
- ATS optimization

### 🎤 Job Practice
- Interview question practice
- Communication improvement
- Resource management

## Tech Stack

### Backend
- **Flask** - Python web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Google Gemini API** - AI features

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB (local or Atlas)
- Google Gemini API key

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Mac/Linux
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

5. **Configure environment variables in `.env`:**
   ```
   MONGODB_URI=mongodb://localhost:27017/personal_assistant
   JWT_SECRET=your-secret-key-change-this-in-production
   GEMINI_API_KEY=your-gemini-api-key-here
   FLASK_ENV=development
   PORT=5000
   ```

6. **Get Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

7. **Start MongoDB:**
   - If using local MongoDB: `mongod`
   - If using MongoDB Atlas: Update `MONGODB_URI` with your connection string

8. **Run the backend:**
   ```bash
   python app.py
   ```
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## Usage

1. **Access the application:**
   - Portfolio: `http://localhost:5173`
   - Login: `http://localhost:5173/login`
   - Signup: `http://localhost:5173/signup`

2. **Create an account:**
   - Click "Sign up" on the login page
   - Fill in your details
   - You'll be redirected to the dashboard

3. **Explore features:**
   - **AI Assistant**: Chat with AI for help with tasks, resumes, and interviews
   - **Tasks**: Manage your daily tasks
   - **Notes**: Keep track of important information
   - **Resumes**: Create and improve resumes for different job roles
   - **Job Practice**: Practice interviews and improve communication

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/refresh` - Refresh JWT token (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (protected)
- `POST /api/tasks` - Create task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `PATCH /api/tasks/:id/status` - Update task status (protected)

### Notes
- `GET /api/notes` - Get all notes (protected)
- `POST /api/notes` - Create note (protected)
- `PUT /api/notes/:id` - Update note (protected)
- `DELETE /api/notes/:id` - Delete note (protected)

### Resumes
- `GET /api/resumes` - Get all resumes (protected)
- `POST /api/resumes` - Create resume (protected)
- `GET /api/resumes/:id` - Get specific resume (protected)
- `PUT /api/resumes/:id` - Update resume (protected)
- `DELETE /api/resumes/:id` - Delete resume (protected)
- `POST /api/resumes/:id/improve` - Get AI improvement suggestions (protected)

### AI Assistant
- `POST /api/assistant/chat` - Chat with AI (protected)
- `POST /api/assistant/interview-practice` - Practice interview (protected)
- `POST /api/assistant/improve-communication` - Improve communication (protected)
- `POST /api/assistant/generate-questions` - Generate practice questions (protected)

## Project Structure

```
portfolio-home/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── services/        # Gemini AI service
│   ├── utils/           # Helper functions
│   ├── app.py           # Flask app
│   ├── config.py        # Configuration
│   └── requirements.txt # Python dependencies
├── src/
│   ├── components/      # React components
│   │   ├── auth/        # Authentication components
│   │   ├── dashboard/   # Dashboard components
│   │   ├── assistant/   # AI assistant components
│   │   ├── tasks/       # Task components
│   │   ├── notes/       # Note components
│   │   └── resumes/     # Resume components
│   ├── context/         # React contexts
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   └── App.tsx          # Main app component
└── package.json         # Node dependencies
```

## Development

### Adding New Features

1. **Backend:**
   - Create model in `backend/models/`
   - Create routes in `backend/routes/`
   - Register blueprint in `backend/app.py`

2. **Frontend:**
   - Create types in `src/types/`
   - Create components in `src/components/`
   - Add routes in `src/pages/Dashboard.tsx`

### Environment Variables

**Backend (.env):**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `GEMINI_API_KEY` - Google Gemini API key
- `FLASK_ENV` - Environment (development/production)
- `PORT` - Backend port (default: 5000)

**Frontend:**
- API base URL is configured in `src/services/api.ts`

## Deployment

### Backend
- Deploy to Render, Railway, or Heroku
- Set environment variables
- Use `gunicorn` for production

### Frontend
- Deploy to Vercel or Netlify
- Update API base URL in production

## Future Enhancements

- [ ] Voice-based assistant (speech-to-speech)
- [ ] Daily task summary via AI
- [ ] Mock interview scoring dashboard
- [ ] Calendar integration
- [ ] Application tracking
- [ ] Email notifications
- [ ] Mobile app

## License

MIT

## Author

Rahul Rathore
- Email: rahulrathore39769@gmail.com
- GitHub: [@rahulrathore579](https://github.com/rahulrathore579)
- LinkedIn: [rahulrathore39769](https://linkedin.com/in/rahulrathore39769)
