import axios from "axios";

const API_URL = "https://api.escuelajs.co/api/v1";

export const fetchProducts = async () => {
  const { data } = await axios.get(`${API_URL}/products`);
  return Array.isArray(data) ? data : [];
};

export const addProduct = async (newProduct) => {
  const { data } = await axios.post(`${API_URL}/products`, newProduct);
  return data;
};

export const updateProduct = async (product) => {
  const { data } = await axios.put(`${API_URL}/products/${product.id}`, product);
  return data;
};

export const deleteProduct = async (id) => {
  await axios.delete(`${API_URL}/products/${id}`);
  return id;
};