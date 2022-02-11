import React from "react";
import { useLocation } from "react-router";
import { MarketType } from "../../types";
import SidebarData from "./SidebarData";
import SidebarHeader from "./SidebarHeader";
import SidebarTotal from "./SidebarTotal";

type Props = {
  totalShares: number | undefined;
  totalPurchase: number | undefined;
  toggleSidebar: boolean;
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  surveyData: MarketType[];
  setSurveyData: React.Dispatch<React.SetStateAction<[] | MarketType[]>>;
  cartData: MarketType[] | [];
  setCartData: React.Dispatch<React.SetStateAction<[] | MarketType[]>>;
  setShowThankyouPage: React.Dispatch<React.SetStateAction<boolean>>;
  submitData: () => void;
  timer: number;
  buttonLoading: boolean;
  setButtonLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const SurveySidebar: React.FC<Props> = ({
  totalShares,
  toggleSidebar,
  setToggleSidebar,
  surveyData,
  setSurveyData,
  cartData,
  setCartData,
  totalPurchase,
  submitData,
  timer,
  buttonLoading,
  setButtonLoading,
}) => {
  const params = new URLSearchParams(useLocation().search);
  const RID = params.get("RID");

  const removeFromCart = () => {
    const local_default = sessionStorage.getItem(`default_data${RID}`);
    if (local_default !== null) {
      setCartData([]);
      setToggleSidebar(!toggleSidebar);
      setSurveyData(JSON.parse(local_default));
    }
  };

  return (
    <div
      className="survey_sidebar"
      style={{ marginRight: !toggleSidebar ? "-500px" : "0" }}
    >
      <SidebarHeader
        totalShares={totalShares}
        toggleSidebar={toggleSidebar}
        setToggleSidebar={setToggleSidebar}
        timer={timer}
      />
      <div className="survey_sidebar_remove">
        <p style={{ fontWeight: 400, fontSize: "12px" }}>
          <em>Tap to remove individual shares</em>
        </p>
        <p
          className="text-uppercase"
          style={{
            color: "#EF514F",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
          }}
          onClick={removeFromCart}
        >
          Remove All
        </p>
      </div>
      {cartData.map((market, marketIndex) => (
        <SidebarData
          key={market.id}
          market={market}
          marketIndex={marketIndex}
          surveyData={surveyData}
          setSurveyData={setSurveyData}
          cartData={cartData}
          setCartData={setCartData}
        />
      ))}
      <SidebarTotal
        totalPurchase={totalPurchase}
        submitData={submitData}
        cartData={cartData}
        setButtonLoading={setButtonLoading}
        buttonLoading={buttonLoading}
      />
    </div>
  );
};

export default SurveySidebar;
