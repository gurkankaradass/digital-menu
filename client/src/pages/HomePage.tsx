import { Container } from "@mui/material"
import useCategories from "../hooks/useCategories"
import { CategoryType } from "../types/Types";
import CategoryCard from "../components/CategoryCard";
import Navbar from "../components/Navbar";

const HomePage = () => {
    const categories = useCategories();
    return (
        <div>
            <Navbar />
            <Container maxWidth="sm">
                {
                    categories && categories.map((category: CategoryType) => (
                        <CategoryCard key={category.id} category={category} />
                    ))
                }
            </Container>
        </div>
    )
}

export default HomePage