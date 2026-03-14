import api from "./api";

// Get provider dashboard stats
export async function getProviderStats() {
  const { data } = await api.get("/provider/stats");
  return data;
}

// Get provider's own services
export async function getProviderServices() {
  const { data } = await api.get("/provider/services");
  return data;
}

// Get provider's incoming bookings
export async function getProviderBookings(status = "") {
  const { data } = await api.get("/provider/bookings", {
    params: status ? { status } : {},
  });
  return data;
}

// Update booking status (accept, reject, complete)
export async function updateBookingStatus(bookingId, status) {
  const { data } = await api.patch(`/bookings/${bookingId}/status`, { status });
  return data;
}

// Get provider earnings
export async function getProviderEarnings() {
  const { data } = await api.get("/provider/earnings");
  return data;
}

// Create a new service listing
export async function createService(serviceData) {
  const { data } = await api.post("/services", serviceData);
  return data;
}

// Update an existing service
export async function updateService(serviceId, serviceData) {
  const { data } = await api.put(`/services/${serviceId}`, serviceData);
  return data;
}

// Delete a service
export async function deleteService(serviceId) {
  const { data } = await api.delete(`/services/${serviceId}`);
  return data;
}

// Toggle service active/inactive
export async function toggleServiceStatus(serviceId, is_active) {
  const { data } = await api.patch(`/services/${serviceId}/status`, { is_active });
  return data;
}