import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'

const RouteConfig = () => {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
        </Routes>
    )
}

export default RouteConfig