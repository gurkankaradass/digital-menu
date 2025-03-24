import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import CategoryPage from '../pages/CategoryPage'
import OrdersPage from '../pages/OrdersPage'

const RouteConfig = () => {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/:categoryName' element={<CategoryPage />} />
            <Route path='/tables' element={<OrdersPage />} />
        </Routes>
    )
}

export default RouteConfig