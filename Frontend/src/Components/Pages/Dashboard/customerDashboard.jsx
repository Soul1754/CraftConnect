import DashboardLayout from "../../Others/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold mb-4">Welcome to your Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        {/* Example Cards */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold">Total Appointments</h3>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold">Active Professionals</h3>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold">Community Posts</h3>
          <p className="text-2xl font-bold">8</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
