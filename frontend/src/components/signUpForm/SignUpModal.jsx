import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
// import { useNavigate } from "react-router-dom";
import '../signUpForm/signUpForm.css'
import { useModal } from "../../context/Modal";



export default function SignUpModal() {
  const dispatch = useDispatch();
  const [username, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState({});
  // const navigate = useNavigate();

const {closeModal} = useModal();



  useEffect(() => {
    const errs = {};
    if (firstName.length < 1) {
      errs.firstName = "First Name is required";
    }

    if (lastName.length < 1) {
      errs.lastName = "Last Name is required";
    }

    // if (email.length < 1 || !email.includes("@")) {
    //   errs.email = "Valid email is required";
    // }

    if (password.length < 6 || password.length < 1 ) {
      errs.password = "Password must be at least 6 characters";

    } if (password.length < 1) {
      errs.password = "Password required";
    }
    if(password !== password2){
      errs.password= 'Passwords must match'
    }

    if (username.length < 1) {
      errs.username = "Username is required";
    }

    if (username.includes("@")) {
      errs.username = "Username can not be an email";
    }

    return setErrors(errs);
  }, [firstName, lastName, email, username, password,password2]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      firstName,
      lastName,
      email,
      username,
      password,
    }

     dispatch(sessionActions.signUp(newUser)).then(closeModal)
    // navigate("/");
  };
  return (
    <div>
      <h1>Sign Up!</h1>
      <form className="signUpForm" onSubmit={handleSubmit}>
        <label>First Name: </label>

<br />
        <input
          type='text'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <p>{errors.firstName}</p>
        <label>Last Name: </label>

<br />
        <input
          type='text'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <p>{errors.lastName}</p>
        <label>Email: </label>

<br />
        <input
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p>{errors.email}</p>

        <label>Create a Username:</label>

<br />
        <input
          type='text'
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
        <p>{errors.username}</p>
  <p>{errors.password}</p>
        <label className='password'>Password: </label>
<br />
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword1(e.target.value)}
          />
<br />
        <label className='confirm-password'>Confirm Password: </label>

        <br />
<input
  type='password'
  value={password2}
  onChange={(e) => setPassword2(e.target.value)}
/>
<br />
      <button type='submit' disabled={Object.values(errors).length}>Sign Up</button>
      </form>
    </div>
  );
}
