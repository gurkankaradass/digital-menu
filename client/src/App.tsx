import { ToastContainer } from 'react-toastify'
import './App.css'
import Spinner from './components/Spinner'
import RouteConfig from './config/RouteConfig'
import NavDrawer from './components/NavDrawer'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCategories, setCurrentEmployee, setProducts } from './redux/appSlice'

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedProducts = localStorage.getItem("categoryProducts");
    if (storedProducts) {
      dispatch(setProducts(JSON.parse(storedProducts)));
    }
  }, []);

  useEffect(() => {
    const storedCategories = localStorage.getItem("category");
    if (storedCategories) {
      dispatch(setCategories(JSON.parse(storedCategories)));
    }
  }, []);

  useEffect(() => {
    const storedEmployee = localStorage.getItem("currentEmployee");
    if (storedEmployee) {
      dispatch(setCurrentEmployee(JSON.parse(storedEmployee)));
    }
  }, []);

  return (
    <>
      <RouteConfig />
      <ToastContainer autoClose={1500} style={{ fontSize: "17px" }} />
      <Spinner />
      <NavDrawer />
    </>
  )
}

export default App
