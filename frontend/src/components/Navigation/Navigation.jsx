
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../store/session'
import { isPlainObject } from 'redux'

export default function Navigation() {
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch()
const navigate=useNavigate()
const [LoggedIn,setLoggedIn] = useState(user);
useEffect(()=>{
if(user !== null){
    setLoggedIn(true)

}
},[user])


const handleLogout = (e) =>{
    e.preventDefault()
    dispatch(logout())
     navigate('/login')
   }

  return (
    <nav>
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

</ul>
<button onClick={handleLogout}>Log Out</button>
    </nav>
  )
}
