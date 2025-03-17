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
}

export default new ProductServices