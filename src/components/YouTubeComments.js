import React, { useState, useEffect } from "react";
import axios from "axios";
import "./YouTubeComments.css"; // Import the new CSS file

const YouTubeComments = () => {
  const [videoId, setVideoId] = useState("");
  const [commentAuthors, setCommentAuthors] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [maxResults, setMaxResults] = useState(10); // Default to 10 comments per request
  const [error, setError] = useState(null);

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

  const handleAuth = () => {
    window.location.href = "https://youtube-comments-backend-23opjzqi7q-uc.a.run.app/auth/google"; // Replace with your Cloud Run URL
  };

  const fetchComments = async () => {
    setError(null);
    const validVideoId = extractVideoId(videoId);
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
    } catch (error) {
      console.error("Error fetching comment threads", error);
      if (error.response && error.response.status === 404) {
        setError("Video not found");
      } else {
        setError("Failed to fetch comments. Please try again.");
      }
    }
  };

  const selectWinner = () => {
    if (commentAuthors.length === 0) return;
    const winner = commentAuthors[Math.floor(Math.random() * commentAuthors.length)];
    alert(`The winner is: ${winner}`);
  };

  return (
    <div>
      {!accessToken ? (
        <button onClick={handleAuth}>Authenticate with Google</button>
      ) : (
        <>
          <input
            type="text"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            placeholder="Enter YouTube Video URL or ID"
          />
          <select value={maxResults} onChange={(e) => setMaxResults(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <button onClick={fetchComments}>Fetch Comments</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="scrollable-list">
            {commentAuthors.map((author, index) => (
              <p key={index}>{author}</p>
            ))}
          </div>
          {commentAuthors.length > 0 && (
            <button onClick={selectWinner}>Select Winner</button>
          )}
        </>
      )}
    </div>
  );
};

export default YouTubeComments;
