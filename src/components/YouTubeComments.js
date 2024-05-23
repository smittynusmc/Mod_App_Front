import React, { useState, useEffect } from "react";
import axios from "axios";

const YouTubeComments = () => {
  const [videoId, setVideoId] = useState("");
  const [commentAuthors, setCommentAuthors] = useState([]);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const handleAuth = () => {
    window.location.href = "https://youtube-comments-backend-23opjzqi7q-uc.a.run.app/auth/google"; // Replace with your Cloud Run URL
  };

  const fetchComments = async () => {
    try {
      const response = await axios.post("https://youtube-comments-backend-23opjzqi7q-uc.a.run.app/youtube/comments", { // Replace with your Cloud Run URL
        videoId,
        accessToken,
      });
      const commentThreads = response.data;
      const authors = commentThreads.flatMap(thread => [
        thread.snippet.topLevelComment.snippet.authorDisplayName,
        ...(thread.replies ? thread.replies.comments.map(reply => reply.snippet.authorDisplayName) : [])
      ]);
      setCommentAuthors(authors);
    } catch (error) {
      console.error("Error fetching comment threads", error);
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
            placeholder="Enter YouTube Video ID"
          />
          <button onClick={fetchComments}>Fetch Comments</button>
          <div>
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
