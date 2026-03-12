import api from "./api";
import * as SecureStore from "expo-secure-store";

// Register a new user
export async function register(full_name, email, password, phone_number) {
  const { data } = await api.post("/auth/register", {
    full_name,
    email,
    password,
    phone_number,
  });
  return data;
}

// Login and save token
export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  await SecureStore.setItemAsync("token", data.accessToken);
  if (data.refreshToken) {
    await SecureStore.setItemAsync("refreshToken", data.refreshToken);
  }
  return data;
}

// Logout — clear stored tokens
export async function logout() {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("refreshToken");
}

// Get logged-in user profile
export async function getProfile() {
  const { data } = await api.get("/users/profile");
  return data;
}

// Check if user is logged in
export async function isLoggedIn() {
  const token = await SecureStore.getItemAsync("token");
  return !!token;
}