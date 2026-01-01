import axios from "axios";

const API_URL = "https://api.escuelajs.co/api/v1";

export const fetchProducts = async () => {
  const { data } = await axios.get(`${API_URL}/products`);
  return Array.isArray(data) ? data : [];
};

export const addProduct = async (newProduct) => {
  const payload = {
    title: newProduct.title,
    price: Number(newProduct.price) || 0,
    description: newProduct.description ?? "No description",
    categoryId: newProduct.categoryId ?? 1,
    images: Array.isArray(newProduct.images) ? newProduct.images : [],
  };

  try {
    const { data } = await axios.post(`${API_URL}/products`, payload);
    return data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Add product failed";
    throw new Error(message);
  }
};

export const updateProduct = async (product) => {
  if (!product?.id) throw new Error("Missing product id");

  const payload = {
    title: product.title,
    price: Number(product.price) || 0,
    description: product.description ?? "No description",
    categoryId: product.categoryId ?? 1,
    images: Array.isArray(product.images) ? product.images : [],
  };

  try {
    const { data } = await axios.put(`${API_URL}/products/${product.id}`, payload);
    return data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Update failed";
    throw new Error(message);
  }
};

export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_URL}/products/${id}`);
    return id;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Delete failed";
    throw new Error(message);
  }
};