import {getDatabase, ref, set } from "firebase/database";
import React, {useState } from "react";
import { useSelector } from "react-redux";
import { app } from "../../assets/firebase";
import { getStorage, ref as sref, uploadBytes } from "firebase/storage";
import "./DeliveryManUpload.css"

const DeliveryManUpload = () => {
  const [images, setImages] = useState([]);
  // const [imagesToBeUpload, setImagesToBeUpload] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    lpgID: "",
    consumerName: "",
    consumerCity: "",
    consumerMobile: "",
  });
  const [error, setError] = useState("");
  const [uploadingText, setUploadingText] = useState("");
  // const [mySubmissionLength, setMySubmissionLength] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const userName = useSelector((state) => state.auth.profile.user);
  const database = getDatabase(app);
  const imageDb = getStorage(app);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setImages([...images, ...files]);
  };

  // useEffect(() => {
  //   try {
  //     get(
  //       child(
  //         ref(database),
  //         `userProfile/${userName.split("@")[0]}/mySubmission/`
  //       )
  //     ).then((snapShot) => {
  //       try {
  //         setMySubmissionLength(Object.keys(snapShot.val()).length);
  //       } catch (error) {}
  //     });
  //   } catch (error) {}
  // }, [imagesToBeUpload]);

  const handleDeleteImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const customerInfoUpdate = (event) => {
    setCustomerInfo({
      ...customerInfo,
      [event.target.name]: event.target.value,
    });
  };

  const uploadImages = (event) => {
    event.preventDefault();
    if (images.length === 0) {
      setError("Please Upload the image");
      return;
    }
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const timeDate = { time: formattedTime, date: formattedDate };

    let i = 0;
    const newImagesToBeUpload = [];

    const loadImage = async (index) => {
      if (index >= images.length) {
        // setImagesToBeUpload(newImagesToBeUpload); // Update imagesToBeUpload once all images are processed
        set(
          ref(
            database,
            `userProfile/${userName.split("@")[0]}/mySubmission/${
              customerInfo.lpgID
            }/timeDate`
          ),
          {
            timeDate,
          }
        );
        set(
          ref(
            database,
            `userProfile/${
              userName.split("@")[0]
            }/mySubmission/${customerInfo.lpgID}/customerInfo`
          ),
          {
            customerInfo,
          }
        );

        for (let i = 0; i < images.length; i++) {
          const imgRef = sref(
            imageDb,
            `userFiles/${userName.split("@")[0]}/mySubmission/${
              customerInfo.lpgID
            }/${images[i].name}`
          );
          const result = await uploadBytes(imgRef, images[i])
            .then(() => {
              setUploadingText("Upload... Please Wait");
            })
            .catch((error) => {
              setUploadingText(error);
            })
            .finally(() => {
              setUploadingText("");
            });
        }
        setImages([]);
        setUploadSuccess(true);
        return;
      }

      const seletedFile = images[index];
      if (seletedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImagesToBeUpload.push(e.target.result); // Add the loaded image to the array
          loadImage(index + 1); // Load the next image
        };
        reader.readAsDataURL(seletedFile);
      } else {
        loadImage(index + 1); // Load the next image if current image is not available
      }
    };

    loadImage(i); // Start loading images
    setError("");
    setCustomerInfo({
      lpgID: "",
      consumerName: "",
      consumerCity: "",
      consumerMobile: "",
    });
  };

  return (
    <div className="deliveryman-upload-container-upload">
      <form className="upload-form-upload">
        <label className="form-label-upload" htmlFor="lpgID">
          LPG ID
        </label>
        <input
          className="form-input-upload"
          type="number"
          value={customerInfo.lpgID}
          id="lpgID"
          name="lpgID"
          onChange={customerInfoUpdate}
          required
        />
        <br />
        <label className="form-label-upload" htmlFor="consumerName">
          Consumer Name
        </label>
        <input
          className="form-input-upload"
          type="text"
          value={customerInfo.consumerName}
          id="consumerName"
          name="consumerName"
          required
          onChange={customerInfoUpdate}
        />
        <br />
        <label className="form-label-upload" htmlFor="consumerCity">
          Consumer City
        </label>
        <input
          className="form-input-upload"
          type="text"
          value={customerInfo.consumerCity}
          id="consumerCity"
          name="consumerCity"
          onChange={customerInfoUpdate}
          required
        />
        <br />
        <label className="form-label-upload" htmlFor="consumerMobile">
          Consumer Mobile
        </label>
        <input
          className="form-input-upload"
          type="number"
          value={customerInfo.consumerMobile}
          id="consumerMobile"
          name="consumerMobile"
          onChange={customerInfoUpdate}
          required
        />
        <br />
      </form>
      <input
        className="file-input-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        required
      />
      <p className="error-msg-upload">{error}</p>
      <div className="image-preview-container-upload">
        {images.map((image, index) => (
          <div className="image-preview-upload" key={index}>
            <img
              className="preview-img-upload"
              src={URL.createObjectURL(image)}
              alt={`pic-${index}`}
            />
            <button
              className="delete-btn-upload"
              onClick={() => handleDeleteImage(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button className="upload-btn-upload" onClick={uploadImages} type="submit">
        Upload
      </button>
      <p className="uploading-text-upload">{uploadingText}</p>
      {uploadSuccess && <p className="success-msg-upload">Uploaded Successfully</p>}
    </div>
  );
};

export default DeliveryManUpload;
