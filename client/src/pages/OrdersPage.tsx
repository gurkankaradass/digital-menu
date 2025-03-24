import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/store"
import Navbar from "../components/Navbar"
import { Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { TableType } from "../types/Types"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { setLoading } from "../redux/appSlice"
import OrderServices from "../services/OrderServices"
import { toast } from "react-toastify"

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
    const [openDeleteAll, setOpenDeleteAll] = useState(false);
    const [selectedTableNumber, setSelectedTableNumber] = useState<number | undefined>(undefined);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
                            <div onClick={() => handleOpenDrawer(table.table_number)} className="flex justify-center items-center w-24 h-24 bg-white m-3 text-lg font-bold p-4 cursor-pointer rounded-xl">
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
                                <div className="flex w-64 justify-between font-bold mb-2">
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
                                                <button className='text-red-700 mr-2' onClick={() => setOpenDelete(true)}>Sil</button>
                                            </div>
                                        </div>
                                    ))
                                }
                                <h1 className="font-bold">{selectedTableNumber} Numaralı Masa</h1>
                            </DialogContentText>
                        </DialogContent>
                        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                            <DialogTitle>
                                <p className="font-bold">Masayı Sil</p></DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Masayı silmek istediğinize emin misiniz?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions sx={{ marginBottom: "10px" }}>
                                <button onClick={() => setOpenDelete(false)} className='font-bold bg-slate-950  rounded-2xl p-1 px-3 text-white'>İptal</button>
                                <button className='font-bold bg-slate-950  rounded-2xl p-1 px-3 text-white'>Evet, Sil</button>
                            </DialogActions>
                        </Dialog>
                    </Dialog>
                </div>
            </Container>
        </div>
    )
}

export default OrdersPage