import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
} from "@mui/material";
import RandomPicker from "./RandomPicker";
import "./YouTubeComments.css";

const YouTubeComments = () => {
  const [videoId, setVideoId] = useState("");
  const [commentAuthors, setCommentAuthors] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [maxResults, setMaxResults] = useState(10);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState(null);
  const [screenType, setScreenType] = useState("desktop");

  useEffect(() => {
    const handleResize = () => {
      setScreenType(window.innerWidth < 600 ? "mobile" : "desktop");
    };
    // Call handleResize initially to set the initial screen type
    handleResize();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");
    const videoIdParam = urlParams.get("videoId");
    const maxResultsParam = urlParams.get("maxResults");

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    if (token) {
      setAccessToken(token);
      if (videoIdParam) setVideoId(videoIdParam);
      if (maxResultsParam) setMaxResults(Number(maxResultsParam));
      fetchComments(token, videoIdParam, maxResultsParam);
    }
    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array means this effect runs once on mount

  const extractVideoId = (input) => {
    try {
      const urlObj = new URL(input);
      const params = new URLSearchParams(urlObj.search);
      if (params.has("v")) {
        return params.get("v");
      }
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
      return input;
    }
  };

  const handleAuth = async (videoId, maxResults) => {
    const state = btoa(JSON.stringify({ videoId, maxResults }));
    window.location.href = `https://youtube-comments-backend-23opjzqi7q-uc.a.run.app/auth/google?state=${state}`;
  };

  const fetchComments = async (token, videoId, maxResults) => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        "https://youtube-comments-backend-23opjzqi7q-uc.a.run.app/youtube/comments",
        {
          videoId: videoId || extractVideoId(videoId),
          accessToken: token || accessToken,
          maxResults,
        }
      );
      const commentThreads = response.data;
      const authors = commentThreads.flatMap((thread) => [
        thread.snippet.topLevelComment.snippet.authorDisplayName,
        ...(thread.replies
          ? thread.replies.comments.map(
              (reply) => reply.snippet.authorDisplayName
            )
          : []),
      ]);
      setCommentAuthors(authors);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comment threads", error);
      if (error.response && error.response.status === 401) {
        setError("Session expired. Please re-authenticate.");
        handleAuth(videoId, maxResults);
      } else if (error.response && error.response.status === 404) {
        setError("Video not found");
      } else {
        setError("Failed to fetch comments. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleFetchComments = async (event) => {
    event.preventDefault(); // Prevent form submission from reloading the page
    if (!accessToken) {
      await handleAuth(videoId, maxResults);
    } else {
      await fetchComments(accessToken, videoId, maxResults);
    }
  };

  return (
    <Container
      component={Paper}
      elevation={3}
      sx={{ padding: 4, marginTop: "64px" }} // Adjust the marginTop value
    >
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
        <Select
          value={maxResults}
          onChange={(e) => setMaxResults(Number(e.target.value))}
          label="Max Results"
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>
      <p>You are on a {screenType} browser</p>
      <Box display="flex" justifyContent="center" mt={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={(event) => handleFetchComments(event)}
          disabled={loading}
        >
          Fetch Comment Handles
        </Button>
      </Box>
      {loading && <CircularProgress sx={{ marginTop: 2 }} />}
      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
      <List sx={{ marginTop: 2, maxHeight: 400, overflow: "auto" }}>
        {commentAuthors.length > 0 ? (
          commentAuthors.map((author, index) => (
            <ListItem key={index}>
              <ListItemText primary={author} />
            </ListItem>
          ))
        ) : (
          <Box display="flex" justifyContent="center" width="100%">
            <Typography>No Handles to display.</Typography>
          </Box>
        )}
      </List>
      <RandomPicker items={commentAuthors} onWinnerSelected={setWinner} />
      {winner && (
        <Typography variant="h6" color="primary" sx={{ marginTop: 2 }}>
          The winner is: {winner}
        </Typography>
      )}
    </Container>
  );
};

export default YouTubeComments;
