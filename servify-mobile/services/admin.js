import api from "./api";

// Dashboard stats
export async function getAdminStats() {
  const { data } = await api.get("/admin/stats");
  return data;
}

// Users
export async function getAllUsers(role = "") {
  const { data } = await api.get("/admin/users", {
    params: role ? { role } : {},
  });
  return data;
}

export async function toggleUserStatus(userId, is_active) {
  const { data } = await api.patch(`/admin/users/${userId}/status`, { is_active });
  return data;
}

export async function deleteUser(userId) {
  const { data } = await api.delete(`/admin/users/${userId}`);
  return data;
}

// Services
export async function getAllServices() {
  const { data } = await api.get("/admin/services");
  return data;
}

export async function toggleServiceStatus(serviceId, is_active) {
  const { data } = await api.patch(`/admin/services/${serviceId}/status`, { is_active });
  return data;
}

export async function deleteService(serviceId) {
  const { data } = await api.delete(`/admin/services/${serviceId}`);
  return data;
}

// Bookings & Reports
export async function getAllBookings(status = "") {
  const { data } = await api.get("/admin/bookings", {
    params: status ? { status } : {},
  });
  return data;
}

export async function getRevenueReport() {
  const { data } = await api.get("/admin/reports/revenue");
  return data;
}