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
    setLoading(true);
    try {
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
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
    } finally {
      setApiCalled(true);
    }
  }, [ imageDb]);

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
        My Submission
      </button>
      {showSubmission && (
        <div className="submission-details">
          {loading && <p>Loading submissions...</p>}
          {error && <p className="error-message">{error.messages}</p>}
          {!loading && !error && mySubmission === null && (
            <p className="no-submissions-message">
              No submissions found. Please upload your submissions.
            </p>
          )}
          {!loading &&
            mySubmission !== null &&
            mySubmission.length > 0 &&
            Object.values(mySubmission)?.map((obj, index) => (
              <div key={index} className="submission-card">
                <p className="submission-info">
                  Posted On : {obj.details?.timeDate?.timeDate?.date} at{" "}
                  {obj.details?.timeDate?.timeDate?.time}
                </p>
                <p className="submission-info">
                  LPG ID : {obj.details?.customerInfo?.customerInfo?.lpgID}
                </p>
                <p className="submission-info">
                  Customer Name :{" "}
                  {obj.details?.customerInfo?.customerInfo?.consumerName}
                </p>
                <p className="submission-info">
                  Customer City :{" "}
                  {obj.details?.customerInfo?.customerInfo?.consumerCity}
                </p>
                <p className="submission-info">
                  Mobile :{" "}
                  {obj.details?.customerInfo?.customerInfo?.consumerMobile}
                </p>
                <div className="submission-images">
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
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryManSubmission;
