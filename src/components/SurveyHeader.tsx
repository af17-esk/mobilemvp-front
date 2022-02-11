import React from "react";
import { ProgressBar } from "react-bootstrap";
import CartLogo from "../assets/Cart.svg";

type Props = {
  timer: number;
  toggleSidebar: boolean;
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  totalPurchase: number | undefined;
};

const SurveyHeader: React.FC<Props> = ({
  timer,
  totalPurchase,
  toggleSidebar,
  setToggleSidebar,
}) => {
  return (
    <div className="survey_header">
      <div className="survey_header_main">
        <div className="survey_header_left">
          <p>
            Your Balance:{" "}
            <span
              className="survey_header_amount"
              style={{ fontFamily: "Open Sans" }}
            >
              ${totalPurchase ? (10 - totalPurchase).toFixed(2) : 10}
            </span>{" "}
          </p>
        </div>
        <div className="survey_header_logo">
          <img
            src={CartLogo}
            alt="Cart Logo"
            onClick={() => setToggleSidebar(!toggleSidebar)}
          />
        </div>
      </div>
      <ProgressBar
        className="progress_bar"
        variant="info"
        now={(timer * 100) / 600}
        style={{ borderRadius: "0px", height: "5px" }}
      />
    </div>
  );
};

export default SurveyHeader;
