import React, { useEffect, useState } from "react";
import SurveyHeader from "./SurveyHeader";
import { Spinner } from "react-bootstrap";
import SurveyData from "./SurveyData";
import SurveySidebar from "./Sidebar/SurveySidebar";
import AlertModal from "./Modal/AlertModal";
import InfoModal from "./Modal/InfoModal";
import Successful from "../components/Successful";
import { useLocation } from "react-router";
import { MarketOptiontype, MarketType } from "../types";
// import { Howl, Howler } from "howler";
import toast from "react-hot-toast";
import axios from "axios";
import AlertSound from "../assets/sounds/Alert.mp3";
import useStickyState from "../hooks/useStickyState";

const Survey = () => {
  const params = new URLSearchParams(useLocation().search);
  const RID = params.get("RID");

  const [localSurveyData, setLocalSurveyData] = useStickyState(
    [],
    `survey_data${RID}`
  );
  const [localCartData] = useStickyState([], `cart_data${RID}`);
  const [localThankYouPage, setLocalThankYouPage] = useStickyState(
    false,
    `thank_you_page${RID}`
  );
  const [localDefaultData] = useStickyState([], `default_data${RID}`);
  const [, setLocalTimer] = useStickyState(0, `timer${RID}`);
  const [localTimerCount, setLocalTimerCount] = useStickyState(
    0,
    `timer_count${RID}`
  );
  const [fetchedData, setFetchedData] = useState<any>([]);
  const [, setDefaultData] = useState<MarketType[] | []>(localDefaultData);
  const [surveyData, setSurveyData] = useState<MarketType[] | []>(
    localSurveyData
  );
  const [cartData, setCartData] = useState<MarketType[] | []>(localCartData);
  const [timer, setTimer] = useState<number>(0);
  const [showThankyouPage, setShowThankyouPage] =
    useState<boolean>(localThankYouPage);
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [showInfoPopup, setShowInfoPopup] = useState<boolean>(false);
  const [showTimerAlert, setShowTimerAlert] = useState<boolean>(false);
  const [infoID, setInfoID] = useState<number>(0);
  const [, setStartTime] = useState<any>();
  const [, setEndTime] = useState<any>();
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  sessionStorage.setItem(`userId${RID}`, RID!);

  useEffect(() => {
    showTimerPopUp();

    if (localSurveyData.length === 0) {
      let formData = new FormData();
      formData.append("rid", RID!);
      fetch(process.env.REACT_APP_START_SURVEY_API!, {
        method: "post",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          sessionStorage.setItem(
            `endtime${RID}`,
            JSON.stringify(
              new Date(data.body[0].time_started).setTime(
                new Date(data.body[0].time_started).getTime() + 600000
              )
            )
          );
          setFetchedData(data);
          setStartTime(new Date(data.body[0].time_started).getTime());
          setEndTime(
            new Date(data.body[0].time_started).setTime(
              new Date(data.body[0].time_started).getTime() + 600000
            )
          );
        })
        .catch((err) => toast.error(err?.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fetchedData.length === 0) {
    } else if (fetchedData.message === "rid is already used") {
      const lsd = sessionStorage.getItem(`survey_data${RID}`);
      lsd !== null && setSurveyData(JSON.parse(localSurveyData));
    } else {
      let fetched_data = [
        {
          id: fetchedData.body[0].market1[0].id,
          question: "Which Kodiak product will sell the most?",
          subtotal: 0,
          options: [
            {
              id: fetchedData.body[0].market1[0].option1.id,
              name: "Bacon, Egg and Cheese Biscuit Protein Breakfast Sandwich",
              price: fetchedData.body[0].market1[0].option1.price_1
                ? fetchedData.body[0].market1[0].option1.price_1
                : 0.0,
              quantity: fetchedData.body[0].market1[0].option1.bet_1,
              total: fetchedData.body[0].market1[0].option1.money_bet_1,
            },
            {
              id: fetchedData.body[0].market1[0].option2.id,
              name: "Kids Chocolate Blueberry Power Waffle",
              price: fetchedData.body[0].market1[0].option2.price_2
                ? fetchedData.body[0].market1[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market1[0].option2.bet_2,
              total: fetchedData.body[0].market1[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market1[0].option3.id,
              name: "High Protein Multi-Purpose Cake Flour",
              price: fetchedData.body[0].market1[0].option3.price_3
                ? fetchedData.body[0].market1[0].option3.price_3
                : 0.0,
              quantity: fetchedData.body[0].market1[0].option3.bet_3,
              total: fetchedData.body[0].market1[0].option3.money_bet_3,
            },
            {
              id: fetchedData.body[0].market1[0].option4.id,
              name: "Protein Power To-Go Bars",
              price: fetchedData.body[0].market1[0].option4.price_4
                ? fetchedData.body[0].market1[0].option4.price_4
                : 0.0,
              quantity: fetchedData.body[0].market1[0].option4.bet_4,
              total: fetchedData.body[0].market1[0].option4.money_bet_4,
            },
          ],
        },
        {
          id: fetchedData.body[0].market2[0].id,
          question: "Who will be the host of Jeopardy! for the next season?",
          subtotal: 0,
          options: [
            {
              id: fetchedData.body[0].market2[0].option1.id,
              name: "Ken Jennings",
              price: fetchedData.body[0].market2[0].option1.price_1
                ? fetchedData.body[0].market2[0].option1.price_1
                : 0.0,
              quantity: fetchedData.body[0].market2[0].option1.bet_1,
              total: fetchedData.body[0].market2[0].option1.money_bet_1,
            },
            {
              id: fetchedData.body[0].market2[0].option2.id,
              name: "LaVar Burton",
              price: fetchedData.body[0].market2[0].option2.price_2
                ? fetchedData.body[0].market2[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market2[0].option2.bet_2,
              total: fetchedData.body[0].market2[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market2[0].option3.id,
              name: "Aaron Rodgers",
              price: fetchedData.body[0].market2[0].option3.price_3
                ? fetchedData.body[0].market2[0].option3.price_3
                : 0.0,
              quantity: fetchedData.body[0].market2[0].option3.bet_3,
              total: fetchedData.body[0].market2[0].option3.money_bet_3,
            },
            {
              id: fetchedData.body[0].market2[0].option4.id,
              name: "Somebody else",
              price: fetchedData.body[0].market2[0].option4.price_4
                ? fetchedData.body[0].market2[0].option4.price_4
                : 0.0,
              quantity: fetchedData.body[0].market2[0].option4.bet_4,
              total: fetchedData.body[0].market2[0].option4.money_bet_4,
            },
          ],
        },
        {
          id: fetchedData.body[0].market3[0].id,
          question: "How many games will BYU’s football team win?",
          subtotal: 0,
          options: [
            {
              id: fetchedData.body[0].market3[0].option1.id,
              name: "6 or fewer",
              price: fetchedData.body[0].market3[0].option1.price_1
                ? fetchedData.body[0].market3[0].option1.price_1
                : 0.0,
              quantity: fetchedData.body[0].market3[0].option1.bet_1,
              total: fetchedData.body[0].market3[0].option1.money_bet_1,
            },
            {
              id: fetchedData.body[0].market3[0].option2.id,
              name: "7",
              price: fetchedData.body[0].market3[0].option2.price_2
                ? fetchedData.body[0].market3[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market3[0].option2.bet_2,
              total: fetchedData.body[0].market3[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market3[0].option3.id,
              name: "8",
              price: fetchedData.body[0].market3[0].option3.price_3
                ? fetchedData.body[0].market3[0].option3.price_3
                : 0.0,
              quantity: fetchedData.body[0].market3[0].option3.bet_3,
              total: fetchedData.body[0].market3[0].option3.money_bet_3,
            },
            {
              id: fetchedData.body[0].market3[0].option4.id,
              name: "9 or more",
              price: fetchedData.body[0].market3[0].option4.price_4
                ? fetchedData.body[0].market3[0].option4.price_4
                : 0.0,
              quantity: fetchedData.body[0].market3[0].option4.bet_4,
              total: fetchedData.body[0].market3[0].option4.money_bet_4,
            },
          ],
        },
        {
          id: fetchedData.body[0].market4[0].id,
          question:
            "Will upcoming James Bond film “No Time To Die” be “Certified Fresh” by Rotten Tomatoes?",
          subtotal: 0,
          options: [
            {
              id: fetchedData.body[0].market4[0].option1.id,
              name: "Yes",
              price: fetchedData.body[0].market4[0].option1.price_1
                ? fetchedData.body[0].market4[0].option1.price_1
                : 0.0,
              quantity: fetchedData.body[0].market4[0].option1.bet_1,
              total: fetchedData.body[0].market4[0].option1.money_bet_1,
            },
            {
              id: fetchedData.body[0].market4[0].option2.id,
              name: "No",
              price: fetchedData.body[0].market4[0].option2.price_2
                ? fetchedData.body[0].market4[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market4[0].option2.bet_2,
              total: fetchedData.body[0].market4[0].option2.money_bet_2,
            },
          ],
        },
      ];

      const shuffle = () => {
        return fetched_data.sort(() => Math.random() - 0.5);
      };

      const shuffled_fetched_data = shuffle();

      setDefaultData(shuffled_fetched_data);
      setSurveyData(shuffled_fetched_data);

      if (shuffled_fetched_data.length > 0) {
        sessionStorage.setItem(
          `default_data${RID}`,
          JSON.stringify(shuffled_fetched_data)
        );
      }
      setLocalSurveyData(JSON.stringify(shuffled_fetched_data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedData, setFetchedData]);

  sessionStorage.setItem(`survey_data${RID}`, JSON.stringify(surveyData));
  sessionStorage.setItem(`userId${RID}`, JSON.stringify(RID));
  sessionStorage.setItem(`cart_data${RID}`, JSON.stringify(cartData));

  let totalPurchase;
  let totalShares;

  // const playNotification = () => {
  //   Howler.volume(1.0);
  //   const sound = new Howl({
  //     src: [AlertSound],
  //     autoplay: true,
  //   });
  //   sound.play();
  // };

  const submitData = () => {
    setToggleSidebar(true);
    const l_cart_data = sessionStorage.getItem(`cart_data${RID}`);

    if (l_cart_data !== null && JSON.parse(l_cart_data).length !== 0) {
      const parse_l_cart_data = JSON.parse(l_cart_data);
      let convertedData = {};
      const marketIDs = parse_l_cart_data.map((market: any) => market.id);
      let marketData = [];

      for (let d in marketIDs) {
        let oneMarketData = surveyData?.find((obj) => obj.id === marketIDs[d]);
        marketData.push(oneMarketData);
      }

      let marketDataOptions = marketData.map((market: any) => market?.options);

      for (let d in marketData) {
        const optId = marketDataOptions[d].map((m: any) => m.id);
        const optBet = marketDataOptions[d].map((m: any) => m.quantity);
        const optPrice = marketDataOptions[d].map((m: any) => m.price);
        let opts: any = [];
        for (let i in optId) {
          opts = [
            ...opts,
            {
              id: optId[i],
              bet: optBet[i],
              price: optPrice[i],
            },
          ];
        }
        let marketName = `market${parseInt(d) + 1}`;
        convertedData = {
          ...convertedData,
          [marketName]: {
            id: marketIDs[d],
            options: opts,
          },
        };
      }

      convertedData = {
        ...convertedData,
        rid: RID,
      };

      axios
        .post(
          process.env.REACT_APP_END_SURVEY_API!,
          JSON.stringify(convertedData),
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res: any) => {
          if (res?.data?.message === "success") {
            setShowThankyouPage(true);
            setLocalThankYouPage(true);
          } else {
            toast.error(res?.data?.message);
          }
          setButtonLoading(false);
        })
        .catch((err) => {
          toast.error(err?.message);
          setButtonLoading(false);
        });
    }
  };

  const showTimerPopUp = () => {
    if (surveyData) {
      const timeLimit = 480;

      let i;
      let count = localTimerCount;
      const timer = setInterval(() => {
        const localEndTime = sessionStorage.getItem(`endtime${RID}`);
        const getLocalEndTime =
          localEndTime !== null && JSON.parse(localEndTime);
        const localThankYou = sessionStorage.getItem(`thank_you_page${RID}`);
        i = parseInt(
          (600 - (getLocalEndTime - new Date().getTime()) / 1000).toString()
        );
        if (
          i === timeLimit &&
          count === 0 &&
          localThankYou !== null &&
          !JSON.parse(localThankYou)
        ) {
          count++;
          setLocalTimerCount(count);
          setShowTimerAlert(true);
          setShowWarning(true);
          // playNotification();
        }
        setTimer(i);
        setLocalTimer(JSON.stringify(i));
      }, 1000);
    }
  };

  const showBalancePopup = () => {
    setShowTimerAlert(false);
    setShowWarning(true);
    // playNotification();
  };

  if (cartData) {
    const optionsData = cartData.map((market) => market.options);
    optionsData.map((option) => option);
    const onlyOpt: MarketOptiontype[] = Array.prototype.concat.apply(
      [],
      optionsData.map((option) => option)
    );
    const subtotalArr = onlyOpt.map((opt) => opt.total);
    const totalSharesArr = onlyOpt.map((opt) => opt.quantity);

    totalPurchase = parseFloat(
      subtotalArr.reduce((p, c) => p + c, 0).toFixed(2)
    );
    totalShares = totalSharesArr.reduce((p, c) => p + c, 0);
  }

  return (
    <>
      {!localThankYouPage && (
        <div
          className="app_background_overlay"
          onClick={() => setToggleSidebar(false)}
          style={{ display: toggleSidebar ? "block" : "none", zIndex: 9 }}
        />
      )}
      <div className="survey">
        {surveyData.length !== 0 ? (
          <>
            <AlertModal
              showWarning={showWarning}
              setShowWarning={setShowWarning}
              type={showTimerAlert ? "time" : "balance"}
              timer={timer}
              toggleSidebar={toggleSidebar}
              setToggleSidebar={setToggleSidebar}
            />
            <InfoModal
              showInfoPopup={showInfoPopup}
              setShowInfoPopup={setShowInfoPopup}
              surveyData={surveyData}
              infoID={infoID}
            />
            {!showThankyouPage ? (
              <>
                <SurveySidebar
                  totalShares={totalShares}
                  totalPurchase={totalPurchase}
                  surveyData={surveyData}
                  setSurveyData={setSurveyData}
                  cartData={cartData}
                  setCartData={setCartData}
                  toggleSidebar={toggleSidebar}
                  setToggleSidebar={setToggleSidebar}
                  setShowThankyouPage={setShowThankyouPage}
                  submitData={submitData}
                  timer={timer}
                  setButtonLoading={setButtonLoading}
                  buttonLoading={buttonLoading}
                />
                <SurveyHeader
                  totalPurchase={totalPurchase}
                  toggleSidebar={toggleSidebar}
                  setToggleSidebar={setToggleSidebar}
                  timer={timer}
                />
                <p
                  className="text-center font-italic my-2"
                  style={{ color: "#727272" }}
                >
                  <em>Tap an option to purchase a share</em>
                </p>
                <SurveyData
                  showBalancePopup={showBalancePopup}
                  totalPurchase={totalPurchase}
                  surveyData={surveyData}
                  setSurveyData={setSurveyData}
                  cartData={cartData}
                  setCartData={setCartData}
                  showInfoPopup={showInfoPopup}
                  setShowInfoPopup={setShowInfoPopup}
                  setInfoID={setInfoID}
                  infoID={infoID}
                />
              </>
            ) : (
              <div
                className="d-flex justify-content-center align-items-center w-100"
                style={{ height: "100vh" }}
              >
                <Successful />
              </div>
            )}
          </>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center w-100"
            style={{ height: "100vh" }}
          >
            <Spinner animation="border" />
          </div>
        )}
      </div>
    </>
  );
};

export default Survey;
