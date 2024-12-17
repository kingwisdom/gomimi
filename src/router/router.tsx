import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Wrapper from "../layouts/Wrapper";
import Story from "../pages/Story";
import About from "../pages/About";


const routers = createBrowserRouter([
  {
    element: <Wrapper />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/story", element: <Story /> },
      { path: "/info", element: <About /> },
    ],
  },
]);

export default routers;
