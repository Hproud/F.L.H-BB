

import { useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
// import LoginFormModal from '../LoginFormModal/LoginFormModal'
// import OpenModalButton from '../OpenModalButton/OpenModalButton'
import ProfileButton from './profileButton'
import './Navigation.css'
// import SignUpModal from '../signUpForm/SignUpModal'
// import { useNavigate } from 'react-router-dom'


export default function Navigation({isLoaded}) {
    const user = useSelector(state => state.session.user)
// const navigate = useNavigate()

  return (
    <div className='navContainer'>
      <Link to='/'>
      <img src='https://res.cloudinary.com/dxbirmmv1/image/upload/v1705641036/Design_ktv1os.png' className='logo' style={{height: '120px',
    width: '275px', flex: 'start'}}  />
    </Link>
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
