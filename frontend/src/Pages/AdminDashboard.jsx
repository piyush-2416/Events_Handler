import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Admin panel: saare users ki list (backend ka /api/auth/users admin-only route)
export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/auth/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Load nahi hua");
        setUsers(data.users);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 px-4 py-12 min-h-screen">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
          <div>
            <h1 className="font-bold text-gray-900 text-2xl">Admin Panel</h1>
            <p className="mt-2 text-gray-500 text-sm">
              Welcome, {user?.name} 👋 | Total users: {users.length}
            </p>
          </div>
          <Link
            to="/"
            className="hover:bg-white px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm"
          >
            Home
          </Link>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}

        {error && (
          <p className="bg-red-50 px-4 py-3 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Naam</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-gray-100 border-t">
                    <td className="px-6 py-4">{u.id}</td>
                    <td className="px-6 py-4">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-sky-50 px-3 py-1 rounded-full font-medium text-sky-700 text-xs">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}