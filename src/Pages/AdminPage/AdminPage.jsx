import React, { useState, useEffect } from "react";
import { app } from "../../assets/firebase";
import { Link } from "react-router-dom";
import { child, get, getDatabase, ref } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref as sref,
} from "firebase/storage";
import NothingHereAnimation from "../../assets/nothing here animation.gif";
import "./AdminPage.css";
import Avatar from "../../assets/user avatar.png";

const AdminPage = () => {
  const [submission, setSubmission] = useState([]);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState("Today");
  const database = getDatabase(app);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const date = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${date}`;
    setCurrentDate(formattedDate);
  }, []);

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
  }, [selectedOption, database]);

  return (
    <div className="admin-page-container">
      {error}
      <select
        value={selectedOption}
        onChange={(e) => {
          setSelectedOption(e.target.value);
        }}
        className="select"
      >
        <option value="Today">Today</option>
        <option value="By Delivery Man">By Delivery Man</option>
      </select>
      {selectedOption === "Today" ? (
        <div className="today-submissions-container">
          {submission.map((obj, index) => {
            if (!obj.admin) {
              const todaysSubmissions = Object.values(
                obj.mySubmission || {}
              ).filter(
                (submission) =>
                  submission.timeDate?.timeDate?.date === currentDate
              );
              const hasSubmissionsToday = todaysSubmissions.length > 0;
              return hasSubmissionsToday ? (
                todaysSubmissions.map((sub, subIndex) => (
                  <div
                    key={`${index}-${subIndex}`}
                    className="admin-submission-card"
                  >
                    <p>Posted By: {obj.userName.name}</p>
                    <p>
                      Posted on: {sub.timeDate?.timeDate?.date} at{" "}
                      {sub.timeDate?.timeDate?.time}
                    </p>
                    <p>LPG ID: {sub.customerInfo?.customerInfo?.lpgID}</p>
                    <p>
                      Consumer Name:{" "}
                      {sub.customerInfo?.customerInfo?.consumerName}
                    </p>
                    <p>
                      Consumer City:{" "}
                      {sub.customerInfo?.customerInfo?.consumerCity}
                    </p>
                    <p>
                      Mobile: {sub.customerInfo?.customerInfo?.consumerMobile}
                    </p>
                    <div className="image-gallery-container">
                      <ImageGallery phone={obj.phone.phone} lpgID={subIndex} />
                    </div>
                  </div>
                ))
              ) : (
                <div key={`${index}`} className="admin-submission-empty-card">
                  {index === 0 && (
                    <>
                      <h2>No Submissions for Today</h2>{" "}
                      <img
                        className="nothingHereAnimation"
                        src={NothingHereAnimation}
                      ></img>
                    </>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
      ) : (
        <div className="byDeliveryMan">
          {submission.map(
            (obj, index) =>
              !obj.admin && (
                <div key={index}>
                  <Link
                    to={{
                      pathname: `/user/${obj.userName.name}`,
                      state: obj,
                    }}
                    state={obj}
                    className="deliverymanName"
                  >
                    <img className="avatar" src={Avatar} alt="" />
                    {obj.userName.name}
                  </Link>
                  <br />
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

const ImageGallery = ({ phone, lpgID }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const storage = getStorage(app);

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const imageRef = sref(
          storage,
          `userFiles/${phone}/mySubmission/${lpgID}`
        );
        const imageList = await listAll(imageRef);
        const urls = await Promise.all(
          imageList.items.map(async (item) => {
            return await getDownloadURL(item);
          })
        );
        setImageUrls(urls);
      } catch (error) {
        console.error("Error fetching image URLs:", error);
        setImageUrls([]);
      }
    };
    fetchImageUrls();
  }, [phone, lpgID, storage]);

  return (
    <div className="image-gallery">
      {" "}
      {/* Apply gallery class */}
      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt={`${index}`} />
      ))}
    </div>
  );
};

export default AdminPage;
