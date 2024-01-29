import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
// import { useNavigate } from "react-router-dom";
import "../signUpForm/signUpForm.css";
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

  const { closeModal } = useModal();

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

    if (password.length < 6 || password.length < 1) {
      errs.password = "Password must be at least 6 characters";
    }
    if (password.length < 1) {
      errs.password = "Password required";
    }
    if (password !== password2) {
      errs.password = "Passwords must match";
    }

    if (username.length < 1) {
      errs.username = "Username is required";
    }

    if (username.includes("@")) {
      errs.username = "Username can not be an email";
    }

    return setErrors(errs);
  }, [firstName, lastName, email, username, password, password2]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      firstName,
      lastName,
      email,
      username,
      password,
    };

    dispatch(sessionActions.signUp(newUser))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    //  console.log(errors, 'this is the errors')
    // navigate("/");
  };
  return (
    <div className='formcontainer'>
      <h1 className='signuptitle'>Sign Up!</h1>
      <form className='signUpForm' onSubmit={handleSubmit}>
        <div className="inputfields">

        <label className='f1'>First Name:</label>
        <input
        className='f2'
          id='signupcontainer1'
          type='text'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          aria-required
          />
        <label className='f3'>Last Name: </label>
        <br />
        <input
          id='signupcontainer2'
          className="f4"
          type='text'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          />
        { <label className='f5'>Email: </label>}

        <input
        className="f6"
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
        <p id='f7' className='sigunperror'>
          {errors.email}
        </p>
        <label className='f8'>Create a Username:</label>
        <br />
        <input
        className="f9"
          id='signupcontainer4'
          type='text'
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          />
        <p id='f10' className='signuperror'>{errors.username}</p>
        <p id='f11' className='signuperror'>
          {errors.password}
        </p>
        <label className='f12'>Password: </label>
        <br />
        <input
        className="f13"
          id='signupcontainer5'
          type='password'
          value={password}
          onChange={(e) => setPassword1(e.target.value)}
          />
        <br />
        <label className='f14'>Confirm Password: </label>
        <br />
        <input
        className="f15"
          id='signupcontainer6'
          type='password'
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          />
        <br />
        <button
        className="f16"
        type='submit'
        disabled={Object.values(errors).length}
        id={"clickable"}
        >
          Sign Up
        </button>
          </div>
      </form>
    </div>
  );
}
