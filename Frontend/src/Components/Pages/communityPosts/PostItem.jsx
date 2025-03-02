// src/Components/Pages/customer/Community/PostItem.jsx
import React, { useState } from "react";

export default function PostItem({ post, onReply }) {
  const [reply, setReply] = useState("");

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (reply.trim()) {
      onReply(post._id, reply);
      setReply("");
    }
  };

  return (
    <div className="p-4 border rounded mb-4">
      <p className="font-bold">{post.content}</p>
      <p className="text-sm text-gray-500">Tags: {post.tags.join(", ")}</p>
      <form onSubmit={handleReplySubmit} className="mt-2">
        <input
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write a reply..."
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
        >
          Reply
        </button>
      </form>
      <div className="mt-2">
        {post.replies.map((r, index) => (
          <p key={index} className="text-sm text-gray-700">
            {r}
          </p>
        ))}
      </div>
    </div>
  );
}
