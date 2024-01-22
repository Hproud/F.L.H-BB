

import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
// import LoginFormModal from '../LoginFormModal/LoginFormModal'
// import OpenModalButton from '../OpenModalButton/OpenModalButton'
import ProfileButton from './profileButton'
import './Navigation.css'
// import SignUpModal from '../signUpForm/SignUpModal'



export default function Navigation({isLoaded}) {
    const user = useSelector(state => state.session.user)

//     const sessionLinks = user ?
//     (
//       <li>
//         <ProfileButton user={user} />
//       </li>
//     ) : (
//       <>
//         <li>
//           <OpenModalButton
//             buttonText="Log In"
//             modalComponent={<LoginFormModal />}
//               onButtonClick={() =>{<LoginFormModal /> }}

// />
//           {/* <NavLink to="/login">Log In</NavLink> */}
//         </li>
//         <li>
//           <OpenModalButton
//             buttonText="Sign Up"
//             modalComponent={<SignUpModal />}
//           />
//           {/* <NavLink to="/signup">Sign Up</NavLink> */}
//         </li>
//       </>
//     );


  return (
    <div className='navContainer'>
      <img src='https://res.cloudinary.com/dxbirmmv1/image/upload/v1705641036/Design_ktv1os.png' className='logo' />
    <nav >
<ul className='navlist'>
      <li>
      </li>
    <li key='homeButton'>
        <NavLink to='/'>Home</NavLink>
    </li>
    
    <li key='createSpotLink'>
<NavLink to='/spots/new'>Create a Spot</NavLink>
    </li>

{isLoaded && <ProfileButton user={user} />}
</ul>
{/* <button type='button' onClick={handleLogout} hidden={!user}>Log Out</button> */}
    </nav>
    </div>
  )
}
