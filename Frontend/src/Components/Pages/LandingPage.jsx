import Navbar from "../Others/LandingNavbar";

export default function LandingPage() {
  return (
    <>
      <Navbar />
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mt-10">Welcome to CraftConnect</h1>
      <p className="mt-4 text-lg">Connect with professionals easily!</p>
    </div>
    </>
  );
}
