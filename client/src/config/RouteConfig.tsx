import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import CategoryPage from '../pages/CategoryPage'

const RouteConfig = () => {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/:categoryName' element={<CategoryPage />} />
        </Routes>
    )
}

export default RouteConfig