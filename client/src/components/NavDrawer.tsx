import Drawer from '@mui/material/Drawer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { setCafeInfo, setCurrentEmployee, setDrawer, setEmployees, setLoading, setTables } from '../redux/appSlice'
import useCafe from '../hooks/useCafe'
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import InstagramIcon from '@mui/icons-material/Instagram';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useEffect, useState } from 'react'
import { FaLock } from "react-icons/fa";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import { useFormik } from 'formik';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from "@mui/material";
import { schemaAddNewEmployee, schemaEditCafe, schemaLogin, schemaTable } from '../schema/Schema'
import { CafeInfoType, EmployeeType, TableType } from '../types/Types'
import { toast } from 'react-toastify'
import EmployeeServices from '../services/EmployeeServices'
import { useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import CafeServices from '../services/CafeServices'
import { FormControl } from '@mui/material'
import TableServices from '../services/TableServices'
import useTable from '../hooks/useTable'

interface CheckEmployeeType {
    employee: EmployeeType;
    message: string
}

const NavDrawer = () => {

    const { drawer, currentEmployee, employees, tables } = useSelector((state: RootState) => state.app)
    const cafeInfo = useCafe();
    const table = useTable();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | undefined>(undefined);
    const [openEdit, setOpenEdit] = useState(false);

    const getAllEmployee = async () => {
        try {
            dispatch(setLoading(true));
            const response: EmployeeType[] = await EmployeeServices.getAllEmployees();
            if (response) {
                dispatch(setEmployees(response))
                localStorage.setItem("employees", JSON.stringify(response));
            }
        } catch (error) {
            toast.error("Personeller Gertirilemedi...");
            console.error("Personeller Alınırken Hata: ", error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleOpenDeleteDialog = (id: number | undefined) => {
        setSelectedEmployeeId(id);
        setOpen3(true);
    };

    const deleteEmployee = async (id?: number) => {
        try {
            dispatch(setLoading(true))
            if (id) {
                const response = await EmployeeServices.deleteEmployee(id)
                if (response) {
                    dispatch(setEmployees(response.newEmployees))
                    localStorage.setItem("employees", JSON.stringify(response.newEmployees));
                    toast.success(response.message);
                    setOpen3(false)
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
                table.getAllTables();
                if (response.employee.role === "admin") {
                    await getAllEmployee();
                }
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
                    localStorage.setItem("cafe", JSON.stringify(response.newCafeInfo));
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

    const submit2 = async (values2: any, action: any) => {
        try {
            dispatch(setLoading(true));
            const payload: EmployeeType = {
                username: values2.username,
                password: values2.password,
                role: values2.role
            };
            const response = await EmployeeServices.addNewEmployee(payload);
            if (response && response.success) {
                dispatch(setEmployees(response.newEmployees))
                localStorage.setItem("employees", JSON.stringify(response.newEmployees));
                toast.success(response.message)
                resetForm2();
                setOpen1(false)
            } else {
                toast.error("Beklenmeyen bir hata oluştu.");
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

    const formik2 = useFormik({
        initialValues: {
            username: '',
            password: '',
            role: ''
        },
        onSubmit: submit2,
        validationSchema: schemaAddNewEmployee,
        enableReinitialize: true
    });
    const { values: values2, handleSubmit: handleSubmit2, handleChange: handleChange2, errors: errors2, resetForm: resetForm2 } = formik2;

    const reset = () => {
        resetForm();
        resetForm1();
        resetForm2();
    }

    const logout = async () => {
        try {
            dispatch(setLoading(true));
            localStorage.removeItem("currentEmployee");
            localStorage.removeItem("employees");
            localStorage.removeItem("tables");
            dispatch(setCurrentEmployee(null));
            dispatch(setEmployees([]))
            dispatch(setTables([]))
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
        reset();
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
                            <div>
                                {
                                    currentEmployee && currentEmployee.role === "admin" ?
                                        <div onClick={() =>
                                            setOpen2(true)} className="h-10 bg-white mx-[16px] my-5 rounded-lg text-center flex flex-row justify-center items-center font-bold cursor-pointer font-[arial]">
                                            <p>Personel Listesi</p>
                                        </div> : <div></div>
                                }
                                <Dialog open={open2} onClose={() => setOpen2(false)}>
                                    <form className='w-64 font-[arial]' onSubmit={handleSubmit2}>
                                        <DialogTitle sx={{ justifyContent: "center" }}>
                                            <h3 className='text-center font-bold'>PERSONEL LİSTESİ</h3></DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                <p className="font-bold text-black text-lg">Yöneticiler</p>
                                                <hr className='mb-5' />
                                                {employees &&
                                                    employees
                                                        .filter((employee) => employee.role === "admin") // Sadece adminleri filtrele
                                                        .map((employee) => (
                                                            <div key={employee.id} className="flex flex-row justify-between mb-5">
                                                                {employee.username}
                                                            </div>
                                                        ))}

                                                <p className="font-bold text-black text-lg">Garsonlar</p>
                                                <hr className='mb-5' />
                                                {employees &&
                                                    employees
                                                        .filter((employee) => employee.role === "waiter") // Sadece garsonları filtrele
                                                        .map((employee) => (
                                                            <div key={employee.id} className="flex flex-row justify-between mb-3">
                                                                {employee.username}
                                                                <button className='text-red-700' onClick={() => handleOpenDeleteDialog(employee.id)}>Sil</button>
                                                            </div>
                                                        ))}
                                            </DialogContentText>
                                        </DialogContent>
                                        <div onClick={() => setOpen1(true)} className="h-10 bg-black text-white mx-[16px] my-5 rounded-lg text-center flex flex-row justify-center items-center font-bold cursor-pointer font-[arial]">
                                            <p>Personel Ekle</p>
                                        </div>
                                        <Dialog open={open3} onClose={() => setOpen3(false)}>
                                            <DialogTitle>
                                                <p className="font-bold">Personeli Sil</p></DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    Personeli silmek istediğinize emin misiniz?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions sx={{ marginBottom: "10px" }}>
                                                <button onClick={() => setOpen3(false)} className='font-bold bg-slate-950  rounded-2xl p-1 px-3 text-white'>İptal</button>
                                                <button onClick={() => deleteEmployee(selectedEmployeeId)} className='font-bold bg-slate-950  rounded-2xl p-1 px-3 text-white'>Evet, Sil</button>
                                            </DialogActions>
                                        </Dialog>
                                    </form>
                                </Dialog>
                                <Dialog open={open1} onClose={() => setOpen1(false)}>
                                    <form className='w-64 font-[arial]' onSubmit={handleSubmit2}>
                                        <DialogTitle sx={{ justifyContent: "center" }}>
                                            <h3 className='text-center font-bold'>PERSONEL EKLE</h3></DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                <div>
                                                    <TextField
                                                        id="username"
                                                        label="Kullanıcı Adı"
                                                        value={values2.username}
                                                        onChange={handleChange2}
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
                                                        helperText={errors2.username && <span className='text-red-800'>{errors2.username}</span>}
                                                    />
                                                    <TextField
                                                        id="password"
                                                        label="Şifre"
                                                        type='password'
                                                        value={values2.password}
                                                        onChange={handleChange2}
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
                                                        helperText={errors2.password && <span className='text-red-800'>{errors2.password}</span>}
                                                    />
                                                    <FormControl>
                                                        <FormLabel sx={{ fontSize: "12px" }} id="demo-radio-buttons-group-label">Personel Rolü</FormLabel>
                                                        <RadioGroup
                                                            row
                                                            aria-labelledby="demo-radio-buttons-group-label"
                                                            name="role"
                                                            value={values2.role}
                                                            onChange={handleChange2}
                                                        >
                                                            <FormControlLabel value="admin" control={<Radio size='small' />} label="Yönetici" />
                                                            <FormControlLabel value="waiter" control={<Radio size='small' />} label="Garson" />
                                                        </RadioGroup>
                                                        {errors2.role && <FormHelperText><span style={{ fontSize: "11px" }} className='text-red-800'>{errors2.role}</span></FormHelperText>}
                                                    </FormControl>
                                                </div>
                                            </DialogContentText>
                                        </DialogContent>
                                        <div className='flex flex-row justify-center mb-2 text-white'>
                                            <button type='submit' className='font-bold bg-slate-950  rounded-2xl p-1 px-3 mr-3'>Personel Ekle</button>
                                            <button type='reset' onClick={reset} className='font-bold bg-slate-950  rounded-2xl p-1 px-3'>Temizle</button>
                                        </div>
                                    </form>
                                </Dialog>
                            </div>
                            <div>
                                {
                                    currentEmployee ?
                                        <div onClick={() => {
                                            navigate("/tables")
                                            dispatch(setDrawer(false))
                                        }}
                                            className="h-10 bg-white mx-[16px] my-5 rounded-lg text-center flex flex-row justify-center items-center font-bold cursor-pointer font-[arial]">
                                            <p>Masalar ve Siparişler</p>
                                        </div> : <div></div>
                                }
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