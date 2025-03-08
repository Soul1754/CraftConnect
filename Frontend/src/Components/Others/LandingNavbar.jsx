import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white p-4 text-white flex justify-between w-full positon-top">
      <h1 className="text-2xl font-bold">CraftConnect</h1>
      <div className="flex items-center gap-4 justify-between">
        <Link to="/login" className="mx-2 px-4 py-2 bg-blue-500 rounded">
          Login
        </Link>
        <Link to="/signup" className="mx-2 px-4 py-2 bg-green-500 rounded">
          Register
        </Link>
      </div>
    </nav>
  );
}
