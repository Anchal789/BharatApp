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
import BannerAd from "../../components/AdSense/BannerAd";
import { Helmet } from "react-helmet";

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
    <>
      <Helmet>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4197896435460491"
          crossorigin="anonymous"
        ></script>
      </Helmet>
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
                if (hasSubmissionsToday) {
                  return todaysSubmissions.map((sub, subIndex) => (
                    <div
                      key={`${index}-${subIndex}`}
                      className="admin-submission-card"
                    >
                      <div className="card-details-name">
                        <h4>{sub.customerInfo?.customerInfo?.consumerName}</h4>
                      </div>
                      <div className="image-gallery-container">
                        <ImageGallery
                          phone={obj.phone.phone}
                          lpgID={sub.customerInfo?.customerInfo?.lpgID}
                        />
                      </div>
                      <div className="card-details">
                        <p>{sub.timeDate?.timeDate?.date} </p>
                        <p>{sub.timeDate?.timeDate?.time}</p>
                      </div>
                      <div className="card-details">
                        <p>LPG ID</p>
                        <p>{sub.customerInfo?.customerInfo?.lpgID}</p>
                      </div>

                      <div className="card-details">
                        <p>City</p>
                        <p>{sub.customerInfo?.customerInfo?.consumerCity}</p>
                      </div>
                      <div className="card-details">
                        <p>Mobile</p>
                        <a
                          href={`tel:+91${sub.customerInfo?.customerInfo?.consumerMobile}`}
                        >
                          {sub.customerInfo?.customerInfo?.consumerMobile}
                        </a>
                      </div>
                      <div className="postedBY">
                        <p>{obj.userName.name}</p>
                      </div>
                    </div>
                  ));
                }
              }
              return null;
            })}
            {/* Render "No Submissions for Today" card only if no submissions for today */}
            {submission.every(
              (obj) =>
                !Object.values(obj.mySubmission || {}).some(
                  (sub) => sub.timeDate?.timeDate?.date === currentDate
                )
            ) && (
              <div className="admin-submission-empty-card">
                <h2>No Submissions for Today</h2>
                <img
                  className="nothingHereAnimation"
                  src={NothingHereAnimation}
                  alt="Nothing Is Here."
                />
              </div>
            )}
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
        <BannerAd />
      </div>
    </>
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
          `userFiles/${phone}/mySubmission/${lpgID}/`
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
  }, [phone, storage, lpgID]);

  return (
    <>
      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt={`${index}`} />
      ))}
    </>
  );
};

export default AdminPage;
