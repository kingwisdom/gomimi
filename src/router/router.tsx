import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Wrapper from "../layouts/Wrapper";
import Story from "../pages/Story";
import About from "../pages/About";
import Landing from "../pages/Landing";


const routers = createBrowserRouter([
  {
    element: <Wrapper />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/job", element: <Home /> },
      { path: "/story", element: <Story /> },
      { path: "/info", element: <About /> },
    ],
  },
]);

export default routers;
