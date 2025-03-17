import { ProductType } from "../types/Types"
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setLoading } from "../redux/appSlice";
import ProductServices from "../services/ProductServices";
import { toast } from "react-toastify";
import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import useProducts from "../hooks/useProducts";

interface PropsType {
    product: ProductType
}

const ProductCard = (props: PropsType) => {
    const { id, name, image, price } = props.product
    const { currentEmployee } = useSelector((state: RootState) => state.app)
    const { getProductByCategoryName } = useProducts();
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

    const categoryNameFromUrl = decodeURIComponent(window.location.pathname.split('/')[1]);

    const deleteProduct = async () => {
        try {
            dispatch(setLoading(true))
            if (id) {
                const response = await ProductServices.deleteProduct(id)
                if (response) {
                    getProductByCategoryName(categoryNameFromUrl)
                    toast.success(response.message);
                    setOpen(false)
                }
            }
        } catch (error: any) {
            toast.error(error);
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <div className="px-[16px] text-white">
            <div className="flex flex-row items-center justify-around my-5 w-full h-28 px-3">
                <div className="w-2/5 flex items-center justify-center">
                    <img src={image} alt={name} className="object-cover w-28 h-28 rounded-2xl" />
                </div>
                <div className="flex-col text-center justify-center items-center w-3/5">
                    <div className="font-bold">
                        <p>{name}</p>
                    </div>
                    <div className="mt-1">
                        <p>{price} ₺</p>
                    </div>
                </div>
                <div className="justify-start items-start h-full pt-2">
                    {
                        currentEmployee?.role === "admin" ?
                            <div>
                                <button onClick={() => { setOpen(true) }}>
                                    <DeleteIcon className="mb-2 cursor-pointer" />
                                </button>
                                <button onClick={() => { }}>
                                    <EditIcon className="cursor-pointer" />
                                </button>
                            </div> :
                            currentEmployee?.role === "waiter" ?
                                <button onClick={() => { }}>
                                    <PostAddIcon className="cursor-pointer" />
                                </button> :
                                <div></div>
                    }
                    <div>
                        <Dialog open={open} onClose={() => setOpen(false)}>
                            <DialogTitle>
                                <p className="font-bold">Ürünü Sil</p></DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Ürünü silmek istediğinize emin misiniz?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions sx={{ marginBottom: "10px" }}>
                                <button onClick={() => setOpen(false)} className='font-bold bg-slate-950  rounded-2xl p-1 px-3 text-white'>İptal</button>
                                <button onClick={deleteProduct} className='font-bold bg-slate-950  rounded-2xl p-1 px-3 text-white'>Evet, Sil</button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
            </div>
            <hr className="text-white" />
        </div>
    )
}

export default ProductCard