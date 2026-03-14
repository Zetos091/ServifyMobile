import api from "./api";

// Get all bookings for the logged-in user
export async function getMyBookings() {
  const { data } = await api.get("/bookings");
  return data;
}

// Create a new booking
export async function createBooking({
  service_id,
  provider_id,
  booking_date,
  booking_time,
  user_location,
  total_price,
  notes,
}) {
  const { data } = await api.post("/bookings/createBooking", {
    service_id,
    provider_id,
    booking_date,
    booking_time,
    user_location,
    total_price,
    notes,
  });
  return data;
}

// Get a single booking by ID
export async function getBookingById(id) {
  const { data } = await api.get(`/bookings/${id}`);
  return data;
}

// Cancel a booking (client only)
export async function cancelBooking(id) {
  const { data } = await api.patch(`/bookings/${id}/status`, {
    status: "cancelled",
  });
  return data;
}

// Update booking status (provider only: accepted, completed, rejected)
export async function updateBookingStatus(id, status) {
  const { data } = await api.patch(`/bookings/${id}/status`, { status });
  return data;
}