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
}

export default new CafeServices