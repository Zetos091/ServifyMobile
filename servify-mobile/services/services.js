import api from "./api";

// Get all services with optional filters
export async function getServices({ category_name, search, max_price } = {}) {
  const params = {};
  if (category_name && category_name !== "All") params.category_name = category_name;
  if (search?.trim())  params.search    = search.trim();
  if (max_price)       params.max_price = max_price;

  console.log("Request params:", JSON.stringify(params));  // add this
  console.log("Request URL:", `/services?${new URLSearchParams(params)}`);  // add this

  const { data } = await api.get("/services", { params });
  console.log("Raw API response count:", data.length);
  return data;
}
// Get all categories
export async function getCategories() {
  const { data } = await api.get("/categories");
  return data.categories; // API returns { message, categories: [...] }
}

// Get a single service by ID
export async function getServiceById(id) {
  const { data } = await api.get(`/services/${id}`);
  return data;
}

