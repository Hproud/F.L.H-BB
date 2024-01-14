
import { useState } from "react"
export default function LoginFormPage() {

  const [credential,setCredential] = useState('');
  const [password,setPassword] = useState('')

    return (
    <div>
        <h2>Login</h2>
       <form>
        <label htmlFor="credential">Username or Email</label>
        <br />
        <input
        id='credential'
        type='text'
        value={credential}
        onChange={e => setCredential(e.target.value)}
        />
<br />
        <label htmlFor="password">Password</label>
        <br />
        <input
        id='password'
        type='text'
        value={password}
        onChange={e => setPassword(e.target.value)}
        />
       </form>
    </div>
  )
}
