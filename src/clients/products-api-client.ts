// src/clients/products-api-client.ts

import axios from "axios";

const BASE_URL = process.env.PRODUCTS_API_URL || "http://localhost:3002";

export async function getProductById(productId: number) {
  const response = await axios.get(`${BASE_URL}/fastfood-products-api/${productId}`);
  return response.data;
}
