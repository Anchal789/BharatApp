import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import "./Navbar.css";
import { getDownloadURL, getStorage, listAll, ref as sref, } from "firebase/storage";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../assets/firebase";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";;

const Navbar = () => {
  const [imageUrl, setImgUrl] = useState("");
  const imageDb = getStorage(app);
  const authentication = useSelector((state) => state.auth.authentication);
  const dispatch = useDispatch();
  const auth = getAuth(app);
  const [userIn, setUserIn] = useState(authentication);

  useEffect(() => {
    setUserIn(authentication);
  }, [authentication]);

  useEffect(() => {
      const fetchImages = async () => {
        const imageRef = sref(imageDb, "userFiles/a/userProfileImage/");
        const imageList = await listAll(imageRef);
        const urls = await Promise.all(
          imageList.items.map(async (item) => await getDownloadURL(item))
        );
        setImgUrl(urls);
      };
      if(authentication){
        fetchImages();
      }
    }, [authentication]);
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <img src={logo} alt="logo" className="logo" />
        {authentication? <img src={imageUrl} alt="profile Img" className="profile-img" /> : null}
        {userIn && (
        <Link
          className="logout-link"
          onClick={() => {
            dispatch(logout());
            signOut(auth);
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
