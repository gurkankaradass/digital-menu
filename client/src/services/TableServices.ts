import { AxiosResponse } from "axios";
import axiosInstance from "../config/AxiosConfig"
import { TableType } from "../types/Types";

class TableServies {

    getAllTables(): Promise<TableType[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get<TableType[]>("api/table")
                .then((response: AxiosResponse<TableType[]>) => resolve(response.data))
                .catch((error: any) => reject(error))
        })
    }

    async addNewTable(payload: TableType): Promise<any> {
        try {
            const response: AxiosResponse<any> = await axiosInstance.post("api/table/addNewTable", payload);
            if (response.status === 200) {
                return {
                    success: true,
                    message: response.data.message || "Yeni Masa Oluşturuldu...",
                    newTables: response.data.newTables
                }
            }
            throw new Error("Beklenmedik Bir Durum Oluştu...");
        } catch (error: any) {
            console.error("Backend error: ", error);
            const errorMessage = error.response?.data?.message || "Masa kaydedilemedi. Lütfen tekrar deneyin.";
            throw new Error(errorMessage);
        }
    }

    async deleteEmployee(id: number): Promise<any> {
        try {
            const response = await axiosInstance.delete(`api/table/delete/${id}`)
            return {
                success: true,
                message: response.data.message,
                newTables: response.data.newTables
            }
        } catch (error: any) {
            console.error("Masa Silinemedi...", error);
            throw error.response?.data?.message || "Masa silinemedi...";
        }
    }
}

export default new TableServies