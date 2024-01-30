

import {  useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
// import LoginFormModal from '../LoginFormModal/LoginFormModal'
// import OpenModalButton from '../OpenModalButton/OpenModalButton'
import ProfileButton from './profileButton'
import './Navigation.css'

// import SignUpModal from '../signUpForm/SignUpModal'
// import { useNavigate } from 'react-router-dom'


export default function Navigation({isLoaded}) {

    const user = useSelector(state => state.session.user)
// const navigate = useNavigate()

// console.log(user,'my user')
  return (
    <div className='navContainer' style={{position:'fixed'}} >
      <Link to='/' id={'clickable'}>
      <img src='https://res-console.cloudinary.com/dxbirmmv1/thumbnails/v1/image/upload/v1706376134/RGVzaWduX2t0djFvcw==/preview' className='logo' style={{height: '6em', width: '6em', float: 'left'}}  />
    </Link>
    <nav >
<ul className='navlist' style={{float: 'left'}} id={'dropdown'} >
{/*
    <li key='homeButton'>
        <NavLink to='/'>Home</NavLink>
    </li> */}

    <li key='createSpotLink' className={'createSpotLink'} hidden={!user} style={{alignSelf:'center'}} id={'clickable'} >
<Link to='/spots/new' >Create a New Spot</Link>
    </li>


{isLoaded &&( <ProfileButton />)}
</ul>

    </nav>
    </div>
  )
}
