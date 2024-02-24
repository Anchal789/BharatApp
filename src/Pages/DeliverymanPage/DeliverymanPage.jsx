import React from "react";
import DeliveryManUpload from "../../components/DeliveryManUpload/DeliveryManUpload";
import DeliveryManSubmission from "../../components/DeliveryManSubmission/DeliveryManSubmission";
import "./DeliverymanPage.css";

const DeliverymanPage = () => {
  return (
    <div className="deliveryman-page">
      <div className="components-container">
        <DeliveryManUpload />
        <DeliveryManSubmission />
      </div>
    </div>
  );
};

export default DeliverymanPage;
