import React from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <div>
      <p>Register</p>
        <Link to={"/"}>Home</Link>
        <br />
        <Link to={"/login"}>Login</Link>
    </div>
  )
}

export default Register