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

    const handleMoveProduct = async (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= products.length) return;

        const updatedProducts = [...products];
        const temp = updatedProducts[index];
        updatedProducts[index] = updatedProducts[targetIndex];
        updatedProducts[targetIndex] = temp;

        const reorderPayload = updatedProducts.map((prod, idx) => ({
            id: prod.id!,
            sort_order: idx
        }));

        try {
            dispatch(setLoading(true));
            if (category && category.id) {
                const response = await ProductServices.reorderProducts(category.id, reorderPayload);
                if (response && response.success) {
                    dispatch(setProducts(response.newProducts));
                    localStorage.setItem("categoryProducts", JSON.stringify(response.newProducts));
                    toast.success(response.message || "Sıralama güncellendi.");
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Sıralama güncellenemedi.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const submit = async (values: any) => {
        try {
            dispatch(setLoading(true));
            const payload: ProductType = {
                name: values.name,
                categoryName: values.categoryName,
                image: values.image,
                price: values.price
            };
            const response = await ProductServices.addNewProduct(payload);
            if (response && response.success) {
                dispatch(setProducts(response.newProducts))
                localStorage.setItem("categoryProducts", JSON.stringify(response.newProducts));
                toast.success(response.message)
                setOpen(false)
                resetForm();
            } else {
                toast.error("Beklenmeyen bir hata oluştu.");
            }
        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const { values, handleSubmit, handleChange, setFieldValue, errors, resetForm } = useFormik({
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
                    products && products.map((product: ProductType, index: number) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onMoveUp={() => handleMoveProduct(index, 'up')}
                            onMoveDown={() => handleMoveProduct(index, 'down')}
                            disableUp={index === 0}
                            disableDown={index === products.length - 1}
                        />
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

                                        {/* Dosya Yükleme Alanı */}
                                        <div className="flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-lg p-4 mb-2 relative hover:bg-gray-50 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="product-file-input"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(event) => {
                                                    if (event.currentTarget.files && event.currentTarget.files[0]) {
                                                        setFieldValue("image", event.currentTarget.files[0]);
                                                    }
                                                }}
                                            />
                                            {values.image && typeof values.image !== "string" ? (
                                                <div className="text-center">
                                                    <img
                                                        src={URL.createObjectURL(values.image as any)}
                                                        alt="Preview"
                                                        className="max-h-20 object-contain mb-1 mx-auto rounded"
                                                    />
                                                    <p className="text-[11px] text-green-700 font-semibold truncate max-w-48">Seçildi: {(values.image as any).name}</p>
                                                    <button
                                                        type="button"
                                                        className="text-[10px] text-red-500 underline mt-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setFieldValue("image", "");
                                                        }}
                                                    >
                                                        Kaldır
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center text-gray-500">
                                                    <p className="text-xs font-semibold">Cihazdan Dosya Seç</p>
                                                    <p className="text-[9px] text-gray-400">Tıklayın veya sürükleyin</p>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-[10px] text-gray-400 my-1">- VEYA -</p>

                                        <TextField
                                            id="image"
                                            label="Fotoğraf URL"
                                            value={typeof values.image === "string" ? values.image : ""}
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