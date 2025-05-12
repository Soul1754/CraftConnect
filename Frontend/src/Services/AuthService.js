// src/Services/AuthService.js

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const login = async (credentials) => {
  // Replace with your actual API call
  // const response = await axios.post('/api/auth/login', credentials);
  // localStorage.setItem('token', response.data.token);
  // return response.data;
  throw new Error(
    "Login function not implemented yet. Integrate with your backend."
  );
};

export const logout = () => {
  localStorage.removeItem("token");
  // Potentially also clear user data from context or state
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) {
    return false;
  }
  // Optionally, decode token to check expiry if not handled by AuthContext
  // try {
  //   const decoded = jwtDecode(token);
  //   const currentTime = Date.now() / 1000;
  //   return decoded.exp > currentTime;
  // } catch (error) {
  //   console.error("Failed to decode token:", error);
  //   return false;
  // }
  return true; // Simplified: if token exists, assume authenticated for now
};

// You might also want to move register, etc., functions here
