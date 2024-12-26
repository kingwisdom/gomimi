import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import routers from './router/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routers} />
  </StrictMode>,
)

//npx shadcn@latest add accordion avatar button card dialog form input label navigation-menu popover progress select separator sheet sidebar skeleton switch table tabs textarea toggle tooltip