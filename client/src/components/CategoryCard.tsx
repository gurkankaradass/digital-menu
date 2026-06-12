import useProducts from '../hooks/useProducts';
import { CategoryType } from '../types/Types'
import { Card } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useState } from 'react';
import { setCategories, setLoading } from '../redux/appSlice';
import CategoryServices from '../services/CategoryServices';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { schemaCategory } from '../schema/Schema';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";


interface PropsType {
    category: CategoryType;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    disableUp?: boolean;
    disableDown?: boolean;
}

const CategoryCard = (props: PropsType) => {
    const { id, name, image } = props.category;
    const currentUrl = window.location.pathname;
    const { getProductByCategoryName } = useProducts();
    const { currentEmployee } = useSelector((state: RootState) => state.app)
    const dispatch = useDispatch();

    const [openEdit, setOpenEdit] = useState(false);
    const [open, setOpen] = useState(false);

    const deleteCategory = async () => {
        try {
            dispatch(setLoading(true))
            if (id) {
                const response = await CategoryServices.deleteCategory(id)
                if (response) {
                    dispatch(setCategories(response.newCategories))
                    localStorage.setItem("category", JSON.stringify(response.newCategories));
                    toast.success(response.message);
                    setOpen(false)
                    setOpenEdit(false)
                }
            }
        } catch (error: any) {
            toast.error(error);
        } finally {
            dispatch(setLoading(false))
        }
    }

    const submit = async (values: any) => {
        try {
            dispatch(setLoading(true));
            const payload: CategoryType = {
                id: id,
                name: values.name,
                image: values.image
            };
            if (id) {
                const response = await CategoryServices.updateCategory(id, payload);
                if (response && response.success) {
                    dispatch(setCategories(response.newCategories))
                    localStorage.setItem("category", JSON.stringify(response.newCategories));
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
            image: image || ""
        },
        onSubmit: submit,
        validationSchema: schemaCategory,
        enableReinitialize: true
    });

    const handleClose = () => {
        setOpenEdit(false);
    }

    const reset = () => {
        resetForm();
    }

    return (
        <div>
            {
                currentEmployee && currentEmployee.role === "admin" && currentUrl === "/" ?
                    <div className='px-[16px] flex flex-row text-white justify-between items-center mt-5'>
                        <Card onClick={() => { getProductByCategoryName(name) }} className="flex flex-col justify-between w-10/12 h-32 sm:h-56 cursor-pointer relative border">
                            <div>
                                <img src={image} alt={name} className="object-contain w-full h-full" />
                                {
                                    currentUrl === "/" ?
                                        <div>
                                            {/* Karartma efekti */}
                                            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                                            <div className="absolute bottom-0 left-0 right-0 pb-2">
                                                <p className='font-bold text-2xl text-white font-[arial] text-center'>{name}</p>
                                            </div></div> : <div></div>
                                }
                            </div>
                        </Card >
                        <div className="w-2/12 flex flex-col justify-center items-center space-y-2">
                            <button
                                type="button"
                                disabled={props.disableUp}
                                onClick={(e) => { e.stopPropagation(); props.onMoveUp?.(); }}
                                className="w-8 h-8 rounded-full bg-zinc-800 disabled:opacity-30 flex items-center justify-center text-white text-xs hover:bg-zinc-700 transition"
                            >
                                ▲
                            </button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setOpenEdit(true); }}>
                                <EditIcon className='cursor-pointer mx-auto' sx={{ fontSize: "35px" }} />
                            </button>
                            <button
                                type="button"
                                disabled={props.disableDown}
                                onClick={(e) => { e.stopPropagation(); props.onMoveDown?.(); }}
                                className="w-8 h-8 rounded-full bg-zinc-800 disabled:opacity-30 flex items-center justify-center text-white text-xs hover:bg-zinc-700 transition"
                            >
                                ▼
                            </button>
                        </div>
                        <div>
                            <Dialog
                                open={openEdit}
                                onClose={handleClose}
                            >
                                <DialogContent
                                >
                                    <div>
                                        <form className='text-center font-[arial]' onSubmit={handleSubmit}>
                                            <h2 className='font-bold text-xl mb-2'>KATEGORİ BİLGİLERİ</h2>
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
                                                            id="category-edit-file-input"
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            onChange={(event) => {
                                                                if (event.currentTarget.files && event.currentTarget.files[0]) {
                                                                    setFieldValue("image", event.currentTarget.files[0]);
                                                                }
                                                            }}
                                                        />
                                                        {values.image ? (
                                                            <div className="text-center">
                                                                <img
                                                                    src={typeof values.image === "string" ? values.image : URL.createObjectURL(values.image)}
                                                                    alt="Preview"
                                                                    className="max-h-20 object-contain mb-1 mx-auto rounded"
                                                                />
                                                                <p className="text-[11px] text-green-700 font-semibold truncate max-w-48">
                                                                    {typeof values.image === "string" ? "Mevcut Görsel" : `Seçildi: ${values.image.name}`}
                                                                </p>
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
                                                        helperText={errors.image && <span className='text-red-800'>{errors.image as string}</span>}
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex flex-row justify-center my-2 text-white'>
                                                <button type='submit' className='font-bold bg-slate-950  rounded-2xl p-1 px-3 mr-3'>Kategoriyi Güncelle</button>
                                                <button type='reset' className='font-bold bg-slate-950  rounded-2xl p-1 px-3' onClick={reset}>Temizle</button>
                                            </div>
                                            <div>
                                                <button onClick={() => setOpen(true)} type='button' className='font-bold bg-red-800 rounded-2xl p-1 px-3 text-white'>Kategoriyi Sil</button>
                                            </div>
                                        </form>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div>
                            <Dialog open={open} onClose={() => setOpen(false)}>
                                <DialogTitle>
                                    <p className="font-bold">Kategoriyi Sil</p></DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Kategoriyi silmek istediğinize emin misiniz?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions sx={{ marginBottom: "10px" }}>
                                    <button onClick={() => setOpen(false)} className='font-bold bg-slate-950  rounded-2xl p-1 px-3 text-white'>İptal</button>
                                    <button onClick={deleteCategory} className='font-bold bg-slate-950  rounded-2xl p-1 px-3 text-white'>Evet, Sil</button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </div> :
                    <div className='px-[16px]'>
                        <Card onClick={() => { getProductByCategoryName(name) }} className="flex flex-col justify-between max-w-xl h-36 sm:h-56 mt-5 cursor-pointer relative border">
                            <div>
                                <img src={image} alt={name} className="object-contain w-full h-full" />
                                {
                                    currentUrl === "/" ?
                                        <div>
                                            {/* Karartma efekti */}
                                            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                                            <div className="absolute bottom-0 left-0 right-0 pb-2">
                                                <p className='font-bold text-2xl text-white font-[arial] text-center'>{name}</p>
                                            </div></div> : <div></div>
                                }
                            </div>
                        </Card >
                    </div>
            }
        </div >
    )
}

export default CategoryCard