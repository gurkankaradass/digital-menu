import { AxiosResponse } from "axios";
import axiosInstance from "../config/AxiosConfig";
import { CafeInfoType } from "../types/Types";

class CafeServices {

    getCafeInfo(): Promise<CafeInfoType> {
        return new Promise((resolve, reject) => {
            axiosInstance.get<CafeInfoType>("/api/cafe")
                .then((response: AxiosResponse<CafeInfoType>) => resolve(response.data))
                .catch((error: any) => reject(error))
        })
    }

    async updateCafeInfo(id: number, payload: CafeInfoType): Promise<any> {
        try {
            const formData = new FormData();
            formData.append("name", payload.name);
            formData.append("phone", payload.phone);
            formData.append("location", payload.location);
            formData.append("address", payload.address);
            formData.append("map", payload.map);
            formData.append("instagram", payload.instagram);
            if (payload.logo) {
                formData.append("logo", payload.logo);
            }
            const response = await axiosInstance.put(`api/cafe/update/${id}`, formData)
            return {
                success: true,
                message: response.data.message,
                newCafeInfo: response.data.updatedCafeInfo
            }
        } catch (error: any) {
            console.error("Cafe Bilgileri Güncellenemedi...", error);
            throw error.response?.data?.message || "Cafe Bilgileri Güncellenemedi..."
        }
    }

}

export default new CafeServices