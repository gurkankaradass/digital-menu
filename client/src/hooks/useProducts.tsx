import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store';
import { setLoading, setProducts } from '../redux/appSlice';
import { ProductType } from '../types/Types';
import ProductServices from '../services/ProductServices';
import { toast } from "react-toastify";
import { useEffect } from 'react';

const useProducts = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.app);

  const getAllProducts = async () => {
    try {
      dispatch(setLoading(true));
      const response: ProductType[] = await ProductServices.getAllProducts();
      if (response) {
        dispatch(setProducts(response));
      }
    } catch (error) {
      toast.error("Ürünler Getirilemedi...");
      console.error("Ürünler Alınırken Hata:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (products.length === 0) {
      getAllProducts();
    }
  }, [])

  return products;
}

export default useProducts;