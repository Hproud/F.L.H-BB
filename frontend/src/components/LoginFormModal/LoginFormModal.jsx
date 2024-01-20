// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import {  useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState();
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();

    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
         setErrors(data.message);
        }
      });
  };

console.log(errors)
  return (
    <div className='LoginForm'>
      <h1>Log In</h1>
      {errors && (
        <p>{errors}</p>
      )}
      <form onSubmit={handleSubmit} >
        <label>
          Username or Email
          {<br />}
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}

          />
        </label>
        {<br />}

        <label>
          Password
          {<br />}

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}

          />
        </label>
        {<br />}
        {<br />}

        <button type="submit" disabled={credential.length<4 || password.length<6}>Log In</button>
        {<br />}

          <button type='submit' onClick={() => {
            setCredential('demo@user.io')
            setPassword('password')
          }}>DemoUser</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
