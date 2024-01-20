import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import * as sessionActions from './store/session'
import Navigation from './components/Navigation/Navigation';
import LandingPage from './components/LandingPage/LandingPage';
import Spots from './components/Spot/Spots'
import CreateSpotForm from './components/CreateSpotForm/CreateSpotForm';

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
      {
        path: '/spots',
        children: [
          {
            path: ':spotId',
            element: <Spots />
          },
{
  path: 'new',
  element: <CreateSpotForm />
}
        ]
      }


    ]
  }
]);

function App() {

  return <RouterProvider router={router} />;
}

export default App;
