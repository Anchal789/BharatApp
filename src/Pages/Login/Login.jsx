import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div>
      <p>Login</p>
        <Link to={"/"}>Home</Link>
        <br />
        <Link to={"/register"}>Register</Link>
    </div>
  )
}

export default Login