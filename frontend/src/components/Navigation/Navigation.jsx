
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'


export default function Navigation() {
    const user = useSelector(state => state.user)

    let isLoggedIn
    if(user !== null){
        isLoggedIn = true
    }else{
        isLoggedIn = false
    }
  return (
    <nav>
<ul>
    <li>
        <NavLink to='/'>Home</NavLink>
    </li>
   <li>
    <NavLink to='/login' >Login</NavLink>
   </li>
   <li>
    <NavLink to='/users'>Sign Up</NavLink>
   </li>
</ul>
    </nav>
  )
}
