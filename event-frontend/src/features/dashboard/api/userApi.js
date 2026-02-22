 // your axios instance with auth token
import api from "../../../api/client";
// get all users (admin)
export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

// get single user details
export const getUser = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

// update role
export const updateUserRole = async (id, role) => {
  const res = await api.patch(`/users/${id}/role`, { role });
  return res.data;
};

// delete user
export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
