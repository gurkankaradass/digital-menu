import { useDispatch } from 'react-redux'
import { setLoading, setProducts } from '../redux/appSlice';
import { ProductType } from '../types/Types';
import ProductServices from '../services/ProductServices';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const useProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const getProductByCategoryName = async (categoryName: string) => {
    try {
      dispatch(setLoading(true));
      const products: ProductType[] = await ProductServices.getProductByCategoryName(categoryName);
      navigate("/" + categoryName);
      dispatch(setProducts(products));
      localStorage.setItem("categoryProducts", JSON.stringify(products));
    } catch (error) {
      toast.error("Ürünler Getirilemedi...");
      console.error("Ürünler Alınırken Hata:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { getProductByCategoryName };
}

export default useProducts;