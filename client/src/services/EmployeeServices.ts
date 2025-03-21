import { AxiosResponse } from "axios";
import axiosInstance from "../config/AxiosConfig"
import { EmployeeType } from "../types/Types";

class EmployeeServices {

    getAllEmployees(): Promise<EmployeeType[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get<EmployeeType[]>("api/employee")
                .then((response: AxiosResponse<EmployeeType[]>) => resolve(response.data))
                .catch((error: any) => reject(error))
        })
    }

    async getEmployee(username: string, password: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await axiosInstance.post("/api/employee/login", { username, password });
            return {
                message: response.data.message,
                employee: response.data.employee
            }
        } catch (error: any) {
            throw error.response?.data?.message || "Giriş Yapılamadı..."
        }
    }

    async addNewEmployee(payload: EmployeeType): Promise<any> {
        try {
            const response: AxiosResponse<any> = await axiosInstance.post("api/employee/addNewEmployee", payload);
            if (response.status === 200) {
                return {
                    success: true,
                    message: response.data.message || "Yeni Personel Oluşturuldu...",
                    newEmployees: response.data.newEmployees
                }
            }
            throw new Error("Beklenmedik Bir Durum Oluştu...");
        } catch (error: any) {
            console.error("Backend error: ", error);
            const errorMessage = error.response?.data?.message || "Personel kaydedilemedi. Lütfen tekrar deneyin.";
            throw new Error(errorMessage);
        }
    }

    async deleteEmployee(id: number): Promise<any> {
        try {
            const response = await axiosInstance.delete(`api/employee/delete/${id}`)
            return {
                success: true,
                message: response.data.message,
                newEmployees: response.data.newEmployees
            }
        } catch (error: any) {
            console.error("Personel Silinemedi...", error);
            throw error.response?.data?.message || "Personel silinemedi...";
        }
    }
}

export default new EmployeeServices