import { AxiosResponse } from "axios";
import { OrderType } from "../types/Types";
import axiosInstance from "../config/AxiosConfig";


class OrderServices {

    async orderProduct(payload: OrderType): Promise<any> {
        console.log(payload)
        try {
            const response: AxiosResponse<any> = await axiosInstance.post("api/order/orderProduct", payload)
            if (response.status === 200) {
                return {
                    success: true,
                    message: response.data.message || "Sipariş Eklendi..."
                }
            }
            throw new Error("Beklenmedik Bir Durum Oluştu...");
        } catch (error: any) {
            console.error("Backend error: ", error);
            const errorMessage = error.response?.data?.message || "Sipariş Verilemedi. Lütfen tekrar deneyin.";
            throw new Error(errorMessage);
        }
    }
}

export default new OrderServices