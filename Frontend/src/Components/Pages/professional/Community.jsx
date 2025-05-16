import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfessionalLayout from "../../Layout/ProfessionalLayout";
import { useNavigate } from "react-router-dom";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [tagFilter, setTagFilter] = useState("");
  const [maxDistance, setMaxDistance] = useState(10000); // 10km default
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Quotation form state
  const [quotationData, setQuotationData] = useState({
    content: "",
    amount: "",
    estimatedTime: "",
    additionalNotes: "",
  });

  // Available service tags for filtering
  const availableTags = [
    "All",
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

  // Fetch posts when location or filters change
  useEffect(() => {
    if (locationPermission && userLocation) {
      fetchNearbyPosts();
    }
  }, [locationPermission, userLocation, tagFilter, maxDistance]);

  // Filter posts based on search query
  useEffect(() => {
    if (posts.length > 0) {
      if (searchQuery.trim() === "") {
        setFilteredPosts(posts);
      } else {
        const filtered = posts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        );
        setFilteredPosts(filtered);
      }
    } else {
      setFilteredPosts([]);
    }
  }, [posts, searchQuery]);

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
            "Location permission is required to view nearby posts. Please enable location services."
          );
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Fetch nearby posts from API
  const fetchNearbyPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to view nearby posts");
        setLoading(false);
        return;
      }

      // Build query parameters
      let queryParams = `longitude=${userLocation.longitude}&latitude=${userLocation.latitude}&maxDistance=${maxDistance}`;
      if (tagFilter && tagFilter !== "All") {
        queryParams += `&tags=${tagFilter}`;
      }

      const response = await axios.get(
        `http://localhost:5001/api/community/nearby-posts?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPosts(response.data);
      setFilteredPosts(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching nearby posts:", err);
      setError("Failed to load nearby posts. Please try again later.");
      setLoading(false);
    }
  };

  // Handle quotation form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuotationData({ ...quotationData, [name]: value });
  };
  const navigate = useNavigate();
  // Submit quotation
  const handleSubmitQuotation = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to submit a quotation");
        return;
      }

      const quotationPayload = {
        postId: selectedPost._id,
        ...quotationData,
      };

      await axios.post(
        "http://localhost:5001/api/community/submit-quotation",
        quotationPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Reset form and state
      setQuotationData({
        content: "",
        amount: "",
        estimatedTime: "",
        additionalNotes: "",
      });
      setShowQuotationForm(false);
      setSelectedPost(null);

      // Refresh posts
      fetchNearbyPosts();
    } catch (err) {
      console.error("Error submitting quotation:", err);
      if (err.response?.data?.errorCode === "BANK_DETAILS_REQUIRED") {
        navigate(err.response.data.redirectUrl);
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to submit quotation. Please try again."
        );
      }
    }
  };

  // Format distance in a readable way
  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${meters.toFixed(0)} m`;
    } else {
      return `${(meters / 1000).toFixed(1)} km`;
    }
  };

  return (
    <ProfessionalLayout>
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
            Nearby Service Requests
          </h1>
          {!locationPermission && (
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              onClick={requestLocationPermission}
            >
              Grant Location Permission
            </button>
          )}
        </div>

        {/* Filters */}
        {locationPermission && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="mb-4 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search service requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Service Type
                </label>
                <select
                  className="p-2 border rounded-lg"
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                >
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Max Distance
                </label>
                <select
                  className="p-2 border rounded-lg"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                >
                  <option value="1000">1 km</option>
                  <option value="5000">5 km</option>
                  <option value="10000">10 km</option>
                  <option value="25000">25 km</option>
                  <option value="50000">50 km</option>
                </select>
              </div>

              <button
                className="mt-5 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={fetchNearbyPosts}
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Selected Post Detail with Quotation Form */}
        {selectedPost && (
          <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-blue-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {selectedPost.user?.name || "Customer"}
                  </span>
                  <span className="text-sm text-gray-500">
                    • {new Date(selectedPost.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => {
                  setSelectedPost(null);
                  setShowQuotationForm(false);
                }}
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-4">{selectedPost.content}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {selectedPost.tags &&
                selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
            </div>

            <button
              className={`w-full py-2 rounded-lg ${
                showQuotationForm
                  ? "bg-gray-300 text-gray-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              onClick={() => setShowQuotationForm(!showQuotationForm)}
            >
              {showQuotationForm ? "Cancel Quotation" : "Submit Quotation"}
            </button>

            {showQuotationForm && (
              <form
                onSubmit={handleSubmitQuotation}
                className="mt-4 border-t pt-4"
              >
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="content"
                    value={quotationData.content}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                    placeholder="Describe how you can help with this request..."
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Price Quote (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={quotationData.amount}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your price"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    name="estimatedTime"
                    value={quotationData.estimatedTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. 2 hours, 3 days"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={quotationData.additionalNotes}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    rows="2"
                    placeholder="Any additional information..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                >
                  Submit Quotation
                </button>
              </form>
            )}
          </div>
        )}

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-4">Loading nearby posts...</div>
        ) : !locationPermission ? (
          <div className="text-center py-4 text-gray-500">
            Please grant location permission to view nearby service requests.
          </div>
        ) : filteredPosts.length === 0 && searchQuery ? (
          <div className="text-center py-4 text-gray-500">
            No service requests found matching your search. Try different keywords.
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No service requests found in your area. Try increasing the distance
            or changing filters.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {post.title}
                    </h2>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {post.user?.name || "Customer"}
                      </span>
                      <span className="text-sm text-gray-500">
                        • {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.location && userLocation && (
                        <span className="text-sm text-gray-500">
                          • {formatDistance(post.distance || 0)} away
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  {post.content.length > 150
                    ? `${post.content.substring(0, 150)}...`
                    : post.content}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags &&
                    post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                <button
                  onClick={() => setSelectedPost(post)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfessionalLayout>
  );
};

export default Community;
