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
  const [errors, setErrors] = useState(null);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();

     dispatch(sessionActions.login({ credential:credential, password: password }))
.then(() => dispatch(sessionActions.restoreUser()))
     .then(closeModal)
     .catch(async (res) => {
      console.log('hit3')
       const data = await res.json()
       console.log(data,'..............')
       if (data && data.errors) {
         setErrors(data.errors);
        }else if (data && data.message){
          setErrors(data.message)

        }
      })
      // console.log(errors, 'this is the errors')
      // window.location.reload();
  };

  return (
    <div className='LoginForm'>
      <h1>Log In</h1>

      <form onSubmit={handleSubmit} >
        {errors && (
          <p id='error'>{errors}</p>
        )}
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
