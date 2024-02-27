import React, { useMemo, useState } from "react";
import validator from "validator";
import { app } from "../../assets/firebase";
import { set, ref, getDatabase } from "firebase/database";
import { useNavigate } from "react-router";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState("");
  const [registration, setRegistration] = useState(false);
  // const imageDb = getStorage(app);
  const navigate = useNavigate();

  // const handleImageChange = (event) => {
  //   const seletedFile = event.target.files[0];
  //   if (seletedFile) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setPreviewImage(e.target.result);
  //     };
  //     reader.readAsDataURL(seletedFile);
  //   }
  //   setImage(event.target.files[0]);
  // };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };
  // const handlePasswordChange = (event) => {
  //   setPassword(event.target.value);
  // };

  // const handleConfirmPasswordChange = (event) => {
  //   setConfirmPassword(event.target.value);
  // };

  const handleValidation = () => {
    // axios
    //   .get(
    //     `https://emailvalidation.abstractapi.com/v1/?api_key=fe2e983816134a00b20c27ba4fe80725&email=${email}`
    //   )
    //   .then((response) => {
    //     console.log(response.data);
    //     if (
    //       response.data.is_smtp_valid.value === true &&
    //       response.data.is_valid_format.value === true
    //     ) {
    //       newErrors.emailError = "Valid Email Address";
    //     } else {
    //       newErrors.emailError = "Not a Valid Email Address";
    //     }
    //   })
    //   .catch((error) => {
    //     newErrors.emailError = error;
    //   });

    // if (!validator.isEmail(email)) {
    //   newErrors.emailError = "Invalid Email";
    // } else {
    //   newErrors.emailError = "";
    // }

    // if (4 < password.length < 5) {
    //   newErrors.passwordError =
    //     "Password must be 4 ";
    // } else {
    //   newErrors.passwordError = "";
    // }

    // if (password !== confirmPassword) {
    //   newErrors.confirmPasswordError = "Password doesn't match";
    // } else {
    //   newErrors.confirmPasswordError = "";
    // }
    // if (image === "") {
    //   newErrors.imageError = "Please upload the image";
    // } else {
    //   newErrors.imageError = "";
    // }
    if(!validator.isMobilePhone(phone)){
      setErrors("Invalid Phone Number");
    }
    if(errors === ""){
      setRegistration(true);
    }
    else{
      setRegistration(false)
    }
  };

  const database = getDatabase(app);

  // get(child(ref(database), `userProfile`)).then((snapShot) => {
  //   setDatabaseLength(Object.keys(snapShot.val()).length);
  // });

  const formSubmit = (event) => {
    event.preventDefault();
    handleValidation();
    submission();
  };

  const submission = () => {
    if (registration) {
      try {
        // createUserWithEmailAndPassword(auth, phone, password);
        // const userName = phone;
        set(ref(database, `userProfile/${phone}/userName`), {
          name,
        });
        // const imgRef = sref(
        //   imageDb,
        //   `userFiles/${phone}/userProfileImage/${v4()}`
        // );
        // uploadBytes(imgRef, image);
        set(ref(database, `userProfile/${phone}/phone`), {
          phone,
        });
        setErrors("Register Successfully!");
        navigate("/");
      } catch (error) {}
    } else {
      console.log("");
    }
  };

  const Event = useMemo(() => submission(), [registration]);

  // const handleImageUpload = () => {
  //   set(ref(database, "profile/"), {
  //     image,
  //   });
  // };

  // const handleShowImage = () => {
  //   get(child(ref(database), `profile`)).then((snapShot) => {
  //     setShowImage(snapShot.val());
  //     console.log(snapShot.val());
  //   });
  // };

  return (
    <div className="register-component">
      <div className="register-container">
        <h2>Register</h2>
        <form className="register-form">
          <div className="register-form-group">
            {/* {previewImage && (
              <img src={previewImage} className="previewImage" alt="Show" />
            )}
            <label htmlFor="profileImage" className="profileImage-input-label">
             <b> Upload Your Image</b>
            </label>
            <input
              type="file"
              name="Image"
              className="profileImage-file-input"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
            />
            {errors.imageError && (
              <p className="error-message">{errors.imageError}</p>
            )} */}
          </div>

          <label htmlFor="name">
            <b>Name</b>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            onChange={(event) => {
              setName(event.target.value);
            }}
            value={name}
          />

          <label htmlFor="phone">
            <b>Phone Number</b>
          </label>
          <input
            type="number"
            name="phone"
            id="phone"
            onChange={handlePhoneChange}
            value={phone}
          />
          {errors.phoneError && (
            <p className="error-message">{errors.phoneError}</p>
          )}

          {/* <label htmlFor="password">
            <b>Password</b>
          </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handlePasswordChange}
            value={password}
          />
          {errors.passwordError && (
            <p className="error-message">{errors.passwordError}</p>
          )}

          <label htmlFor="confirmPassword">
            <b>Confirm Password</b>
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            onChange={handleConfirmPasswordChange}
            value={confirmPassword}
          />
          {errors.confirmPasswordError && (
            <p className="error-message">{errors.confirmPasswordError}</p>
          )} */}

          <button type="submit" onClick={formSubmit}>
            <b>Submit</b>
          </button>
        </form>
        <p>Already have an account?</p>
        <button
          onClick={() => {
            navigate("/");
          }}
          id="registerToLoginBtn"
        >
          Login
        </button>
        <h1>{Event}</h1>
      </div>
    </div>
  );
};

export default Register;
