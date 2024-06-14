import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/login";
import SignUp from "./components/register";
import Profile from "./components/profile";
import { auth } from "./components/firebase";
import YouTubeComments from "./components/YouTubeComments";
import MenuComponent from "./components/MenuComponent"; // Import the MenuComponent
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Wheel from "./components/Wheel";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <Router>
      <div className="App">
        {user && <MenuComponent />}{" "}
        {/* Render MenuComponent if the user is logged in */}
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/profile" /> : <Login />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/youtube-comments"
                element={<YouTubeComments />}
                className="youtube-comments"
              />
              <Route path="/prize-wheel" element={<Wheel />} />{" "}
              {/* New route for PrizeWheel */}
            </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
