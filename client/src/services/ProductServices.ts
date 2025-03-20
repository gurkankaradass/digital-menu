import { AxiosResponse } from "axios";
import axiosInstance from "../config/AxiosConfig";
import { ProductType } from "../types/Types";

class ProductServices {

    getProductByCategoryName(categoryName: string): Promise<ProductType[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get<ProductType[]>(`api/products/${categoryName}`)
                .then((response: AxiosResponse<ProductType[]>) => resolve(response.data))
                .catch((error: any) => reject(error))
        })
    }

    async addNewProduct(payload: ProductType): Promise<any> {
        try {
            const response: AxiosResponse<any> = await axiosInstance.post("api/products/addNewProduct", payload);
            if (response.status === 200) {
                return {
                    success: true,
                    message: response.data.message || "Yeni Ürün Oluşturuldu...",
                    newProducts: response.data.newProducts
                }
            }
            throw new Error("Beklenmedik Bir Durum Oluştu...");
        } catch (error: any) {
            console.error("Backend error: ", error);
            const errorMessage = error.response?.data?.message || "Ürün kaydedilemedi. Lütfen tekrar deneyin.";
            throw new Error(errorMessage);
        }
    }

    async deleteProduct(id: number): Promise<any> {
        try {
            const response = await axiosInstance.delete(`api/products/delete/${id}`)
            return {
                success: true,
                message: response.data.message
            }
        } catch (error: any) {
            console.error("Ürün Silinemedi...", error);
            throw error.response?.data?.message || "Ürün silinemedi...";
        }
    }

    async updateProduct(id: number, payload: ProductType): Promise<any> {
        try {
            const response = await axiosInstance.put(`api/products/update/${id}`, payload)
            return {
                success: true,
                message: response.data.message
            }
        } catch (error: any) {
            console.error("Ürün Güncellenemedi...", error);
            throw error.response?.data?.message || "Ürün Güncellenemedi..."
        }
    }
}

export default new ProductServices