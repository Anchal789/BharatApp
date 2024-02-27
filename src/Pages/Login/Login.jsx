import React, { useEffect, useState } from "react";
import { app } from "../../assets/firebase";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import { child, get, getDatabase, ref } from "firebase/database";
import loadingGif from "../../assets/loading.gif";
import "./Login.css";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [loader, setLoader] = useState(false);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const database = getDatabase(app);

  useEffect(() => {}, []);

  const onChangeHandler = (event) => {
    setPhone(event.target.value);
  };

  const formSubmit = (event) => {
    event.preventDefault();
    setLoader(true);
    get(child(ref(database), `userProfile/${phone}/userName/name`))
      .then((snapShot) => {
        const userName = snapShot.val();
        if (userName && userName.trim() !== "") {
          setUserName(snapShot.val());
          const profile = { phone, userName };
          dispatch(login(profile));
          navigate("/home");
          setLoader(false);
        } else {
          setError("Not a registered User."); // Default error message
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="login-component">
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form action="" className="login-form" onSubmit={formSubmit}>
          <div className="login-form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="number"
              value={phone}
              onChange={onChangeHandler}
              name="phone"
              className="form-input"
              placeholder="Enter Phone Number"
            />
          </div>
          {/* <div className="login-form-group">
            <label className="form-label">Password</label>

            <input
              type="text"
              value={getForm.password}
              onChange={onChangeHandler}
              name="password"
              className="form-input"
            />
          </div> */}

          <button type={"submit"} className="login-button">
            Login
          </button>
        </form>
        {loader && (
          <div className="loader-div">
            <img className="login-loader" src={loadingGif} alt="" />
          </div>
        )}
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
