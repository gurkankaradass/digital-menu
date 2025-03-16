import { CategoryType } from '../types/Types'
import { Card } from '@mui/material';

interface PropsType {
    category: CategoryType
}

const CategoryCard = (props: PropsType) => {
    const { id, name, image } = props.category;
    return (
        <div className='flex justify-center'>
            <Card className="flex flex-col justify-between max-w-xl h-36 sm:h-56 mt-5 cursor-pointer relative">
                <div>
                    <img src={image} alt={name} className="object-contain w-full h-full" />

                    {/* Karartma efekti */}
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                    <div className="absolute bottom-0 left-0 right-0 pb-2">
                        <p className='font-bold text-2xl text-white font-[arial] shadow-black shadow-xl text-center'>{name}</p>
                    </div>
                </div>
            </Card>
        </div>

    )
}

export default CategoryCard