import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/logout.css";

const Logout = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };
  
  // Handle return to previous page
  const handleReturn = () => {
    navigate(-1);
  };
  
  // Handle view history (placeholder)
  const handleViewHistory = () => {
    navigate('/history'); // You'll need to create this route
  };
  
  // Get username and capitalize first letter
  const username = currentUser?.name || currentUser?.email?.split('@')[0] || "User";

  return (
    <div className="admin-logout">
      <div className="overlap">
        <div className="text-wrapper"></div>
      </div>

      <p className="QUIZLET">
        <span className="span">Q</span>
        <span className="text-wrapper-2">UIZLET</span>
      </p>

      <div className="frame">
        <div className="div">
          <div className="text-wrapper-3">Logged In As</div>

          <div className="frame-2">
            <div className="frame-3">
              <div className="text-wrapper-4">{username}</div>
              <img 
                className="ellipse" 
                alt="User" 
                src="/loggedin.png" 
              />
            </div>

            <div className="frame-wrapper" onClick={handleViewHistory}>
              <div className="frame-4">
                <div className="text-wrapper-5">View History</div>
                <div className="rectangle" />
              </div>
            </div>
          </div>
        </div>

        <div className="div-wrapper" onClick={handleSignOut}>
          <div className="text-wrapper-6">sign out</div>
        </div>
      </div>

      <div className="overlap-group-wrapper" onClick={handleReturn}>
        <div className="overlap-group">
          <div className="text-wrapper-7">return</div>
          <div className="rectangle-2" />
        </div>
      </div>
    </div>
  );
};

export default Logout;