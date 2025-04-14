import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import '../styles/home.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <Navbar />
      
      <div className="hero-section">
        <div className="hero-content">
          <h1>Create Interactive Live Surveys</h1>
          <p>Engage your audience with real-time polls, word clouds, and quizzes</p>
          
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/join" className="btn-secondary">Join a Survey</Link>
          </div>
        </div>
        
        <div className="hero-image">
          <img src="/images/hero-illustration.svg" alt="Survey Illustration" />
        </div>
      </div>
      
      <div className="features-section">
        <h2>Powerful Features</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Live Polling</h3>
            <p>Create polls and see responses in real-time</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">☁️</div>
            <h3>Word Clouds</h3>
            <p>Generate beautiful word clouds from audience input</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Participants can join from any device</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Instant Results</h3>
            <p>View and share results instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;