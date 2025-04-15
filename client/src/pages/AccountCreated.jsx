import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/account-created.css";

const AccountCreated = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || "User";
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  return (
    <div className="account-created">
      <div className="overlap">
        <div className="text-wrapper">account-created.html</div>
      </div>

      <p className="QUIZLET">
        <span className="span">Q</span>
        <span className="text-wrapper-2">UIZLET</span>
      </p>

      <div className="frame">
        <div className="success-icon">✓</div>
        <h1 className="success-title">Account Created!</h1>
        <p className="welcome-text">
          Welcome, <span className="username">{username}</span>! 
          Your account has been successfully created.
        </p>
        
        <div className="login-button" onClick={handleLogin}>
          <div className="button-text">Go to Login</div>
        </div>
      </div>
    </div>
  );
};

export default AccountCreated;