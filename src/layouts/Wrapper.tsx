import { Outlet } from "react-router-dom";
// import Footer from "../component/Footer";
import { Toaster } from "react-hot-toast";
// import 'react-toastify/dist/ReactToastify.css';


export default function Wrapper() {
  return (
    <>
      {/* <Navbar /> */}
      <Outlet />
      {/* <Footer /> */}
      <Toaster />
    </>
  );
}