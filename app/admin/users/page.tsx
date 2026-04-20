"use client";

import { useEffect, useState } from "react";
import { userAPI } from "../../services/api";

interface User {
  _id: string;
  email: string;
  role: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setMessage({ type: "error", text: "Không có quyền truy cập" });
        setLoading(false);
        return;
      }

      const usersData = await userAPI.getAll(token);
      setUsers(usersData);

      // Initialize selected roles
      const rolesMap: Record<string, string> = {};
      usersData.forEach((user: User) => {
        rolesMap[user._id] = user.role;
      });
      setSelectedRole(rolesMap);
    } catch (error) {
      console.error("Error loading users:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu users",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Không có quyền truy cập" });
      return;
    }

    try {
      await userAPI.updateRole(userId, newRole, token);

      // Update local state
      setSelectedRole((prev) => ({
        ...prev,
        [userId]: newRole,
      }));

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user,
        ),
      );

      setMessage({ type: "success", text: "Cập nhật role thành công" });
    } catch (error) {
      console.error("Error updating role:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Không thể cập nhật role",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Bạn có chắc muốn xóa user này?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Không có quyền truy cập" });
      return;
    }

    try {
      await userAPI.delete(userId, token);

      setUsers((prev) => prev.filter((user) => user._id !== userId));

      const newRoles = { ...selectedRole };
      delete newRoles[userId];
      setSelectedRole(newRoles);

      setMessage({ type: "success", text: "Xóa user thành công" });
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Không thể xóa user",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {message && (
          <div
            className={`mb-4 p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
          >
            {message.text}
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Quản lý người dùng
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Tổng cộng{" "}
              <span className="font-semibold text-gray-900">
                {users.length}
              </span>{" "}
              người dùng
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
                    #
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    <td className="whitespace-nowrap px-3 py-4 text-center text-sm font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedRole[user._id] || user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            selectedRole[user._id] === "admin" ||
                            user.role === "admin"
                              ? "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10"
                              : "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10"
                          }`}
                        >
                          {selectedRole[user._id] || user.role}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="inline-flex items-center justify-center rounded-md bg-red-50 p-1.5 text-red-700 transition-colors hover:bg-red-100"
                          title="Xóa"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="mt-8 rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              Chưa có người dùng nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Người dùng sẽ được hiển thị khi đăng ký tài khoản
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
