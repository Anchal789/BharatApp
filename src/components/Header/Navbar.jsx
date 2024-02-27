import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import "./Navbar.css";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";;

const Navbar = () => {
  const authentication = useSelector((state) => state.auth.authentication);
  const dispatch = useDispatch();
  const [userIn, setUserIn] = useState(authentication);

  useEffect(() => {
    setUserIn(authentication);
  }, [authentication]);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <img src={logo} alt="logo" className="logo" />
        {userIn && (
        <Link
          className="logout-link"
          onClick={() => {
            dispatch(logout());
          }}
          to={"/"}
        >
          Logout
        </Link>
      )}
      </div>
      
    </nav>
  );
};

export default Navbar;
