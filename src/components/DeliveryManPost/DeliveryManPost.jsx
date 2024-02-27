import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref as sref,
} from "firebase/storage";
import { useLocation, useParams} from "react-router-dom";
import { get, getDatabase, ref } from "firebase/database";
import { app } from "../../assets/firebase";
import "./DeliveryManPost.css"

const DeliveryManPost = () => {
  const [submittedImages, setSubmittedImages] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { username } = useParams();
  const location = useLocation();
  const obj = location.state;
  const phone = obj.phone.phone;
  const submissionsArray = obj.mySubmission
    ? Object.values(obj.mySubmission)
    : [];
  const database = getDatabase(app);
  const imageDb = getStorage(app);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const submissionRef = ref(
          database,
          `userProfile/${phone}/mySubmission/`
        );
        const snapshot = await get(submissionRef);
        const submissions = snapshot.val();
        if (submissions) {
          const promises = Object.keys(submissions).map(
            async (submissionID) => {
              const imageRef = sref(
                imageDb,
                `userFiles/${phone}/mySubmission/${submissionID}/`
              );
              const imageList = await listAll(imageRef);
              const urls = await Promise.all(
                imageList.items.map(async (item) => await getDownloadURL(item))
              );
              return urls;
            }
          );
          Promise.all(promises)
            .then((results) => {
              setSubmittedImages(results);
              setImagesLoaded(true);
            })
            .catch((error) => {
              console.log("Error retrieving images:", error);
            });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchImages();
  }, [database, imageDb, phone]);

  return (
    <div className="delivery-man-post-wrapper">
      <h3>{username}</h3>
      {submissionsArray.length === 0 ? (
        <p className="no-submission-message">No Submission by Delivery Man</p>
      ) : (
        submissionsArray.map((obj, index) => (
          <div key={index} className="delivery-man-post-card">
            {imagesLoaded ? (
              submittedImages[index].map((img, imgIndex) => (
                <img key={imgIndex} src={img} alt={`${imgIndex}`} />
              ))
            ) : (
              "Images Loaded"
            )}
            <div className="delivery-man-post-info">
              <p>
                Posted on: {obj.timeDate?.timeDate?.date} at{" "}
                {obj.timeDate?.timeDate?.time}
              </p>
              <p>LPG ID: {obj?.customerInfo?.customerInfo?.lpgID}</p>
              <p>Consumer Name: {obj?.customerInfo?.customerInfo?.consumerName}</p>
              <p>Consumer City: {obj?.customerInfo?.customerInfo?.consumerCity}</p>
              <p>Mobile: {obj?.customerInfo?.customerInfo?.consumerMobile}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DeliveryManPost;
