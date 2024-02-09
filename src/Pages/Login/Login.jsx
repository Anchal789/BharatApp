import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { app } from "../../assets/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(app);
  const formSubmit = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password).then(()=>{alert("this is Working fine"); console.log(auth)}).catch((error)=>{console.log(error)});
  };
  return (
    <div>
      <form action="" onSubmit={formSubmit}>
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <input type="text" value={password} onChange={(event)=>{setPassword(event.target.value)}}/>
        <button type={"submit"}>Submit</button>
      </form>
    </div>
  );
};

export default Login;
