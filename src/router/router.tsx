import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Wrapper from "../layouts/Wrapper";
import Story from "../pages/Story";


const routers = createBrowserRouter([
  {
    element: <Wrapper />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/story", element: <Story /> },
      // { path: "/visit/:destination", element: <VisitWrapper /> },
    ],
  },
]);

export default routers;
