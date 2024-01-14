import { createBrowserRouter, Outlet, RouterProvider, useNavigate } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';




const Layout = () =>{
  const [isLoaded,setIsLoaded] = useState(false)
const dispatch = useDispatch()
const navigate = useNavigate()
useEffect(() => {
dispatch(sessionActions.restoreUser()).then(()=>{
  setIsLoaded(true)
},[dispatch])



})



  return(
    <>
    {isLoaded && <Outlet />}
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Welcome!</h1>
  },
  {
    path: '/login',
    element: <LoginFormPage />
  }
]);

function App() {

  return <RouterProvider router={router} />;
}

export default App;
