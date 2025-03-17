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
}

export default new ProductServices