import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";
import Header from "../components/Header";
// import 'react-toastify/dist/ReactToastify.css';


export default function Wrapper() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <Toaster />
    </>
  );
}