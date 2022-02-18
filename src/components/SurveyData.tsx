import React from "react";
import InfoLogo from "../assets/Info1.svg";
import PlusLogo from "../assets/Plus.svg";
import { MarketType } from "../types";

type Props = {
  showBalancePopup: () => void;
  totalPurchase: number | undefined;
  showInfoPopup: boolean;
  setShowInfoPopup: React.Dispatch<React.SetStateAction<boolean>>;
  surveyData: MarketType[];
  setSurveyData: React.Dispatch<React.SetStateAction<[] | MarketType[]>>;
  cartData: MarketType[] | [];
  setCartData: React.Dispatch<React.SetStateAction<[] | MarketType[]>>;
  setInfoID: React.Dispatch<React.SetStateAction<number>>;
  infoID: number;
};

const SurveyData: React.FC<Props> = ({
  showBalancePopup,
  totalPurchase,
  showInfoPopup,
  setShowInfoPopup,
  surveyData,
  setSurveyData,
  cartData,
  setCartData,
  setInfoID,
  infoID,
}) => {
  const addShares = (marketIndex: number, marketOptionIndex: number) => {
    const mainData = surveyData;
    const mainMarketData = mainData[marketIndex];
    const mainDataOptions = mainData[marketIndex].options;
    const mainDataOption = mainData[marketIndex].options[marketOptionIndex];

    const newOption = {
      ...mainDataOption,
      quantity: mainDataOption.quantity + 1,
      total: parseFloat(
        (mainDataOption.price * (mainDataOption.quantity + 1)).toFixed(2)
      ),
    };

    mainDataOptions.splice(marketOptionIndex, 1, newOption);
    const gZeroOption = mainDataOptions.filter((opt) => opt.quantity !== 0);
    const gZeroOptionTotal = gZeroOption.map((opt) => opt.total);

    const newMarketData = {
      ...mainMarketData,
      options: mainDataOptions,
      subtotal: gZeroOptionTotal.reduce((p, c) => p + c, 0),
    };

    mainData.splice(marketIndex, 1, newMarketData);
    setSurveyData([...mainData]);

    // Cart Section
    const cartOptions = mainDataOptions.filter(
      (option) => option.quantity !== 0
    );

    const cartMarketData = {
      ...mainMarketData,
      options: cartOptions,
      subtotal: gZeroOptionTotal.reduce((p, c) => p + c, 0),
    };

    let newCart: MarketType[] | [] = cartData;
    if (cartData === []) {
      newCart = [...cartData, cartMarketData];
    } else {
      const isAlreadyInCart = newCart.find(
        (cartItem) => cartItem.id === mainMarketData.id
      );
      const cartDataIndex = newCart.findIndex(
        (cartItem) => cartItem.id === mainMarketData.id
      );
      if (!!isAlreadyInCart) {
        newCart.splice(cartDataIndex, 1, cartMarketData);
      } else {
        newCart = [...cartData, cartMarketData];
      }
    }

    setCartData([...newCart]);
  };

  return (
    <>
      {surveyData.map((market, marketIndex) => (
        <div className="survey_data" key={market.id}>
          <div className="survey_data_question">
            <h3>{market.question}</h3>
            {/*<img*/}
            {/*  src={InfoLogo}*/}
            {/*  alt="Info Logo"*/}
            {/*  onClick={() => {*/}
            {/*    setShowInfoPopup(!showInfoPopup);*/}
            {/*    setInfoID(JSON.parse(market.id));*/}
            {/*  }}*/}
            {/*  style={{ cursor: "pointer" }}*/}
            {/*/>*/}
          </div>
          <div className="survey_data_options">
            {market.options.map((marketOption, marketOptionIndex) => (
              <div
                key={marketOption.id}
                className="survey_data_option"
                style={{
                  background:
                    marketOption.quantity === 0 ? "#fafafa" : "#F2FCFF",
                }}
              >
                <div className="survey_data_option_up">
                  <div className="survey_data_option_amount">
                    ${marketOption.price.toFixed(2)}
                    <span style={{ fontFamily: "Segoe UI Regular" }}>
                      /share
                    </span>{" "}
                  </div>
                  <div className="survey_data_option_details">
                    <span>
                      Purchased: <span>{marketOption.quantity}</span>
                    </span>
                    <span>
                      Subtotal: <span>${marketOption.total.toFixed(2)}</span>
                    </span>
                  </div>
                </div>
                <div className="survey_data_option_down">
                  <div className="survey_data_option_text">
                    {marketOption.name}
                  </div>
                  <div
                    className="survey_data_option_quantity_button"
                    style={{
                      background:
                        marketOption.quantity === 0 ? "#DADADA" : "#69D3ED",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (totalPurchase) {
                        if (10 - totalPurchase < marketOption.price) {
                          showBalancePopup();
                        } else {
                          addShares(marketIndex, marketOptionIndex);
                        }
                      } else {
                        addShares(marketIndex, marketOptionIndex);
                      }
                    }}
                  >
                    <img
                      src={PlusLogo}
                      alt="Plus Logo"
                      width="14px"
                      height="14px"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default SurveyData;
