import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography, Container, Paper, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import "./YouTubeComments.css"; // Import the new CSS file

const YouTubeComments = () => {
  const [videoId, setVideoId] = useState("");
  const [commentAuthors, setCommentAuthors] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [maxResults, setMaxResults] = useState(10); // Default to 10 comments per request
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const extractVideoId = (input) => {
    try {
      const urlObj = new URL(input);
      const params = new URLSearchParams(urlObj.search);
      if (params.has("v")) {
        return params.get("v");
      }
      // Handle other YouTube URL formats if necessary
      const pathname = urlObj.pathname;
      if (pathname.startsWith("/embed/")) {
        return pathname.split("/embed/")[1];
      }
      if (pathname.startsWith("/v/")) {
        return pathname.split("/v/")[1];
      }
      if (pathname.startsWith("/watch")) {
        return params.get("v");
      }
      return input;
    } catch (e) {
      // If input is not a valid URL, assume it's a plain video ID
      return input;
    }
  };

  const handleAuth = async () => {
    window.location.href = "https://youtube-comments-backend-23opjzqi7q-uc.a.run.app/auth/google"; // Replace with your Cloud Run URL
  };

  const fetchComments = async () => {
    setError(null);
    setLoading(true);

    // Check if access token is available, if not handle authentication
    if (!accessToken) {
      console.log("No access token found. Initiating authentication...");
      await handleAuth();
      return;
    }

    const validVideoId = extractVideoId(videoId);
    console.log("Fetching comments for video ID:", validVideoId);
    try {
      const response = await axios.post("https://youtube-comments-backend-23opjzqi7q-uc.a.run.app/youtube/comments", { // Replace with your Cloud Run URL
        videoId: validVideoId,
        accessToken,
        maxResults,
      });
      const commentThreads = response.data;
      const authors = commentThreads.flatMap(thread => [
        thread.snippet.topLevelComment.snippet.authorDisplayName,
        ...(thread.replies ? thread.replies.comments.map(reply => reply.snippet.authorDisplayName) : [])
      ]);
      setCommentAuthors(authors);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comment threads", error);
      if (error.response && error.response.status === 401) {
        setError("Session expired. Please re-authenticate.");
        await handleAuth(); // Prompt re-authentication
      } else if (error.response && error.response.status === 404) {
        setError("Video not found");
      } else {
        setError("Failed to fetch comments. Please try again.");
      }
      setLoading(false);
    }
  };

  const selectWinner = () => {
    if (commentAuthors.length === 0) return;
    const winner = commentAuthors[Math.floor(Math.random() * commentAuthors.length)];
    alert(`The winner is: ${winner}`);
  };

  return (
    <Container component={Paper} elevation={3} sx={{ padding: 4, marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>
        YouTube Comment Picker
      </Typography>
      <TextField
        fullWidth
        label="YouTube Video URL or ID"
        variant="outlined"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
        margin="normal"
      />
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>Max Results</InputLabel>
        <Select value={maxResults} onChange={(e) => setMaxResults(Number(e.target.value))} label="Max Results">
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={fetchComments} disabled={loading}>
        Fetch Comments
      </Button>
      {loading && <CircularProgress sx={{ marginTop: 2 }} />}
      {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
      <List sx={{ marginTop: 2, maxHeight: 400, overflow: 'auto' }}>
        {commentAuthors.map((author, index) => (
          <ListItem key={index}>
            <ListItemText primary={author} />
          </ListItem>
        ))}
      </List>
      {commentAuthors.length > 0 && (
        <Button variant="contained" color="secondary" onClick={selectWinner} sx={{ marginTop: 2 }}>
          Select Winner
        </Button>
      )}
    </Container>
  );
};

export default YouTubeComments;
