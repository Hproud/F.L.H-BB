import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import * as sessionActions from './store/session'
import Navigation from './components/Navigation/Navigation';
import LandingPage from './components/LandingPage/LandingPage';

const Layout = () =>{
  const [isLoaded,setIsLoaded] = useState(false)
const dispatch = useDispatch()

useEffect(() => {
  dispatch(sessionActions.restoreUser()).then(()=>{
  setIsLoaded(true)
},[dispatch])

})

  return(
    <>
    <Navigation isLoaded={isLoaded} />
    {isLoaded && <Outlet />}
    </>
  )
}

const router = createBrowserRouter([
  {
    element: < Layout />,
    children:[
      {
        path: '/',
        element: <LandingPage />
      },


    ]
  }
]);

function App() {

  return <RouterProvider router={router} />;
}

export default App;
