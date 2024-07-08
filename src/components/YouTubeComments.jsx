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
} from "@mui/material";
import RandomPicker from "./RandomPicker"; // Import RandomPicker component
import "./YouTubeComments.css";

const YouTubeComments = () => {
  const [videoId, setVideoId] = useState("");
  const [commentAuthors, setCommentAuthors] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [maxResults, setMaxResults] = useState(10);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");
    const videoIdParam = urlParams.get("videoId");
    const maxResultsParam = urlParams.get("maxResults");

    if (token) {
      setAccessToken(token);
      if (videoIdParam) setVideoId(videoIdParam);
      if (maxResultsParam) setMaxResults(Number(maxResultsParam));
      fetchComments(token, videoIdParam, maxResultsParam);
    }
  }, []);

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
    setCommentAuthors([]); // Clear previous comments to indicate loading

    try {
      const response = await axios.post(
        "https://youtube-comments-backend-23opjzqi7q-uc.a.run.app/youtube/comments",
        {
          videoId: videoId || extractVideoId(videoId),
          accessToken: token || accessToken,
          maxResults,
        }
      );
      if (response.data && response.data.length > 0) {
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
        console.log("Fetched authors:", authors);
      } else {
        setError("No comments found.");
        console.log("No comments found");
      }
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

  const handleFetchComments = async () => {
    if (!accessToken) {
      await handleAuth(videoId, maxResults);
    } else {
      await fetchComments(accessToken, videoId, maxResults);
    }
  };

  const handleWinnerSelected = (selectedWinner) => {
    setWinner(selectedWinner);
    console.log("Winner selected:", selectedWinner);
  };

  return (
    <Container component={Paper} elevation={3} className="youtube-comments">
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
        className="youtube-comments__input"
      />
      <FormControl
        fullWidth
        variant="outlined"
        margin="normal"
        className="youtube-comments__select"
      >
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
      <Button
        variant="contained"
        color="primary"
        onClick={handleFetchComments}
        disabled={loading}
        className="youtube-comments__button"
      >
        Fetch Comments
      </Button>
      {loading && <CircularProgress className="youtube-comments__loading" />}
      {error && (
        <Typography color="error" className="youtube-comments__error">
          {error}
        </Typography>
      )}
      <List className="scrollable-list">
        {commentAuthors.length > 0
          ? commentAuthors.map((author, index) => (
              <ListItem key={index} className="youtube-comments__list-item">
                <ListItemText primary={author} />
              </ListItem>
            ))
          : !loading && (
              <Typography
                variant="body1"
                className="youtube-comments__no-comments"
              >
                No comments to display.
              </Typography>
            )}
      </List>
      <div className="youtube-comments__picker">
        <RandomPicker
          items={commentAuthors}
          onWinnerSelected={handleWinnerSelected}
        />
      </div>
      {winner && (
        <Typography
          variant="h6"
          color="primary"
          className="youtube-comments__winner"
        >
          The winner is: {winner}
        </Typography>
      )}
    </Container>
  );
};

export default YouTubeComments;
