import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { Container, Box, Typography, Button, Avatar, CircularProgress, Alert } from "@mui/material";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async (user) => {
    try {
      if (user) {
        console.log("Fetching user data for UID:", user.uid);
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          console.log("User data:", docSnap.data());
        } else {
          console.log("No such document!");
          setError("No such document!");
        }
      } else {
        console.log("User is not logged in");
        setError("User is not logged in");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is authenticated. UID:", user.uid);
        fetchUserData(user);
      } else {
        console.log("No authenticated user.");
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container component={Box} mt={5}>
      {userDetails ? (
        <Box textAlign="center">
          <Avatar
            alt="User profile"
            src={userDetails.photo}
            sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            Welcome {userDetails.firstName}
          </Typography>
          <Typography variant="body1">
            Email: {userDetails.email}
          </Typography>
          <Typography variant="body1">
            First Name: {userDetails.firstName}
          </Typography>
          {/* <Typography variant="body1">
            Last Name: {userDetails.lastName}
          </Typography> */}
          <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 2 }}>
            Logout
          </Button>
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" mt={5}>
          <Alert severity="info">User is not logged in.</Alert>
        </Box>
      )}
    </Container>
  );
}

export default Profile;
