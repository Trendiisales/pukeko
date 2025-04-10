import React, { useState } from "react";
import Button from "./common/Button";

const SocialMediaPoster = ({ onPostSubmit }) => {
  const [content, setContent] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      if (onPostSubmit) {
        onPostSubmit(content);
      } else {
        alert("Post submitted: " + content);
      }
      setContent(""); // Clear the input after submission
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={handleSubmit}
            className="px-6"
          >
            Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SocialMediaPoster;