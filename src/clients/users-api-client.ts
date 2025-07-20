// src/clients/users-api-client.ts

import axios from "axios";

const BASE_URL = process.env.USERS_API_URL || "http://localhost:3001";

export async function getUserById(userId: number) {
  const response = await axios.get(`${BASE_URL}/fastfood-users-api/${userId}`);
  return response.data;
}
