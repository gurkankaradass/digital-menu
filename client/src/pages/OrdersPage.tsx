import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/store"
import Navbar from "../components/Navbar"
import { Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import { TableType } from "../types/Types"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { setLoading, setTables } from "../redux/appSlice"
import OrderServices from "../services/OrderServices"
import { toast } from "react-toastify"
import { useFormik } from "formik"
import { schemaTable } from "../schema/Schema"
import TableServices from "../services/TableServices"

interface OrderTypeRes {
    table_number: number,
    product_name: string,
    quantity: number,
    total_price: number,
    bill: number
}

const OrdersPage = () => {
    const { tables, currentEmployee } = useSelector((state: RootState) => state.app)
    const [order, setOrder] = useState<OrderTypeRes[]>([]);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedTableNumber, setSelectedTableNumber] = useState<number | undefined>(undefined);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);
    const [open6, setOpen6] = useState(false);
    const [selectedTableId, setSelectedTableId] = useState<number | undefined>(undefined);


    const handleOpenDrawer = (table_number: number) => {
        getOrder(table_number)
        setSelectedTableNumber(table_number);
    }

    const getOrder = async (table_number: number) => {
        try {
            dispatch(setLoading(true));
            const response: OrderTypeRes[] = await OrderServices.getOrderByTableNumber(table_number)
            if (response) {
                setOrder(response);
                setOpen(true)
            }
        } catch (error) {
            toast.warning("Bu Masa İçin Sipariş Bulunamadı...");
        } finally {
            dispatch(setLoading(false));
        }
    }

    const deleteOrder = async (table_number: number, product_name: string) => {
        try {
            dispatch(setLoading(true))
            const response = await OrderServices.deleteOrder(table_number, product_name);
            if (response) {
                toast.success(response.message);
                setOpen(false)
            }
        } catch (error: any) {
            toast.error(error);
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleDeleteAllOrder = () => {
        if (selectedTableNumber) {
            deleteAllOrder(selectedTableNumber)
        }
    }

    const deleteAllOrder = async (table_number: number) => {
        try {
            dispatch(setLoading(true))
            const response = await OrderServices.deleteAllOrder(table_number);
            if (response) {
                toast.success(response.message);
                setOpenDelete(false)
                setOpen(false)
            }
        } catch (error: any) {
            toast.error(error);
        } finally {
            dispatch(setLoading(false))
        }
    }

    const addNewTable = async (values3: any, action: any) => {
        try {
            dispatch(setLoading(true));
            const payload: TableType = {
                table_number: values3.table_number
            };
            const response = await TableServices.addNewTable(payload);
            if (response && response.success) {
                dispatch(setTables(response.newTables))
                localStorage.setItem("tables", JSON.stringify(response.newTables));
                toast.success(response.message)
                resetForm3();
                setOpen6(false)
            } else {
                toast.error("Beklenmeyen bir hata oluştu.");
            }
        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleOpenDeleteDialogTable = (id: number | undefined) => {
        setSelectedTableId(id);
        setOpen5(true);
    };

    const deleteTable = async (id?: number) => {
        try {
            dispatch(setLoading(true))
            if (id) {
                const response = await TableServices.deleteEmployee(id)
                if (response) {
                    dispatch(setTables(response.newTables))
                    localStorage.setItem("tables", JSON.stringify(response.newTables));
                    toast.success(response.message);
                    setOpen5(false)
                }
            }
        } catch (error: any) {
            toast.error(error);
        } finally {
            dispatch(setLoading(false))
        }
    }

    const formik3 = useFormik({
        initialValues: {
            table_number: ""
        },
        onSubmit: addNewTable,
        validationSchema: schemaTable,
        enableReinitialize: true
    });
    const { values: values3, handleSubmit: handleSubmit3, handleChange: handleChange3, errors: errors3, resetForm: resetForm3 } = formik3;

    const reset = () => {
        resetForm3();
    }

    return (
        <div>
            <Navbar />
            <Container maxWidth="sm">
                <div className='specialBg text-white flex justify-between text-sm sm:text-xl p-3 mb-5'>
                    <div onClick={() => navigate("/")} className='flex justify-center items-center cursor-pointer'>
                        <ArrowBackIosNewIcon className='mr-2' />
                        <p>Kategorilere Dön</p>
                    </div>
                    <div className='flex justify-center items-center'>
                        <p>Masalar</p>
                        <FormatAlignRightIcon className='ml-2' />
                    </div>
                </div>
                <div className="flex flex-row justify-center flex-wrap">
                    {
                        tables.map((table: TableType) => (
                            <div onClick={() => handleOpenDrawer(table.table_number)} className="flex justify-center items-center w-24 h-24 bg-violet-50 m-3 text-lg font-bold p-4 cursor-pointer rounded-xl">
                                <p className="text-center">{table.table_number}<br />Numaralı Masa</p>
                            </div>
                        ))
                    }
                    <Dialog open={open} onClose={() => {
                        setOrder([])
                        setOpen(false)
                    }}>
                        <DialogTitle sx={{ justifyContent: "center" }}>
                            <h3 className='text-center font-bold'>SİPARİŞLER</h3></DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <h1 className="font-bold mb-2">{selectedTableNumber} Numaralı Masa:</h1>
                                <div className="flex w-64 justify-between font-bold">
                                    <h4>Ürün</h4>
                                    <div className="flex justify-between">
                                        <h4>Adet</h4>
                                        <h4 className="mx-2">Fiyat</h4>
                                        <h4>Çıkar</h4>
                                    </div>
                                </div>
                                {
                                    order && order.map((order) => (
                                        <div className="flex w-full justify-between mb-1">
                                            <p>{order.product_name}</p>
                                            <div className="flex justify-evenly">
                                                <p>x{order.quantity}</p>
                                                <p className="mx-5">{order.total_price}₺</p>
                                                <button className='text-red-700 mr-2' onClick={() => deleteOrder(order.table_number, order.product_name)}>Sil</button>
                                            </div>
                                        </div>
                                    ))
                                }
                                {order.length > 0 && (
                                    <div className="flex justify-end w-full font-bold mt-3 border-t pt-2">
                                        <p>Toplam Tutar: {order[order.length - 1].bill}₺</p>
                                    </div>
                                )}
                                {
                                    currentEmployee && currentEmployee.role === "admin" &&
                                    <button onClick={() => setOpenDelete(true)} className="w-full text-center bg-black text-white rounded-lg mt-2 p-1">Hesap Ödendi</button>
                                }
                            </DialogContentText>
                        </DialogContent>
                        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                            <DialogTitle>
                                <p className="font-bold">Hesap Ödeme</p></DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Hesap ödendi mi?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions sx={{ marginBottom: "10px" }}>
                                <button onClick={() => setOpenDelete(false)} className='font-bold bg-slate-950  rounded-2xl p-1 px-3 text-white'>İptal</button>
                                <button onClick={handleDeleteAllOrder} className='font-bold bg-slate-950 rounded-2xl p-1 px-3 text-white'>Evet</button>
                            </DialogActions>
                        </Dialog>
                    </Dialog>
                </div>
                <div>
                    {
                        currentEmployee && currentEmployee.role === "admin" ?
                            <div onClick={() =>
                                setOpen4(true)} className="h-10 bg-white mx-[16px] my-5 rounded-lg text-center flex flex-row justify-center items-center font-bold cursor-pointer font-[arial]">
                                <p>Masa Ekle veya Sil</p>
                            </div> : <div></div>
                    }
                    <Dialog open={open4} onClose={() => setOpen4(false)}>
                        <form className='w-64 font-[arial]' onSubmit={handleSubmit3}>
                            <DialogTitle sx={{ justifyContent: "center" }}>
                                <h3 className='text-center font-bold'>MASA LİSTESİ</h3></DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    {tables && tables.map((table) => (
                                        <div key={table.id} className="flex flex-row justify-between mb-3">
                                            {table.table_number} Numaralı Masa
                                            <button className='text-red-700' onClick={() => handleOpenDeleteDialogTable(table.id)}>Sil</button>
                                        </div>
                                    ))}
                                </DialogContentText>
                            </DialogContent>
                            <div onClick={() => setOpen6(true)} className="h-10 bg-black text-white mx-[16px] my-5 rounded-lg text-center flex flex-row justify-center items-center font-bold cursor-pointer font-[arial]">
                                <p>Masa Ekle</p>
                            </div>
                            <Dialog open={open5} onClose={() => setOpen5(false)}>
                                <DialogTitle>
                                    <p className="font-bold">Masayı Sil</p></DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Masayı silmek istediğinize emin misiniz?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions sx={{ marginBottom: "10px" }}>
                                    <button onClick={() => setOpen5(false)} className='font-bold bg-slate-950  rounded-2xl p-1 px-3 text-white'>İptal</button>
                                    <button onClick={() => deleteTable(selectedTableId)} className='font-bold bg-slate-950  rounded-2xl p-1 px-3 text-white'>Evet, Sil</button>
                                </DialogActions>
                            </Dialog>
                        </form>
                    </Dialog>
                    <Dialog open={open6} onClose={() => setOpen6(false)}>
                        <form className='w-64 font-[arial]' onSubmit={handleSubmit3}>
                            <DialogTitle sx={{ justifyContent: "center" }}>
                                <h3 className='text-center font-bold'>MASA EKLE</h3></DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    <div>
                                        <TextField
                                            id="table_number"
                                            label="Masa Numarası"
                                            type='number'
                                            value={values3.table_number}
                                            onChange={handleChange3}
                                            sx={{ marginBottom: "10px", width: "100%" }}
                                            variant="standard"
                                            helperText={errors3.table_number && <span className='text-red-800'>{errors3.table_number}</span>}
                                        />
                                    </div>
                                </DialogContentText>
                            </DialogContent>
                            <div className='flex flex-row justify-center mb-2 text-white'>
                                <button type='submit' className='font-bold bg-slate-950  rounded-2xl p-1 px-3 mr-3'>Masa Ekle</button>
                                <button type='reset' onClick={reset} className='font-bold bg-slate-950  rounded-2xl p-1 px-3'>Temizle</button>
                            </div>
                        </form>
                    </Dialog>
                </div>
            </Container>
        </div>
    )
}

export default OrdersPage