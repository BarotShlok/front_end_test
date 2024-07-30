import axios from "axios";
import { Product } from "../types/types";

const API_BASE_URL = "https://dummyjson.com";

// Log in API
export const login = async (
  username: string,
  password: string
): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Fetch products data
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
// Fetch products by Id
export const fetchProductReviewsById = async (
  id: number
): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products by Id:", error);
    return [];
  }
};
