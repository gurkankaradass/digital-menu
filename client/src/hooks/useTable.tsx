import { useDispatch } from 'react-redux';
import TableServices from '../services/TableServices';
import { TableType } from '../types/Types';
import { setLoading, setTables } from '../redux/appSlice';
import { toast } from 'react-toastify';

const useTable = () => {
    const dispatch = useDispatch();

    const getAllTables = async () => {
        try {
            dispatch(setLoading(true));
            const response: TableType[] = await TableServices.getAllTables();
            if (response) {
                dispatch(setTables(response))
                localStorage.setItem("tables", JSON.stringify(response));
            }
        } catch (error) {
            toast.error("Masalar Gertirilemedi...");
            console.error("Masalar Alınırken Hata: ", error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return { getAllTables };
}

export default useTable