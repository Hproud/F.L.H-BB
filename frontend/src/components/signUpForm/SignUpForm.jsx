import { useEffect, useState } from "react";
import { useDispatch } from "react-redux"
import * as sessionActions from '../../store/session'
import { Navigate } from "react-router-dom";


export default function SignUpForm() {
const dispatch = useDispatch();
const [userName,setUserName] = useState('');
const [firstName,setFirstName] = useState('');
const [lastName,setLastName] = useState('');
const [email,setEmail] = useState('');
const [password,setPassword] = useState('')
const [errors,setErrors] = useState({});


useEffect(()=>{
const errs={}
if(firstName.length <1){
  errs.firstName = 'First Name is required'
}

if(lastName.length < 1){
  errs.lastName = 'Last Name is required'
}

if(email.length < 1 || !email.includes('@')){
errs.email = 'Valid email is required'
}

if(password.length < 6 || password.length < 1){
  errs.password = 'Password must be at least 6 characters'
}

if (userName.length < 1){
  errs.userName = 'Username is required'
}

if (userName.includes('@')){
  errs.userName = 'Username can not be an email'
}

setErrors(errs)

},[firstName,lastName,email,userName,password])

const handleSubmit = (e) =>{
  e.preventDefault();
  const newUser = {
  firstName,
  lastName,
  email,
  userName,
  password
  }


 return dispatch(sessionActions.signup({newUser})).then(res => res.json()).then(() => {return <Navigate to='/' replace={true} />})
}
  return (
    <div>
        <h1>Sign Up!</h1>
        <form className='signUp' onSubmit={handleSubmit}>
        <label>Create a Username:</label>

        <input type="text"
        value={userName}
        onChange={e => setUserName(e.target.value)}
        />
        <p>{errors.userName}</p>
        <label>First Name: </label>

        <input type="text"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        />
        <p>{errors.firstName}</p>
        <label>Last Name: </label>

        <input type="text"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        />
        <p>{errors.lastName}</p>
        <label>Email: </label>

        <input type="text"
        value={email}
        onChange={e => setEmail(e.target.value)}
        />
        <p>{errors.email}</p>

        <label className="password">Password: </label>

        <input type='text'
        value={password}
        onChange={e => setPassword(e.target.value)}
        />
        <p>{errors.password}</p>
        </form>
        <button type='submit'>Submit</button>
    </div>
  )
}
