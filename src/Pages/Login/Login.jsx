import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { app } from "../../assets/firebase";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import { child, get, getDatabase, ref } from "firebase/database";
import "./Login.css";

const Login = () => {
  const [getForm, setForm] = useState({
    email: "",
    password: "",
  });
  const [loader, setLoader] = useState("");
  const [image, setImage] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);
  const database = getDatabase(app);

  useEffect(() => {
   
  }, []);

  const onChangeHandler = (event) => {
    setForm({ ...getForm, [event.target.name]: event.target.value });
  };

  const formSubmit = (event) => {
    event.preventDefault();
    setLoader("Loading...")
    signInWithEmailAndPassword(auth, getForm.email, getForm.password)
      .then((userCredential) => {
        get(
          child(
            ref(database),
            `userProfile/${getForm.email.split("@")[0]}/userImage/image`
          )
        ).then((snapShot) => {
          setImage(snapShot.val());
        });
        get(
          child(
            ref(database),
            `userProfile/${getForm.email.split("@")[0]}/userName/name`
          )
        ).then((snapShot) => {
          setUserName(snapShot.val());
        })
        const user = userCredential.user.email;
        const userImage = image;
        const profile = { user, userImage, userName };
        dispatch(login(profile));
        navigate("/home");
        setLoader("")
      })
      .catch((error) => {
        setLoader("")
        let errorMessage = "Invalid email or password."; // Default error message

        // Check for specific Firebase errors and update errorMessage accordingly
        switch (error.code) {
          case "auth/user-not-found":
            errorMessage = "User not found. Please register first.";
            break;
          case "auth/wrong-password":
            errorMessage = "Invalid password.";
            break;
          case "auth/network-request-failed":
            errorMessage =
              "Network error. Please check your internet connection.";
            break;
          // Add more cases for other Firebase errors if needed
        }
        setError(errorMessage);
      });
  };

  return (
    <div className="login-component">
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form action="" className="login-form" onSubmit={formSubmit}>
          <div className="login-form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              value={getForm.email}
              onChange={onChangeHandler}
              name="email"
              className="form-input"
            />
          </div>
          <div className="login-form-group">
            <label className="form-label">Password</label>

            <input
              type="text"
              value={getForm.password}
              onChange={onChangeHandler}
              name="password"
              className="form-input"
            />
          </div>
          {loader}
          <button type={"submit"} className="login-button">
            Login
          </button>
        </form>
        <p>New User?</p>
        <button
          onClick={() => {
            navigate("/register");
          }}
          className="register-link"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
