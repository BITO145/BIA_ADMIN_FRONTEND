import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Fetch all subadmins
export const getSubAdminsService = async () => {
  const response = await axios.get(`${backendUrl}/sa/get-subadmin`, {
    withCredentials: true,
  });
  return response.data;
};

// Add a new subadmin
export const addSubAdminService = async (adminData) => {
  const response = await axios.post(`${backendUrl}/sa/sub-admin`, adminData, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data; // Expecting { subAdmin: {...} }
};

// Delete a subadmin by id
// export const deleteSubAdminService = async (id) => {
//   const response = await axios.delete(`${backendUrl}/api/subadmins/${id}`, {
//     withCredentials: true,
//   });
//   return response.data;
// };
