

import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
// import LoginFormModal from '../LoginFormModal/LoginFormModal'
// import OpenModalButton from '../OpenModalButton/OpenModalButton'
import ProfileButton from './profileButton'
import './Navigation.css'
// import SignUpModal from '../signUpForm/SignUpModal'



export default function Navigation({isLoaded}) {
    const user = useSelector(state => state.session.user)


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

    <li key='createSpotLink' hidden={!user}>
<NavLink to='/spots/new'>Create a Spot</NavLink>
    </li>

{isLoaded && <ProfileButton user={user} />}
</ul>

    </nav>
    </div>
  )
}
