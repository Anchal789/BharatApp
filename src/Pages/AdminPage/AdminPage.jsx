import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../assets/firebase";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { child, get, getDatabase, ref } from "firebase/database";

const AdminPage = () => {
  const [submission, setSubmission] = useState([]);
  const [error, setError] = useState("");
  const database = getDatabase(app);
  const authentication = useSelector((state) => state.auth.authentication);
  const dispatch = useDispatch();
  const auth = getAuth(app);
  const [userIn, setUserIn] = useState(authentication);

  useEffect(() => {
    try {
      get(child(ref(database), `userProfile/`)).then((snapShot) => {
        const submissionsArray = snapShot.val()
          ? Object.values(snapShot.val())
          : [];
        setSubmission(submissionsArray);
      });
    } catch (error) {
      setError(error);
    }
  }, []);

  useEffect(() => {
    setUserIn(authentication);
  }, [authentication]);
  return (
    <div>
      {userIn && (
        <Link
          onClick={() => {
            dispatch(logout());
            signOut(auth);
          }}
          to={"/"}
        >
          Logout
        </Link>
      )}
      <p>Posts</p>
      <div>
        {submission.map((obj, index) => (
         
          (!obj.admin && (
            <div key={index}>
              <Link
                to={{
                  pathname: `/user/${obj.userEmail.email}`,
                  state: obj,
                }}
                state={obj}
              >
                {obj.userName.name}
              </Link>
              <br />
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
