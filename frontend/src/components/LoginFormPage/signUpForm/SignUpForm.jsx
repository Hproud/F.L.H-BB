

export default function SignUpForm() {
  return (
    <div>
        <h1>Sign Up!</h1>
        <form className='signUp'>
        <label>Create a Username:</label>
        <input type="text" />
        <br />
        <label>First Name:</label>
        <input type="text" />
        <br />
        <label>Last Name</label>
        <input type="text" />
        <br />
        <label>Email</label>
        <input type="text" />
        </form>
        <button type='submit'>Submit</button>
    </div>
  )
}
