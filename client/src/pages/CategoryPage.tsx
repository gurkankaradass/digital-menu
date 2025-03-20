import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import Navbar from '../components/Navbar';
import { Container } from '@mui/material';
import { CategoryType, ProductType } from '../types/Types';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, TextField } from "@mui/material";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react';
import { useFormik } from 'formik';
import { schemaProduct } from '../schema/Schema';
import ProductServices from '../services/ProductServices';
import { setLoading, setProducts } from '../redux/appSlice';
import { toast } from 'react-toastify';


const CategoryPage = () => {
    const { products, categories, currentEmployee } = useSelector((state: RootState) => state.app);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Kategorinin ismini URL'den alıyoruz, %20 gibi karakter kodlarını çözümlüyoruz
    const categoryNameFromUrl = decodeURIComponent(window.location.pathname.split('/')[1]); // /{categoryName} şeklinde bir URL var

    // Kategoriyi bulmak
    const category = categories.find((category: CategoryType) => category.name === categoryNameFromUrl);

    const submit = async (values: any, action: any) => {
        try {
            dispatch(setLoading(true));
            const payload: ProductType = {
                name: values.name,
                categoryName: values.categoryName,
                image: values.image,
                price: values.price
            };
            const response = await ProductServices.addNewProduct(payload);
            console.log(response)
            if (response && response.success) {
                dispatch(setProducts(response.newProducts))
                localStorage.setItem("categoryProducts", JSON.stringify(response.newProducts));
                toast.success(response.message)
                setOpen(false)
            } else {
                toast.error("Beklenmeyen bir hata oluştu.");
            }
        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const { values, handleSubmit, handleChange, errors, resetForm } = useFormik({
        initialValues: {
            name: "",
            image: "",
            price: "",
            categoryName: categoryNameFromUrl
        },
        onSubmit: submit,
        validationSchema: schemaProduct,
        enableReinitialize: true
    });

    const handleClose = () => {
        setOpen(false);
    }

    const reset = () => {
        resetForm();
    }

    return (
        <div>
            <Navbar />
            <Container maxWidth="sm">
                <div className='specialBg text-white flex justify-between text-sm sm:text-xl p-3'>
                    <div onClick={() => navigate("/")} className='flex justify-center items-center cursor-pointer'>
                        <ArrowBackIosNewIcon className='mr-2' />
                        <p>Kategorilere Dön</p>
                    </div>
                    <div className='flex justify-center items-center'>
                        <p>{categoryNameFromUrl}</p>
                        <FormatAlignRightIcon className='ml-2' />
                    </div>
                </div>
                {category &&
                    <CategoryCard key={category.id} category={category} />
                }
                {
                    products && products.map((product: ProductType) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                }
                {
                    currentEmployee && currentEmployee.role === "admin" ?
                        <div onClick={() => setOpen(true)} className="h-10 bg-white mx-[16px] my-5 rounded-lg text-center flex flex-row justify-center items-center font-bold cursor-pointer font-[arial]">
                            <p>Ürün Ekle</p>
                        </div> : <div></div>
                }
                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <DialogContent
                    >
                        <div>
                            <form className='w-64 text-center font-[arial]' onSubmit={handleSubmit}>
                                <h2 className='font-bold text-xl mb-2'>ÜRÜN EKLE</h2>
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
                                                value={categoryNameFromUrl}
                                                onChange={handleChange}
                                                sx={{ marginBottom: "10px", width: "100%" }}
                                            >
                                                <MenuItem key={category?.id} value={category?.name}>{categoryNameFromUrl}</MenuItem>
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
                                    <button type='submit' className='font-bold bg-slate-950  rounded-2xl p-1 px-3 mr-3'>Ürün Ekle</button>
                                    <button type='reset' className='font-bold bg-slate-950  rounded-2xl p-1 px-3' onClick={reset}>Temizle</button>
                                </div>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            </Container>
        </div>
    )
}

export default CategoryPage