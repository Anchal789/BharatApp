import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref as sref,
} from "firebase/storage";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { get, getDatabase, ref } from "firebase/database";
import { app } from "../../assets/firebase";

const DeliveryManPost = ({ props }) => {
  const [submittedImages, setSubmittedImages] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { username } = useParams();
  const location = useLocation();
  const obj = location.state;
  const submissionsArray = obj.mySubmission
    ? Object.values(obj.mySubmission)
    : [];
  const database = getDatabase(app);
  const imageDb = getStorage(app);

  useEffect(() => {
    const fetchImages = async ()=>{

    
    try {
      const submissionRef = ref(
        database,
        `userProfile/${username.split("@")[0]}/mySubmission/`
      );
      const snapshot = await get(submissionRef);
      const submissions = snapshot.val();
      if (submissions) {
        const promises = Object.keys(submissions).map(async (submissionID) => {
          const imageRef = sref(
            imageDb,
            `userFiles/${username.split("@")[0]}/mySubmission/${submissionID}/`
          );
          const imageList = await listAll(imageRef);
          const urls = await Promise.all(
            imageList.items.map(async (item) => await getDownloadURL(item))
          );
          return urls;
        });
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
    }}
    fetchImages()
  }, [database, imageDb, username]);

  return (
    <div>
      <h1>Delivery man post</h1>
      <p>Username: {username}</p>
      {/* <img src={obj.userImage.image} alt="" /> */}
      {/* Display other user details using obj */}
      {/* <pre>{JSON.stringify(submissionsArray, null, 2)}</pre> */}
      {submissionsArray.map((obj, index) => (
        <div key={index}>
          {imagesLoaded? submittedImages[index].map((img) => (
            <img src={img} alt="" />
          )) : "Images Loaded"}
          <p>Posted on : 
            {obj.timeDate?.timeDate?.date} at{" "}
            {obj.timeDate?.timeDate?.time}
          </p>
          <p>LPG ID : {obj?.customerInfo?.customerInfo?.lpgID}</p>
          <p>Consumer Name : {obj?.customerInfo?.customerInfo?.consumerName}</p>
          <p>Consumer City :{obj?.customerInfo?.customerInfo?.consumerCity}</p>
          <p>Mobile : {obj?.customerInfo?.customerInfo?.consumerMobile}</p>
        </div>
      ))}
    </div>
  );
};

export default DeliveryManPost;
