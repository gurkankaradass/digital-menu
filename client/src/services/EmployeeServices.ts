import { AxiosResponse } from "axios";
import axiosInstance from "../config/AxiosConfig"

class EmployeeServices {

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
}

export default new EmployeeServices