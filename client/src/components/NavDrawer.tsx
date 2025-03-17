import Drawer from '@mui/material/Drawer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { setCurrentEmployee, setDrawer, setLoading } from '../redux/appSlice'
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
import { schemaLogin } from '../schema/Schema'
import { EmployeeType } from '../types/Types'
import { toast } from 'react-toastify'
import EmployeeServices from '../services/EmployeeServices'
import { useNavigate } from 'react-router-dom'

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

    const { values, handleSubmit, handleChange, errors, resetForm } = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: submit,
        validationSchema: schemaLogin
    });

    const reset = () => {
        resetForm();
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
                                <h1 className='text-white font-bold text-md'>Adres Bilgileri</h1>
                                <p className='flex items-center mt-3'><HomeIcon className='mr-1' />{cafeInfo?.location}</p>
                                <p className='flex items-center mt-3 max-w-48'><LocationOnIcon className='mr-1' />{cafeInfo?.address}</p>
                            </div>
                        </div>
                        <div>
                            <div className='text-white p-4'>
                                <h1 className='text-white font-bold text-md'>İletişim Bilgileri</h1>
                                <p className='flex items-center mt-3'><LocalPhoneIcon className='mr-1' />{cafeInfo?.phone}</p>
                                <p className='flex items-center mt-3'><InstagramIcon className='mr-1' />{cafeInfo?.instagram}</p>
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