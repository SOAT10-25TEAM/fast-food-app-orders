import axios from "axios";
import { ProcessPaymentResponseDTO } from "../Order/interfaces/dtos"; // ajuste o path se necessário

const BASE_URL = process.env.PAYMENT_API_URL || "http://localhost:3004";

export async function postProcessPayment (orderCode: string, amount: number): Promise<ProcessPaymentResponseDTO>{
    const response = await axios.post(`${BASE_URL}/process/:${orderCode}`, {
      amount,
    });
    return response.data; 
}