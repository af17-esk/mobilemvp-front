import React from "react";
import Thumb from "../assets/Thumb.svg";

const Successful = () => {
  return (
    <div className="successful">
      <div className='successful_img'>
        <img src={Thumb} alt="Thumb Icon" />
      </div>
      <h3>Thank You</h3>
      <p>Thank you for sharing your thoughts! We appreciate your feedback.</p>
    </div>
  );
};

export default Successful;
