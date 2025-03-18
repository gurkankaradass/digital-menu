import Drawer from '@mui/material/Drawer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { setCafeInfo, setCurrentEmployee, setDrawer, setLoading } from '../redux/appSlice'
import useCafe from '../hooks/useCafe'
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import InstagramIcon from '@mui/icons-material/Instagram';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react'
import { FaLock } from "react-icons/fa";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import { useFormik } from 'formik';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { schemaEditCafe, schemaLogin } from '../schema/Schema'
import { CafeInfoType, EmployeeType } from '../types/Types'
import { toast } from 'react-toastify'
import EmployeeServices from '../services/EmployeeServices'
import { useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import CafeServices from '../services/CafeServices'

interface CheckEmployeeType {
    employee: EmployeeType;
    message: string
}

const NavDrawer = () => {

    const { drawer, currentEmployee } = useSelector((state: RootState) => state.app)
    const cafeInfo = useCafe();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);


    const submit = async (values: any, action: any) => {
        try {
            dispatch(setLoading(true))
            const response: CheckEmployeeType = await EmployeeServices.getEmployee(values.username, values.password);
            if (response) {
                toast.success(response.message)
                dispatch(setCurrentEmployee(response.employee))
                localStorage.setItem("currentEmployee", JSON.stringify(response.employee))
                dispatch(setDrawer(false))
                resetForm();
                navigate("/")
                setOpen(false);
            }
            else {
                toast.error("E-Posta veya Şifre Hatalı")
            }
        } catch (error: any) {
            toast.error(error)
        } finally {
            dispatch(setLoading(false))
        }
    }

    const submit1 = async (values: any, action: any) => {
        try {
            dispatch(setLoading(true));
            const payload: CafeInfoType = {
                id: cafeInfo?.id,
                name: values.name,
                logo: values.logo,
                phone: values.phone,
                location: values.location,
                address: values.address,
                map: values.map,
                instagram: values.instagram,
            };
            if (cafeInfo?.id) {
                const response = await CafeServices.updateCafeInfo(cafeInfo.id, payload);
                if (response && response.success) {
                    dispatch(setCafeInfo(response.newCafeInfo))
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

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: submit,
        validationSchema: schemaLogin
    });
    const { values: values, handleSubmit: handleSubmit, handleChange: handleChange, errors: errors, resetForm: resetForm } = formik;


    const formik1 = useFormik({
        initialValues: {
            name: cafeInfo?.name || '',
            logo: cafeInfo?.logo || '',
            phone: cafeInfo?.phone || '',
            location: cafeInfo?.location || '',
            address: cafeInfo?.address || '',
            map: cafeInfo?.map || '',
            instagram: cafeInfo?.instagram || ''
        },
        onSubmit: submit1,
        validationSchema: schemaEditCafe,
        enableReinitialize: true
    });
    const { values: values1, handleSubmit: handleSubmit1, handleChange: handleChange1, errors: errors1, resetForm: resetForm1 } = formik1;

    const reset = () => {
        resetForm();
        resetForm1();
    }

    const logout = async () => {
        try {
            dispatch(setLoading(true));
            localStorage.removeItem("currentEmployee");
            dispatch(setCurrentEmployee(null))
            dispatch(setDrawer(false))
            navigate("/")
            toast.success("Çıkış Yapıldı");
        } catch (error) {
            toast.error("Çıkış Yapılamadı");
        } finally {
            dispatch(setLoading(false));
        }
    }

    const closeDrawer = () => {
        dispatch(setDrawer(false))
        resetForm();
    }
    return (
        <Drawer open={drawer} anchor='left' onClose={closeDrawer}>
            <div className='h-full flex flex-col justify-between specialBg font-[arial]'>
                <div>
                    <div className='text-center'>
                        <div className='flex flex-row text-white justify-evenly items-center'>
                            <h1 className='p-4 font-bold text-xl'>Hoşgeldiniz!</h1>
                            {
                                currentEmployee ?
                                    <button onClick={logout}>
                                        <LogoutIcon className='cursor-pointer' />
                                    </button> :
                                    <button onClick={() => setOpen(true)}>
                                        <LoginIcon className='cursor-pointer' />
                                    </button>
                            }
                            <Dialog open={open} onClose={() => setOpen(false)}>
                                <form className='w-64 font-[arial]' onSubmit={handleSubmit}>
                                    <DialogTitle sx={{ justifyContent: "center" }}>
                                        <h3 className='text-center font-bold'>PERSONEL GİRİŞİ</h3></DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            <div>
                                                <TextField
                                                    id="username"
                                                    label="Kullanıcı Adı"
                                                    value={values.username}
                                                    onChange={handleChange}
                                                    sx={{ marginBottom: "10px", width: "100%" }}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PersonIcon />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                    variant="standard"
                                                    helperText={errors.username && <span className='text-red-800'>{errors.username}</span>}
                                                />
                                                <TextField
                                                    id="password"
                                                    label="Şifre"
                                                    type='password'
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    sx={{ marginBottom: "10px", width: "100%" }}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <FaLock />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                    variant="standard"
                                                    helperText={errors.password && <span className='text-red-800'>{errors.password}</span>}
                                                />
                                            </div>
                                        </DialogContentText>
                                    </DialogContent>
                                    <div className='flex flex-row justify-center mb-2 text-white'>
                                        <button type='submit' className='font-bold bg-slate-950  rounded-2xl p-1 px-3 mr-3'>Giriş Yap</button>
                                        <button type='reset' onClick={reset} className='font-bold bg-slate-950  rounded-2xl p-1 px-3'>Temizle</button>
                                    </div>
                                </form>
                            </Dialog>
                        </div>
                        <hr className='border-black' />
                    </div >
                    <div>
                        <div className='flex justify-between p-4'>
                            <div className='rounded-full bg-black size-20 flex justify-center items-center'>
                                <img className='size-12' src={`/${cafeInfo?.logo}`} alt="Cafe Logo" />
                            </div>
                            <div className='text-white flex flex-col justify-center ml-4'>
                                <p className='font-bold text-md'>
                                    {
                                        cafeInfo?.name
                                    }
                                </p>
                                <p>
                                    {
                                        currentEmployee ? currentEmployee.username :
                                            cafeInfo?.location
                                    }
                                </p>
                            </div>
                            <hr className='border-black' />
                        </div>
                        <div>
                            <hr className='border-black' />
                            <div className='text-white p-4'>
                                <div className=' flex justify-between'>
                                    <h1 className='text-white font-bold text-md'>İşletme Bilgileri</h1>
                                    {
                                        currentEmployee && currentEmployee.role === "admin" ?
                                            <button onClick={() => setOpenEdit(true)}>
                                                <EditIcon className='cursor-pointer' />
                                            </button> : <div></div>
                                    }
                                    <Dialog
                                        open={openEdit}
                                        onClose={() => setOpenEdit(false)}
                                    >
                                        <DialogContent
                                        >
                                            <div>
                                                <form className='w-64 text-center font-[arial]' onSubmit={handleSubmit1}>
                                                    <h2 className='font-bold text-xl mb-2'>CAFE BİLGİLERİ</h2>
                                                    <div className='adminInput-div'>
                                                        <div className='left'>
                                                            <TextField
                                                                id="name"
                                                                label="Cafe Adı"
                                                                value={values1.name}
                                                                onChange={handleChange1}
                                                                sx={{ marginBottom: "10px", width: "100%" }}
                                                                variant="standard"
                                                                helperText={errors1.name && <span className='text-red-800'>{errors1.name}</span>}
                                                            />
                                                            <TextField
                                                                id="logo"
                                                                label="Logo URL"
                                                                value={values1.logo}
                                                                onChange={handleChange1}
                                                                sx={{ marginBottom: "10px", width: "100%" }}
                                                                variant="standard"
                                                                helperText={errors1.logo && <span className='text-red-800'>{errors1.logo}</span>}
                                                            />
                                                            <TextField
                                                                id="phone"
                                                                label="Telefon"
                                                                value={values1.phone}
                                                                onChange={handleChange1}
                                                                sx={{ marginBottom: "10px", width: "100%" }}
                                                                variant="standard"
                                                                helperText={errors1.phone && <span className='text-red-800'>{errors1.phone}</span>}
                                                            />
                                                            <TextField
                                                                id="location"
                                                                label="Konum"
                                                                value={values1.location}
                                                                onChange={handleChange1}
                                                                sx={{ marginBottom: "10px", width: "100%" }}
                                                                variant="standard"
                                                                helperText={errors1.location && <span className='text-red-800'>{errors1.location}</span>}
                                                            />
                                                            <TextField
                                                                id="address"
                                                                label="Adres"
                                                                value={values1.address}
                                                                onChange={handleChange1}
                                                                sx={{ marginBottom: "10px", width: "100%" }}
                                                                variant="standard"
                                                                helperText={errors1.address && <span className='text-red-800'>{errors1.address}</span>}
                                                            />
                                                            <TextField
                                                                id="map"
                                                                label="Harita URL"
                                                                value={values1.map}
                                                                onChange={handleChange1}
                                                                sx={{ marginBottom: "10px", width: "100%" }}
                                                                variant="standard"
                                                                helperText={errors1.map && <span className='text-red-800'>{errors1.map}</span>}
                                                            />
                                                            <TextField
                                                                id="instagram"
                                                                label="Instagram"
                                                                value={values1.instagram}
                                                                onChange={handleChange1}
                                                                sx={{ marginBottom: "10px", width: "100%" }}
                                                                variant="standard"
                                                                helperText={errors1.instagram && <span className='text-red-800'>{errors1.instagram}</span>}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='justify-center my-2 text-white'>
                                                        <button type='submit' className='font-bold bg-slate-950  rounded-2xl p-1 px-3 mr-3 mb-2'>Cafe Bilgilerini Güncelle</button>
                                                        <button type='reset' className='font-bold bg-slate-950  rounded-2xl p-1 px-3' onClick={reset}>Temizle</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <p className='flex items-center mt-3'><HomeIcon className='mr-1' />{cafeInfo?.location}</p>
                                <p className='flex items-center mt-3 max-w-48'><LocationOnIcon className='mr-1' />{cafeInfo?.address}</p>
                                <p className='flex items-center mt-3'>
                                    <LocalPhoneIcon className='mr-1' />
                                    <a href={`tel:${cafeInfo?.phone}`}>{cafeInfo?.phone}</a>
                                </p>
                                <p className='flex items-center mt-3'>
                                    <InstagramIcon className='mr-1' />
                                    <a href={`https://www.instagram.com/${cafeInfo?.instagram}`} target="_blank" rel="noopener noreferrer">
                                        {cafeInfo?.instagram}
                                    </a></p>
                            </div>
                        </div>
                    </div>
                </div >
                <div>
                    <div className='flex flex-col justify-center items-center text-gray-300 text-xs mb-5'>
                        <p>Yeni Nesil Dijital QR Menü</p>
                        <p>Tüm Hakları Saklıdır</p>
                        <p>©2025</p>
                    </div>
                </div>
            </div >
        </Drawer >
    )
}

export default NavDrawer