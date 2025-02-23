import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <div className="flex space-x-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => navigate("/signup/customer")}
        >
          Sign up as Customer
        </button>
        <button
          className="px-6 py-2 bg-green-500 text-white rounded-lg"
          onClick={() => navigate("/signup/professional/step1")}
        >
          Sign up as Professional
        </button>
      </div>
    </div>
  );
}
