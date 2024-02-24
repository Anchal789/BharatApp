import React, { useMemo, useState } from "react";
import validator from "validator";
import { app } from "../../assets/firebase";
import { set, ref, getDatabase } from "firebase/database";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router";
import { getStorage, uploadBytes, ref as sref } from "firebase/storage";
import { v4 } from "uuid";
import "./Register.css";

const Register = () => {
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
    imageError: "",
  });
  const [registration, setRegistration] = useState(false);
  // const [databaseLength, setDatabaseLength] = useState(0);
  const imageDb = getStorage(app);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const seletedFile = event.target.files[0];
    if (seletedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(seletedFile);
    }
    setImage(event.target.files[0]);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleValidation = () => {
    const newErrors = { ...errors };
    axios
      .get(
        `https://emailvalidation.abstractapi.com/v1/?api_key=fe2e983816134a00b20c27ba4fe80725&email=${email}`
      )
      .then((response) => {
        console.log(response.data);
        if (
          response.data.is_smtp_valid.value === true &&
          response.data.is_valid_format.value === true
        ) {
          newErrors.emailError = "Valid Email Address";
        } else {
          newErrors.emailError = "Not a Valid Email Address";
        }
      })
      .catch((error) => {
        newErrors.emailError = error;
      });

    // if (!validator.isEmail(email)) {
    //   newErrors.emailError = "Invalid Email";
    // } else {
    //   newErrors.emailError = "";
    // }

    if (!validator.isStrongPassword(password)) {
      newErrors.passwordError =
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.";
    } else {
      newErrors.passwordError = "";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPasswordError = "Password doesn't match";
    } else {
      newErrors.confirmPasswordError = "";
    }
    if (image === "") {
      newErrors.imageError = "Please upload the image";
    } else {
      newErrors.imageError = "";
    }

    setErrors(newErrors);
    const noErrors = Object.values(newErrors).every((error) => error === "");
    setRegistration(noErrors);
  };

  const database = getDatabase(app);
  const auth = getAuth(app);

  // get(child(ref(database), `userProfile`)).then((snapShot) => {
  //   setDatabaseLength(Object.keys(snapShot.val()).length);
  // });

  const formSubmit = (event) => {
    event.preventDefault();
    handleValidation();
  };

  const submission = () => {
    if (registration) {
      try {
        createUserWithEmailAndPassword(auth, email, password);
        const userName = email.split("@")[0];
        set(ref(database, `userProfile/${userName}/userName`), {
          name,
        });
        const imgRef = sref(
          imageDb,
          `userFiles/${userName}/userProfileImage/${v4()}`
        );
        uploadBytes(imgRef, image);
        set(ref(database, `userProfile/${userName}/userEmail`), {
          email,
        });
        // navigate("/");
        setErrors({ confirmPasswordError: "Register Successfully!" });
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
            {previewImage && (
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
            )}
          </div>

          <label htmlFor="name"><b>Name</b></label>
          <input
            type="text"
            name="name"
            id="name"
            onChange={(event) => {
              setName(event.target.value);
            }}
            value={name}
          />

          <label htmlFor="email"><b>Email</b></label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleEmailChange}
            value={email}
          />
          {errors.emailError && (
            <p className="error-message">{errors.emailError}</p>
          )}

          <label htmlFor="password"><b>Password</b></label>
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

          <label htmlFor="confirmPassword"><b>Confirm Password</b></label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            onChange={handleConfirmPasswordChange}
            value={confirmPassword}
          />
          {errors.confirmPasswordError && (
            <p className="error-message">{errors.confirmPasswordError}</p>
          )}

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
