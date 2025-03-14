import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/store";
import { setCategories, setLoading } from "../redux/appSlice";
import { CategoryType } from "../types/Types";
import CategoryServices from "../services/CategoryServices";
import { toast } from "react-toastify";
import { useEffect } from "react";

const useCategories = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state: RootState) => state.app);

    const getAllCategories = async () => {
        try {
            dispatch(setLoading(true));
            const response: CategoryType[] = await CategoryServices.getAllCategories();
            if (response) {
                dispatch(setCategories(response))
            }
        } catch (error) {
            toast.error("Kategoriler Gertirilemedi...");
            console.error("Kategoriler Alınırken Hata: ", error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (categories.length === 0) {
            getAllCategories();
        }
    }, [])

    return categories;
}

export default useCategories