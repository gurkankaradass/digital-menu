import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/store";
import { setCafeInfo, setLoading } from "../redux/appSlice";
import { toast } from "react-toastify";
import { CafeInfoType } from "../types/Types";
import CafeServices from "../services/CafeServices";
import { useEffect } from "react";

const useCafe = () => {
    const dispatch = useDispatch();
    const { cafeInfo } = useSelector((state: RootState) => state.app);

    const getCafeInfo = async () => {
        try {
            dispatch(setLoading(true));
            const response: CafeInfoType = await CafeServices.getCafeInfo();
            if (response) {
                dispatch(setCafeInfo(response));
            }
        } catch (error) {
            toast.error("Kafe Bilgileri Getirilemedi...");
            console.error("Kafe Bilgileri Alınırken Hata: ", error);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (!cafeInfo) {
            getCafeInfo();
        }
    }, [cafeInfo])

    return cafeInfo;
}

export default useCafe