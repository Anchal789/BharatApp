import React, { useState } from "react";
import validator from "validator";
import { app } from "../../assets/firebase";
import { set, ref, getDatabase, get, child } from "firebase/database";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import axios from "axios";

const Register = () => {
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
  });
  const [registeration, setRegisteration] = useState(false);
  const [showImage, setShowImage] = useState("");

  const handleImageChange = (event) => {
    const seletedFile = event.target.files[0];
    if (seletedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(seletedFile);
    }
    console.log(image);
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
          response.data.is_smtp_valid.value &&
          response.data.is_valid_format.value
        ) {
          newErrors.emailError = "Valid Email Address" ;
        } else {
          newErrors.emailError = "Not a Valid Email Address";
        }
      })
      .catch((error) => {
        newErrors.emailError = error;
      });

    if (!validator.isEmail(email)) {
      newErrors.emailError = "Invalid Email";
    } else {
      newErrors.emailError = "";
    }

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

    if (
      newErrors.confirmPasswordError === "" &&
      newErrors.emailError === "" &&
      newErrors.passwordError === ""
    ) {
      setErrors({
        emailError: "",
        passwordError: "",
        confirmPasswordError: "",
      });
      setRegisteration(true);
    } else {
      setErrors(newErrors);
      console.log(newErrors);
    }
  };

  const auth = getAuth(app);

  const formSubmit = (event) => {
    event.preventDefault();
    handleValidation();
    if (registeration) {
      createUserWithEmailAndPassword(auth, email, password);
      console.log(auth);
      // set(ref(database, "profile/"), {
      //   image,
      // });
    }
  };

  const database = getDatabase(app);
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
    <div>
      {/* {image && <img src={showImage.image} alt="Show" />} */}
      {image && <img src={image} alt="Show" />}
      <form action="" onSubmit={formSubmit}>
        <label htmlFor="profileImage">Upload Your Image</label>
        <br />
        <input
          type="file"
          name="Image"
          id="profileImage"
          accept="image/*"
          onChange={handleImageChange}
        />
        <br />
        <br />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          onChange={handleEmailChange}
          value={email}
        />
        <p>{errors.emailError}</p>
        <br />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handlePasswordChange}
          value={password}
        />
        <p>{errors.passwordError}</p>
        <br />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="text"
          name="confirmPassword"
          id="confirmPassword"
          onChange={handleConfirmPasswordChange}
          value={confirmPassword}
        />
        <p>{errors.confirmPasswordError}</p>
        <br />
        <button type="submit">Submit</button>
      </form>
      {/* <button onClick={handleImageUpload}>Upload Image</button> */}
      {/* <button onClick={handleShowImage}>Show Image</button> */}
    </div>
  );
};

export default Register;
