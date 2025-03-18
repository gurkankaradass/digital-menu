import { AxiosResponse } from "axios";
import axiosInstance from "../config/AxiosConfig";
import { CategoryType } from "../types/Types";

class CategoryServices {

    getAllCategories(): Promise<CategoryType[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get<CategoryType[]>("api/categories")
                .then((response: AxiosResponse<CategoryType[]>) => resolve(response.data))
                .catch((error: any) => reject(error))
        })
    }

    async addNewCategory(payload: CategoryType): Promise<any> {
        console.log(payload)
        try {
            const response: AxiosResponse<any> = await axiosInstance.post("api/categories/addNewCategory", payload);
            if (response.status === 200) {
                return {
                    success: true,
                    message: response.data.message || "Yeni Kategori Oluşturuldu...",
                    newCategories: response.data.newCategories
                }
            }
            throw new Error("Beklenmedik Bir Durum Oluştu...");
        } catch (error: any) {
            console.error("Backend error: ", error);
            const errorMessage = error.response?.data?.message || "Etkinlik kaydedilemedi. Lütfen tekrar deneyin.";
            throw new Error(errorMessage);
        }
    }
}

export default new CategoryServices