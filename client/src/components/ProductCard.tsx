import { ProductType } from "../types/Types"
import PostAddIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setLoading } from "../redux/appSlice";
import ProductServices from "../services/ProductServices";
import { toast } from "react-toastify";
import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import useProducts from "../hooks/useProducts";
import { useFormik } from "formik";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { schemaUpdateProduct } from "../schema/Schema";

interface PropsType {
    product: ProductType
}

const ProductCard = (props: PropsType) => {
    const { id, name, image, price, categoryName } = props.product
    const { currentEmployee, categories } = useSelector((state: RootState) => state.app)
    const { getProductByCategoryName } = useProducts();
    const dispatch = useDispatch();

    const [openEdit, setOpenEdit] = useState(false);
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

    const submit = async (values: any, action: any) => {
        try {
            dispatch(setLoading(true));
            const payload: ProductType = {
                id: id,
                name: values.name,
                image: values.image,
                price: values.price,
                categoryName: values.categoryName
            };
            if (id) {
                const response = await ProductServices.updateProduct(id, payload);
                if (response && response.success) {
                    getProductByCategoryName(categoryNameFromUrl)
                    toast.success(response.message)
                    setOpenEdit(false)
                } else {
                    toast.error("Beklenmeyen bir hata oluştu.");
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const { values, handleSubmit, handleChange, setFieldValue, errors, resetForm } = useFormik({
        initialValues: {
            name: name || "",
            image: image || "",
            price: price || "",
            categoryName: categoryName || ""
        },
        onSubmit: submit,
        validationSchema: schemaUpdateProduct,
        enableReinitialize: true
    });

    const handleClose = () => {
        setOpenEdit(false);
    }

    const reset = () => {
        resetForm();
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
                                <button onClick={() => { setOpenEdit(true) }}>
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
                        <Dialog
                            open={openEdit}
                            onClose={handleClose}
                        >
                            <DialogContent
                            >
                                <div>
                                    <form className='w-64 text-center font-[arial]' onSubmit={handleSubmit}>
                                        <h2 className='font-bold text-xl mb-2'>ÜRÜN BİLGİLERİ</h2>
                                        <div className='adminInput-div'>
                                            <div className='left'>
                                                <TextField
                                                    id="name"
                                                    label="Ürün Adı"
                                                    value={values.name}
                                                    onChange={handleChange}
                                                    sx={{ marginBottom: "10px", width: "100%" }}
                                                    variant="standard"
                                                    helperText={errors.name && <span className='text-red-800'>{errors.name}</span>}
                                                />
                                                <FormControl sx={{ margin: "10px 0px" }} fullWidth>
                                                    <InputLabel sx={{ zIndex: "1" }} id="category-label">Kategori Seç</InputLabel>
                                                    <Select
                                                        size='medium'
                                                        labelId="category-label"
                                                        id="category"
                                                        name="category"
                                                        value={values.categoryName}
                                                        onChange={(product) => {
                                                            setFieldValue("categoryName", product.target.value); // handleChange yerine setFieldValue kullanılıyor
                                                        }}
                                                        sx={{ marginBottom: "10px", width: "100%" }}
                                                    >
                                                        {
                                                            categories?.map((category) => (
                                                                <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
                                                            ))
                                                        }
                                                    </Select>
                                                    <FormHelperText>
                                                        {errors.categoryName && <span style={{ marginLeft: "-13px", marginTop: "-10px" }} className='text-red-800'>{errors.categoryName}</span>}
                                                    </FormHelperText>
                                                </FormControl>
                                                <TextField
                                                    id="image"
                                                    label="Fotoğraf URL"
                                                    value={values.image}
                                                    onChange={handleChange}
                                                    sx={{ marginBottom: "10px", width: "100%" }}
                                                    variant="standard"
                                                    helperText={errors.image && <span className='text-red-800'>{errors.image}</span>}
                                                />
                                                <TextField
                                                    id="price"
                                                    label="Ücret"
                                                    type='number'
                                                    value={values.price}
                                                    onChange={handleChange}
                                                    sx={{ marginBottom: "10px", width: "100%" }}
                                                    variant="standard"
                                                    helperText={errors.price && <span className='text-red-800'>{errors.price}</span>}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-row justify-center my-2 text-white'>
                                            <button type='submit' className='font-bold bg-slate-950  rounded-2xl p-1 px-3 mr-3'>Ürünü Güncelle</button>
                                            <button type='reset' className='font-bold bg-slate-950  rounded-2xl p-1 px-3' onClick={reset}>Temizle</button>
                                        </div>
                                        <div>
                                            <button onClick={() => setOpen(true)} type='button' className='font-bold bg-red-800 rounded-2xl p-1 px-3 text-white'>Ürünü Sil</button>
                                        </div>
                                    </form>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
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