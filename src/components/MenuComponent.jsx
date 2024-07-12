import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import "./MenuComponent.css"; // Import the CSS file

const signOutUser = async () => {
  try {
    await signOut(auth);
    toast.success("User logged out successfully", {
      position: "top-center",
    });
    window.location.href = "/login"; // Redirect to login page or any other page
  } catch (error) {
    console.error("Error during sign-out:", error);
    toast.error("Error during sign-out. Please try again.", {
      position: "bottom-center",
    });
  }
};

const MenuComponent = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOutUser();
    handleClose();
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  const handleFetchVideos = () => {
    navigate("/youtube-comments");
    handleClose();
  };

  const handleRandomPicker = () => {
    navigate("/test");
    handleClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" className="app-bar">
        <Toolbar className="toolbar">
          <Typography variant="h6" className="toolbar-title">
            My App
          </Typography>
          <div>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleFetchVideos}>Fetch Videos</MenuItem>
              <MenuItem onClick={handleRandomPicker}>Test</MenuItem>
              <MenuItem onClick={handleLogout}>Log Off</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MenuComponent;
