import React from "react";
import { MarketOptiontype, MarketType } from "../../types";
import MinusLogo from "../../assets/Minus.svg";

type Props = {
  surveyData: MarketType[];
  setSurveyData: React.Dispatch<React.SetStateAction<[] | MarketType[]>>;
  cartData: MarketType[] | [];
  setCartData: React.Dispatch<React.SetStateAction<[] | MarketType[]>>;
  market: MarketType;
  marketIndex: number;
};

const SidebarData: React.FC<Props> = ({
  surveyData,
  setSurveyData,
  cartData,
  setCartData,
  market,
  marketIndex,
}) => {
  const removeShares = (option: MarketOptiontype, optionIndex: number) => {
    const surveyDataIndex = surveyData.findIndex(
      (mrkt) => mrkt.id === market.id
    );
    const surveyDataOptionIndex = surveyData[surveyDataIndex].options.findIndex(
      (opt) => opt.id === option.id
    );

    const mainData = surveyData;
    const mainMarketData = mainData[surveyDataIndex];
    const marketOptionsData = mainData[surveyDataIndex].options;
    const marketOption =
      mainData[surveyDataIndex].options[surveyDataOptionIndex];

    const newMarketOption: MarketOptiontype = {
      ...marketOption,
      quantity: marketOption.quantity - 1,
      total: marketOption.price * (marketOption.quantity - 1),
    };

    marketOptionsData.splice(surveyDataOptionIndex, 1, newMarketOption);

    const gZero = marketOptionsData.filter((opt) => opt.quantity !== 0);
    const gZeroTotal = gZero.map((opt) => opt.total);

    const newMainMarketData = {
      ...mainMarketData,
      options: marketOptionsData,
      subtotal: gZeroTotal.reduce((p, c) => p + c, 0),
    };

    mainData.splice(surveyDataIndex, 1, newMainMarketData);

    setSurveyData([...mainData]);

    // Cart Section

    const cartMarketIndex = cartData.findIndex((mrkt) => mrkt.id === market.id);
    const cartMarketOptionIndex = cartData[cartMarketIndex].options.findIndex(
      (opt) => opt.id === option.id
    );

    const mainCartData = cartData;
    const mainCartMarketData = cartData[cartMarketIndex];
    const mainCartOptionsData = cartData[cartMarketIndex].options;
    const mainCartOption =
      cartData[cartMarketIndex].options[cartMarketOptionIndex];

    const newMainOption = {
      ...mainCartOption,
      quantity: mainCartOption.quantity - 1,
      total: mainCartOption.price * (mainCartOption.quantity - 1),
    };

    mainCartOptionsData.splice(cartMarketOptionIndex, 1, newMainOption);

    const updatedOptArr = mainCartOptionsData.filter((opt) => opt.quantity > 0);

    const gZeroCartTotal = updatedOptArr.map((opt) => opt.total);

    const newMainCartMarketData = {
      ...mainCartMarketData,
      options: updatedOptArr,
      subtotal: gZeroCartTotal.reduce((p, c) => p + c, 0),
    };

    mainCartData.splice(cartMarketIndex, 1, newMainCartMarketData);

    const filteredMainCart = mainCartData.filter(
      (mrkt) => mrkt.options.length !== 0
    );

    setCartData([...filteredMainCart]);
  };

  return (
    <>
      <div className="survey_sidebar_data">
        <div className="sidebar_data_QA">
          <div className="sidebar_data_question">{market.question}</div>
          <div className="sidebar_data_options">
            {market.options.map((option, optionIndex) => (
              <div className="sidebarData_option" key={option.id}>
                <div className="sidebarData_optionUp">
                  <div className="sidebarData_optionUp_left">
                    ${option.price.toFixed(2)}
                    <span style={{ fontFamily: "Segoe UI Regular" }}>
                      /share
                    </span>
                  </div>
                  <div className="sidebarData_optionUp_right">
                    Purchased: <span>{option.quantity}</span> Subtotal:{" "}
                    <span>${option.total.toFixed(2)}</span>{" "}
                  </div>
                </div>
                <div className="sidebarData_optionDown">
                  <div className="sidebarData_optionDown_text">
                    {option.name}
                  </div>
                  <div
                    className="sidebarData_optionDown_button"
                    onClick={() => removeShares(option, optionIndex)}
                  >
                    <img src={MinusLogo} alt="Minus Logo" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sidebar_data_subtotal">
          <p
            className="text-uppercase"
            style={{ color: "#727272", fontSize: "12px" }}
          >
            sub total :{" "}
          </p>
          <p style={{ color: "#293072", fontSize: "14px", fontWeight: "bold" }}>
            ${market.subtotal?.toFixed(2)}
          </p>
        </div>
      </div>
    </>
  );
};

export default SidebarData;
