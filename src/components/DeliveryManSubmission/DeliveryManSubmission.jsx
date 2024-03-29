import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { child, get, getDatabase, ref } from "firebase/database";
import { app } from "../../assets/firebase";
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref as sref,
} from "firebase/storage";
import "./DeliveryManSubmission.css";
import loadingGif from "../../assets/loading.gif";

const DeliveryManSubmission = () => {
  const [mySubmission, setMysubmission] = useState([]);
  const [apiCalled, setApiCalled] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);
  const phone = useSelector((state) => state.auth.profile.phone);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const database = getDatabase(app);
  const imageDb = getStorage(app);

  const mySubmittedImages = useCallback(async () => {
    try {
      setLoading(true);
      const submissionRef = ref(database, `userProfile/${phone}/mySubmission/`);
      const snapshot = await get(submissionRef);
      const submissions = snapshot.val();
      if (submissions) {
        const promises = Object.keys(submissions).map(async (submissionID) => {
          const imageRef = sref(
            imageDb,
            `userFiles/${phone}/mySubmission/${submissionID}/`
          );
          const imageList = await listAll(imageRef);
          const urls = await Promise.all(
            imageList.items.map(async (item) => await getDownloadURL(item))
          );
          return { submissionDetails: submissions[submissionID], images: urls };
        });
        Promise.all(promises)
          .then((results) => {
            const submissionData = results.map(
              ({ submissionDetails, images }) => ({
                details: submissionDetails,
                images: images,
              })
            );
            submissionData.sort((a, b) => {
              const dateA = new Date(
                `${a.details?.timeDate?.timeDate?.date} ${a.details?.timeDate?.timeDate?.time}`
              );
              const dateB = new Date(
                `${b.details?.timeDate?.timeDate?.date} ${b.details?.timeDate?.timeDate?.time}`
              );
              return dateB - dateA;
            });
            setMysubmission(submissionData);
          })
          .catch((error) => {
            console.log("Error retrieving images:", error);
            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
          });
        setLoading(false);
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    } finally {
      setLoading(false);
      setApiCalled(true);
    }
  }, [imageDb]);

  useEffect(() => {
    try {
      get(child(ref(database), `userProfile/${phone}/mySubmission/`)).then(
        (snapShot) => {
          setMysubmission(snapShot.val());
        }
      );
    } catch (error) {
      setError(error);
    }
  }, []);

  useEffect(() => {
    if (showSubmission) {
      mySubmittedImages();
    }
  }, [showSubmission, apiCalled]);

  //   const handleSomething = () => {
  //     // console.log(mySubmission);
  //     mySubmission.map((obj, index) => {
  //       for (const imgages of obj.newImagesToBeUpload) {
  //         console.log(imgages);
  //       }
  //     });
  //   };

  return (
    <div className="delivery-man-submission">
      <button
        className="toggle-submission-button"
        onClick={() => {
          setShowSubmission(!showSubmission);
        }}
      >
        {!showSubmission ? "My Submission" : "Close"}
      </button>
      {showSubmission && (
        <div className="submission-details">
          {error && <p className="error-message">{error.messages}</p>}
          {!loading && !error && mySubmission === null && (
            <p className="no-submissions-message">No Post</p>
          )}
          {loading && <img className="loader" src={loadingGif} alt="" />}
          {!loading &&
            mySubmission !== null &&
            mySubmission.length > 0 &&
            Object.values(mySubmission)?.map((obj, index) => (
              <div key={index} className="submission-card">
                <div className="card-details-name postedBY">
                  <p>{obj.details?.customerInfo?.customerInfo?.consumerName}</p>
                </div>
                <div className="card-details">
                  <p>{obj.details?.timeDate?.timeDate?.date}</p>
                  <p>{obj.details?.timeDate?.timeDate?.time}</p>
                </div>
                <div className="image-gallery-container">
                  {obj.images &&
                    obj.images.map((img, index) => (
                      <img
                        key={index}
                        className="submission-image"
                        src={img}
                        alt={`${index}`}
                      />
                    ))}
                </div>
                <div className="card-details">
                  <p>LPG ID</p>
                  <p>{obj.details?.customerInfo?.customerInfo?.lpgID}</p>
                </div>
                <div className="card-details">
                  <p>Customer City</p>
                  <p>{obj.details?.customerInfo?.customerInfo?.consumerCity}</p>
                </div>
                <div className="card-details">
                  <p>Mobile</p>
                  <a href={`tel:+91${obj.details?.customerInfo?.customerInfo?.consumerMobile}`}>
                    {obj.details?.customerInfo?.customerInfo?.consumerMobile}
                  </a>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryManSubmission;
