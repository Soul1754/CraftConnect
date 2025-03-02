// src/Components/Pages/communityPosts/CommunityPosts.jsx
import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import PostForm from "./PostForm";
import PostItem from "./PostItem";
import { AuthContext } from "../../../Context/AuthContext";
import DashboardLayout from "../../Others/DashboardLayout";
import Dashboard from "../Dashboard/CustomerDashboard";
const socket = io("http://localhost:5001");

export default function CommunityPosts() {
  const { auth } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    socket.emit("getPosts");
    socket.on("posts", (data) => setPosts(data));
    return () => socket.off("posts");
  }, []);

  const handleNewPost = (post) => {
    socket.emit("newPost", post);
  };

  const handleNewReply = (postId, reply) => {
    socket.emit("newReply", { postId, reply });
  };

  return (
    <DashboardLayout>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Community Posts</h1>
      {auth.role === "customer" && <PostForm onPost={handleNewPost} />}
      <div className="mt-4">
        {posts.map((post) => (
          <PostItem key={post._id} post={post} onReply={handleNewReply} />
        ))}
      </div>
      </div>
      </DashboardLayout>
  );
}
``