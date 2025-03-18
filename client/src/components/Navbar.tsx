import ReorderIcon from '@mui/icons-material/Reorder';
import { Container } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setDrawer } from '../redux/appSlice';
import useCafe from '../hooks/useCafe';
import LanguageIcon from '@mui/icons-material/Language';

const Navbar = () => {

    const cafeInfo = useCafe();
    const dispatch = useDispatch();

    const currentUrl = window.location.pathname;

    const openDrawer = () => {
        dispatch(setDrawer(true))
    }
    return (
        <Container maxWidth="sm">
            <div className=' flex flex-row justify-between w-full pt-5 mb-5 px-[16px]'>
                <div className='m-0 cursor-pointer' onClick={openDrawer}>
                    <ReorderIcon className='text-white' sx={{ fontSize: "35px" }} />
                </div>
                <div>
                    {
                        currentUrl === "/" ?
                            <img className='size-36' src={`/${cafeInfo?.logo}`} alt="Cafe Logo" /> :
                            <p className='text-white text-2xl font-[arial]'>{cafeInfo?.name} - Menu</p>
                    }
                </div>
                <LanguageIcon className='text-white cursor-pointer' sx={{ fontSize: "35px" }} />
            </div>
        </Container>
    )
}

export default Navbar