import Drawer from '@mui/material/Drawer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { setDrawer } from '../redux/appSlice'
import useCafe from '../hooks/useCafe'
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import InstagramIcon from '@mui/icons-material/Instagram';

const NavDrawer = () => {

    const { drawer } = useSelector((state: RootState) => state.app)

    const cafeInfo = useCafe();

    const dispatch = useDispatch();

    const closeDrawer = () => {
        dispatch(setDrawer(false))
    }
    return (
        <Drawer open={drawer} anchor='left' onClose={closeDrawer}>
            <div className='h-full flex flex-col justify-between specialBg font-[arial]'>
                <div>
                    <div className='text-center'>
                        <h1 className=' text-white p-4 font-bold text-xl'>Hoşgeldiniz!</h1>
                        <hr className='border-black' />
                    </div>
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
                </div>
                <div>
                    <div className='flex flex-col justify-center items-center text-gray-300 text-xs mb-5'>
                        <p>Yeni Nesil Dijital QR Menü</p>
                        <p>Tüm Hakları Saklıdır</p>
                        <p>©2025</p>
                    </div>
                </div>
            </div>
        </Drawer>
    )
}

export default NavDrawer