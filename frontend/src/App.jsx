import { createBrowserRouter, RouterProvider,Outlet } from 'react-router-dom'
import LoginFormPage from './components/LoginFormPage/LoginFormPage'




const router = createBrowserRouter([

      {
        path: '/',
        element: <LoginFormPage />
      }

])



function App() {
  return(
  <div>
    <h1> Hello from App </h1>
    <RouterProvider router={router} />
  </div>
)}

export default App;
