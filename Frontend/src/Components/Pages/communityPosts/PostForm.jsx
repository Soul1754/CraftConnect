// src/Components/Pages/customer/Community/PostForm.jsx
import React, { useState } from "react";

export default function PostForm({ onPost }) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onPost({ content, tags: tags.split(",").map((tag) => tag.trim()) });
      setContent("");
      setTags("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Describe your issue..."
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
        className="w-full p-2 mt-2 border rounded"
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Post
      </button>
    </form>
  );
}
