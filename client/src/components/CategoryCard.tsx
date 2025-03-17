import useProducts from '../hooks/useProducts';
import { CategoryType } from '../types/Types'
import { Card } from '@mui/material';

interface PropsType {
    category: CategoryType
}

const CategoryCard = (props: PropsType) => {
    const { name, image } = props.category;
    const currentUrl = window.location.pathname;
    const { getProductByCategoryName } = useProducts();
    return (
        <div className='px-[16px]'>
            <Card onClick={() => { getProductByCategoryName(name) }} className="flex flex-col justify-between max-w-xl h-36 sm:h-56 mt-5 cursor-pointer relative">
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
        </div >

    )
}

export default CategoryCard