import { AxiosResponse } from "axios";
import axiosInstance from "../config/AxiosConfig";
import { ProductType } from "../types/Types";

class ProductServices {

    getAllProducts(): Promise<ProductType[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get<ProductType[]>("/api/products")
                .then((response: AxiosResponse<ProductType[]>) => resolve(response.data))
                .catch((error: any) => reject(error))
        })
    }
}

export default new ProductServices