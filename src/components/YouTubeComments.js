import React, { useState, useEffect } from "react";
import axios from "axios";

const YouTubeComments = () => {
  const [videoId, setVideoId] = useState("");
  const [comments, setComments] = useState([]);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const handleAuth = () => {
    window.location.href = "https://youtube-comments-backend-xxxxx.a.run.app/auth/google"; // Replace with your Cloud Run URL
  };

  const fetchComments = async () => {
    try {
      const response = await axios.post("https://youtube-comments-backend-23opjzqi7q-uc.a.run.app", { // Replace with your Cloud Run URL
        videoId,
        accessToken,
      });
      const commentsData = response.data.map(
        (item) => item.snippet.topLevelComment.snippet.textDisplay
      );
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  const selectWinner = () => {
    if (comments.length === 0) return;
    const winner = comments[Math.floor(Math.random() * comments.length)];
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
            placeholder="Enter YouTube Video ID"
          />
          <button onClick={fetchComments}>Fetch Comments</button>
          <div>
            {comments.map((comment, index) => (
              <p key={index}>{comment}</p>
            ))}
          </div>
          {comments.length > 0 && (
            <button onClick={selectWinner}>Select Winner</button>
          )}
        </>
      )}
    </div>
  );
};

export default YouTubeComments;
