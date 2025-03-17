import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import Navbar from '../components/Navbar';
import { Container } from '@mui/material';
import { CategoryType, ProductType } from '../types/Types';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import { useNavigate } from 'react-router-dom';

const CategoryPage = () => {
    const { products, categories } = useSelector((state: RootState) => state.app);

    const navigate = useNavigate();

    // Kategorinin ismini URL'den alıyoruz, %20 gibi karakter kodlarını çözümlüyoruz
    const categoryNameFromUrl = decodeURIComponent(window.location.pathname.split('/')[1]); // /{categoryName} şeklinde bir URL var

    // Kategoriyi bulmak
    const category = categories.find((category: CategoryType) => category.name === categoryNameFromUrl);

    return (
        <div>
            <Navbar />
            <Container maxWidth="sm">
                <div className='specialBg text-white flex justify-between text-sm sm:text-xl p-3'>
                    <div onClick={() => navigate("/")} className='flex justify-center items-center cursor-pointer'>
                        <ArrowBackIosNewIcon className='mr-2' />
                        <p>Kategorilere Dön</p>
                    </div>
                    <div className='flex justify-center items-center'>
                        <p>{categoryNameFromUrl}</p>
                        <FormatAlignRightIcon className='ml-2' />
                    </div>
                </div>
                {category &&
                    <CategoryCard key={category.id} category={category} />
                }
                {
                    products && products.map((product: ProductType) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                }
            </Container>
        </div>
    )
}

export default CategoryPage