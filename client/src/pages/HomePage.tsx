import { Container } from "@mui/material"
import useCategories from "../hooks/useCategories"
import { CategoryType } from "../types/Types";
import CategoryCard from "../components/CategoryCard";
import Navbar from "../components/Navbar";
import { schemaCategory } from "../schema/Schema";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setCategories, setLoading } from "../redux/appSlice";
import CategoryServices from "../services/CategoryServices";
import { toast } from "react-toastify";
import { Dialog, DialogContent, TextField } from "@mui/material";
import { useState } from "react";
import { RootState } from "../redux/store";

const HomePage = () => {
    const categories = useCategories();
    const dispatch = useDispatch();
    const { currentEmployee } = useSelector((state: RootState) => state.app)

    const [open, setOpen] = useState(false);

    const submit = async (values: any) => {
        try {
            dispatch(setLoading(true));
            const payload: CategoryType = {
                name: values.name,
                image: values.image
            };

            const response = await CategoryServices.addNewCategory(payload);

            if (response && response.success) {
                dispatch(setCategories(response.newCategories))
                localStorage.setItem("category", JSON.stringify(response.newCategories));
                toast.success(response.message);
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
            image: ""
        },
        onSubmit: submit,
        validationSchema: schemaCategory
    });

    const handleClose = () => {
        setOpen(false);
    }

    const reset = () => {
        resetForm();
    }
    return (
        <div >
            <Navbar />
            <Container maxWidth="sm">
                {
                    categories && categories.map((category: CategoryType) => (
                        <CategoryCard key={category.id} category={category} />
                    ))
                }
                {
                    currentEmployee && currentEmployee.role === "admin" ?
                        <div onClick={() => setOpen(true)} className="h-10 bg-white mx-[16px] my-5 rounded-lg text-center flex flex-row justify-center items-center font-bold cursor-pointer font-[arial]">
                            <p>Kategori Ekle</p>
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
                                <h2 className='font-bold text-xl mb-2'>KATEGORİ EKLE</h2>
                                <div className='adminInput-div'>
                                    <div className='left'>
                                        <TextField
                                            id="name"
                                            label="Kategori Adı"
                                            value={values.name}
                                            onChange={handleChange}
                                            sx={{ marginBottom: "10px", width: "100%" }}
                                            variant="standard"
                                            helperText={errors.name && <span className='text-red-800'>{errors.name}</span>}
                                        />
                                        
                                        {/* Dosya Yükleme Alanı */}
                                        <div className="flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-lg p-4 mb-2 relative hover:bg-gray-50 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="category-file-input"
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
                                    </div>
                                </div>
                                <div className='flex flex-row justify-center my-2 text-white'>
                                    <button type='submit' className='font-bold bg-slate-950  rounded-2xl p-1 px-3 mr-3'>Kategori Ekle</button>
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

export default HomePage