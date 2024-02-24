import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
import { child, get, getDatabase, ref } from "firebase/database";
import { app } from "../../assets/firebase";
import AdminPage from "../AdminPage/AdminPage";
import DeliverymanPage from "../DeliverymanPage/DeliverymanPage";

const Home = () => {
  const user = useSelector((state) => state.auth.profile);
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

    // throw new Error("There is an error");
  }, [authentication, navigate]);

  useEffect(() => {
      get(
        child(ref(database), `userProfile/${user?.user?.split("@")[0]}/admin`)
      ).then((snapShot) => {
        setAdminFlag(snapShot.val());
      });
  },[database, user.user]);

  return (
    <div>
      {
        adminFlag ? <AdminPage></AdminPage> : <DeliverymanPage></DeliverymanPage>
      }
      <img src={user.userImage} alt="" />
    </div>
  );
};

export default Home;
