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
        try {
            const formData = new FormData();
            formData.append("name", payload.name);
            if (payload.image) {
                formData.append("image", payload.image);
            }
            const response: AxiosResponse<any> = await axiosInstance.post("api/categories/addNewCategory", formData);
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
            const errorMessage = error.response?.data?.message || "Kategori kaydedilemedi. Lütfen tekrar deneyin.";
            throw new Error(errorMessage);
        }
    }

    async deleteCategory(id: number): Promise<any> {
        try {
            const response = await axiosInstance.delete(`api/categories/delete/${id}`)
            return {
                success: true,
                message: response.data.message,
                newCategories: response.data.newCategories
            }
        } catch (error: any) {
            console.error("Kategori Silinemedi: ", error);
            throw error.response?.data?.message || "Kategori Silinemedi...";
        }
    }

    async updateCategory(id: number, payload: CategoryType): Promise<any> {
        try {
            const formData = new FormData();
            formData.append("name", payload.name);
            if (payload.image instanceof File) {
                formData.append("image", payload.image);
            } else if (typeof payload.image === "string" && payload.image) {
                formData.append("image", payload.image);
            }
            const response = await axiosInstance.put(`api/categories/update/${id}`, formData)
            return {
                success: true,
                message: response.data.message,
                newCategories: response.data.newCategories
            }
        } catch (error: any) {
            console.error("Kategori Güncellenemedi: ", error);
            throw error.response?.data?.message || "Kategori Güncellenemedi...";
        }
    }
    async reorderCategories(categories: { id: number; sort_order: number }[]): Promise<any> {
        try {
            const response = await axiosInstance.put("api/categories/reorder", { categories });
            return {
                success: true,
                message: response.data.message,
                newCategories: response.data.newCategories
            }
        } catch (error: any) {
            console.error("Kategori Sıralanamadı: ", error);
            throw error.response?.data?.message || "Kategori Sıralanamadı...";
        }
    }
}

export default new CategoryServices