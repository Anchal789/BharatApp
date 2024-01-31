import React from "react";
import logo from "../../logo.svg";
import "./Header.css";

const Header = () => {
  return (
    <nav>
      <div>
        <img src={logo} alt="Logo" />
        <p>PMUY Data</p>
      </div>
        <button onClick={()=>{alert("This is demo website")}}>Click Me</button>
    </nav>
  );
};

export default Header;
