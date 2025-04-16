import React, { useEffect, useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSubAdmins,
  addSubAdmin,
  removeSubAdmin,
  setSubAdminLoading,
  setSubAdminError,
  selectSubAdmins,
  selectSubAdminsLoading,
  selectSubAdminsError,
} from "../slices/subadmin/subadminSlice";
import {
  getSubAdminsService,
  addSubAdminService,
} from "../services/superAdmin";

export default function SubAdminManagement() {
  const dispatch = useDispatch();
  const subAdmins = useSelector(selectSubAdmins);
  const loading = useSelector(selectSubAdminsLoading);
  const error = useSelector(selectSubAdminsError);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  // Fetch subadmins from the backend API on component mount.
  useEffect(() => {
    const fetchSubAdmins = async () => {
      try {
        dispatch(setSubAdminLoading(true));
        const response = await getSubAdminsService();
        dispatch(setSubAdmins(response.subAdmins));
      } catch (err) {
        console.error("Error fetching subadmins:", err);
        dispatch(setSubAdminError("Error fetching subadmins"));
      } finally {
        dispatch(setSubAdminLoading(false));
      }
    };

    fetchSubAdmins();
  }, [dispatch]);

  const handleAddSubAdmin = async (e) => {
    e.preventDefault();
    try {
      dispatch(setSubAdminLoading(true));
      const response = await addSubAdminService(newAdmin);
      dispatch(addSubAdmin(response.user));
      setShowAddForm(false);
      setNewAdmin({ name: "", email: "", username: "", password: "" });
    } catch (err) {
      console.error("Error adding subadmin:", err);
      dispatch(setSubAdminError("Error adding subadmin"));
    } finally {
      dispatch(setSubAdminLoading(false));
    }
  };

  const handleDeleteSubAdmin = async (id) => {
    try {
      dispatch(setSubAdminLoading(true));
      // await deleteSubAdminService(id);
      dispatch(removeSubAdmin(id));
    } catch (err) {
      console.error("Error deleting subadmin:", err);
      dispatch(setSubAdminError("Error deleting subadmin"));
    } finally {
      dispatch(setSubAdminLoading(false));
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Sub Admins</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Sub Admin
        </button>
      </div>

      {loading && <p className="text-gray-500 mb-4">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {showAddForm && (
        <form
          onSubmit={handleAddSubAdmin}
          className="mb-8 bg-gray-50 p-4 rounded-lg"
        >
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                required
                value={newAdmin.name}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                required
                value={newAdmin.username}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, username: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Sub Admin
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subAdmins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {admin.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {admin.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDeleteSubAdmin(admin.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
