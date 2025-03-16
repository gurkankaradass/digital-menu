import { ToastContainer } from 'react-toastify'
import './App.css'
import Spinner from './components/Spinner'
import RouteConfig from './config/RouteConfig'
import NavDrawer from './components/NavDrawer'

function App() {

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
