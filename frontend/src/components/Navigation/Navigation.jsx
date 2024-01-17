

import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../store/session'
import ProfileButton from './profileButton'
import './Navigation.css'
export default function Navigation() {
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch()
const navigate=useNavigate()



const handleLogout = (e) =>{
    e.preventDefault()
    dispatch(logout())
    navigate("/login",{replace:true})
   }

  return (
    <nav className='NavBar'>
<ul>
    <li>
        <NavLink to='/'>Home</NavLink>
    </li>

   <li hidden={user}>
    <NavLink to='/login' >Login</NavLink>
   </li>
   <li hidden={user}>
    <NavLink to='/users' >Sign Up</NavLink>
   </li>
<li hidden={!user}>
    <ProfileButton user={user}/>
</li>
</ul>
<button type='button' onClick={handleLogout} hidden={!user}>Log Out</button>


    </nav>
  )
}
