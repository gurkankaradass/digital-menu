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
}

export default new CategoryServices