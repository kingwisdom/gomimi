import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Wrapper from "../layouts/Wrapper";


const routers = createBrowserRouter([
  {
    element: <Wrapper />,
    children: [
      { path: "/", element: <Home /> },
      // { path: "/about", element: <About /> },
      // { path: "/visit/:destination", element: <VisitWrapper /> },
    ],
  },
]);

export default routers;
