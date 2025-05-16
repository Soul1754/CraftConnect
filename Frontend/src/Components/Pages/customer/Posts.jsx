import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomerLayout from "../../Layout/CustomerLayout";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    image: "",
  });

  // Available service tags
  const availableTags = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "Cleaning",
    "Landscaping",
    "HVAC",
    "Roofing",
  ];

  // Request location permission on component mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Fetch user posts when component mounts or after creating a new post
  useEffect(() => {
    if (locationPermission && userLocation) {
      fetchUserPosts();
    }
  }, [locationPermission, userLocation]);

  // Request location permission
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Location permission is required to create and view posts. Please enable location services."
          );
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Fetch user posts from API
  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to view your posts");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://craftconnect-1-cb4x.onrender.com/api/community/user-posts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPosts(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user posts:", err);
      setError("Failed to load your posts. Please try again later.");
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle tag selection
  const handleTagChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, tags: selectedOptions });
  };

  // Submit new post
  const handleSubmitPost = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to create a post");
        return;
      }

      if (!userLocation) {
        setError("Location is required to create a post");
        return;
      }

      const postData = {
        ...formData,
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
      };

      await axios.post("https://craftconnect-1-cb4x.onrender.com/api/community/posts", postData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Reset form and state
      setFormData({
        title: "",
        content: "",
        tags: [],
        image: "",
      });
      setShowCreateForm(false);

      // Refresh posts
      fetchUserPosts();
    } catch (err) {
      console.error("Error creating post:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create post. Please try again."
      );
    }
  };

  // Accept a quotation
  const handleAcceptQuotation = async (replyId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to accept a quotation");
        return;
      }

      const response = await axios.post(
        "https://craftconnect-1-cb4x.onrender.com/api/community/accept-quotation",
        { replyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If the quotation was accepted successfully and we should redirect to booking
      if (response.data.redirectToBooking) {
        // Navigate to the booking form with the reply ID
        navigate(`/customer/booking/${replyId}`);
        return;
      }

      // Otherwise, just refresh posts
      fetchUserPosts();
    } catch (err) {
      console.error("Error accepting quotation:", err);
      setError(
        err.response?.data?.message ||
          "Failed to accept quotation. Please try again."
      );
    }
  };

  // Mark post as completed
  const handleMarkCompleted = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to mark a post as completed");
        return;
      }

      await axios.post(
        "https://craftconnect-1-cb4x.onrender.com/api/community/complete-post",
        { postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh posts
      fetchUserPosts();
    } catch (err) {
      console.error("Error marking post as completed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to mark post as completed. Please try again."
      );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button className="float-right" onClick={() => setError(null)}>
              &times;
            </button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            My Service Requests
          </h1>
          {!locationPermission ? (
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              onClick={requestLocationPermission}
            >
              Grant Location Permission
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? "Cancel" : "Create New Request"}
            </button>
          )}
        </div>

        {/* Create Post Form */}
        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Create New Service Request
            </h2>
            <form onSubmit={handleSubmitPost}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="content"
                >
                  Description
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="tags"
                >
                  Service Type (Hold Ctrl/Cmd to select multiple)
                </label>
                <select
                  id="tags"
                  name="tags"
                  multiple
                  value={formData.tags}
                  onChange={handleTagChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="image"
                >
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-4">
            <p>Loading your service requests...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-600">
              You haven't created any service requests yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Posted on {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        post.status === "open"
                          ? "bg-green-100 text-green-800"
                          : post.status === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {post.status === "open"
                        ? "Open"
                        : post.status === "in-progress"
                        ? "In Progress"
                        : "Completed"}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-700">{post.content}</p>
                </div>

                {post.image && (
                  <div className="mt-4">
                    <img
                      src={post.image}
                      alt="Post"
                      className="max-h-64 rounded"
                    />
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Quotations/Replies Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Quotations from Professionals
                  </h3>

                  {post.replies && post.replies.length > 0 ? (
                    <div className="space-y-4">
                      {post.replies.map((reply) => (
                        <div key={reply._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              {reply.user && reply.user.profilePicture ? (
                                <img
                                  src={reply.user.profilePicture}
                                  alt={reply.user.name}
                                  className="w-10 h-10 rounded-full mr-3"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                                  <span className="text-gray-600">
                                    {reply.user && reply.user.name
                                      ? reply.user.name.charAt(0)
                                      : "?"}
                                  </span>
                                </div>
                              )}
                              <div>
                                <p className="font-medium">
                                  {reply.user && reply.user.name
                                    ? reply.user.name
                                    : "Unknown User"}
                                </p>
                                {reply.professionalRating && (
                                  <div className="flex items-center">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <svg
                                          key={i}
                                          className={`h-4 w-4 ${i < Math.round(reply.professionalRating.average) ? 'text-yellow-400' : 'text-gray-300'}`}
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                    </div>
                                    <span className="ml-1 text-sm text-gray-500">
                                      ({reply.professionalRating.total} {reply.professionalRating.total === 1 ? 'review' : 'reviews'})
                                    </span>
                                  </div>
                                )}
                                <p className="text-sm text-gray-500">
                                  {formatDate(reply.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  reply.status === "accepted"
                                    ? "bg-green-100 text-green-800"
                                    : reply.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {reply.status.charAt(0).toUpperCase() +
                                  reply.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-gray-700">{reply.content}</p>

                            {reply.quotation && (
                              <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between">
                                  <p className="font-medium text-gray-800">
                                    Quotation Details:
                                  </p>
                                  <p className="font-bold text-green-600">
                                  ₹{reply.quotation.amount}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Estimated Time:{" "}
                                  {reply.quotation.estimatedTime}
                                </p>
                                {reply.quotation.additionalNotes && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    Notes: {reply.quotation.additionalNotes}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {post.status === "open" &&
                            reply.status === "pending" && (
                              <div className="mt-3 flex justify-end">
                                <button
                                  onClick={() =>
                                    handleAcceptQuotation(reply._id)
                                  }
                                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 text-sm"
                                >
                                  Accept Quotation
                                </button>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No quotations received yet.
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end">
                  {post.status === "in-progress" && (
                    <button
                      onClick={() => handleMarkCompleted(post._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-2"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default Posts;
