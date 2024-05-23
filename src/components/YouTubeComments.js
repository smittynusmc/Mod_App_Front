import React, { useState, useEffect } from "react";
import axios from "axios";

const YouTubeComments = () => {
  const [videoId, setVideoId] = useState("");
  const [commentThreads, setCommentThreads] = useState([]);
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
      setCommentThreads(response.data);
    } catch (error) {
      console.error("Error fetching comment threads", error);
    }
  };

  const selectWinner = () => {
    if (commentThreads.length === 0) return;
    const allComments = commentThreads.flatMap(thread => [
      thread.snippet.topLevelComment.snippet.textDisplay,
      ...(thread.replies ? thread.replies.comments.map(reply => reply.snippet.textDisplay) : [])
    ]);
    const winner = allComments[Math.floor(Math.random() * allComments.length)];
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
            {commentThreads.map((thread, index) => (
              <div key={index}>
                <p>{thread.snippet.topLevelComment.snippet.textDisplay}</p>
                {thread.replies && thread.replies.comments.map((reply, replyIndex) => (
                  <p key={replyIndex} style={{ marginLeft: "20px" }}>{reply.snippet.textDisplay}</p>
                ))}
              </div>
            ))}
          </div>
          {commentThreads.length > 0 && (
            <button onClick={selectWinner}>Select Winner</button>
          )}
        </>
      )}
    </div>
  );
};

export default YouTubeComments;
