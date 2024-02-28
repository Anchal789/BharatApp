import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
import { child, get, getDatabase, ref } from "firebase/database";
import { app } from "../../assets/firebase";
import AdminPage from "../AdminPage/AdminPage";
import DeliverymanPage from "../DeliverymanPage/DeliverymanPage";

const Home = () => {
  const phone = useSelector((state) => state.auth.profile.phone);
  const authentication = useSelector((state) => state.auth.authentication);
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [adminFlag, setAdminFlag] = useState(false);
  const database = getDatabase(app);

  useEffect(() => {
    let result = authentication
      ? authentication
      : Boolean(sessionStorage.getItem("authentication"));
    if (!result) {
      navigate("/");
    }
    if(result){
      navigate("/home")
    }

    // throw new Error("There is an error");
  }, [authentication, navigate]);

  useEffect(() => {
      get(
        child(ref(database), `userProfile/${phone}/admin`)
      ).then((snapShot) => {
        setAdminFlag(snapShot.val());
      });
  },[database, phone]);

  return (
    <div>
      {
        adminFlag ? <AdminPage></AdminPage> : <DeliverymanPage></DeliverymanPage>
      }
    </div>
  );
};

export default Home;
