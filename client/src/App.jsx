import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import CreateSurvey from './pages/CreateSurvey';
import PresentSurvey from './pages/PresentSurvey';
// import JoinSurvey from './pages/JoinSurvey';
import SurveyLanding from './pages/SurveyLanding';
import JoinSurveyForm from './pages/JoinSurveyForm';
import ParticipantView from './pages/ParticipantView';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/common/PrivateRoute';
import './styles/main.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/join" element={<JoinSurvey />} /> */}
            <Route path="/join" element={<SurveyLanding />} />
            <Route path="/join/code" element={<JoinSurveyForm />} />
            <Route path="/survey/:code" element={<ParticipantView />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/create" element={
              <PrivateRoute>
                <CreateSurvey />
              </PrivateRoute>
            } />
            <Route path="/edit/:id" element={
              <PrivateRoute>
                <CreateSurvey isEditing={true} />
              </PrivateRoute>
            } />
            <Route path="/present/:surveyId" element={
              <PrivateRoute>
                <PresentSurvey />
              </PrivateRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;