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
import {Redirect, Route} from 'react-router-dom'
import {stringify} from "querystring";

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
          question: "In the next 2 years, will at least 50% of medium-large office buildings " +
              "(offices with 100 or more parking spaces for employees) have EV charging stations installed?",
          subtotal: 0,
          options: [
            {
              id: fetchedData.body[0].market1[0].option1.id,
              name: "Yes",
              price: fetchedData.body[0].market1[0].option1.price_1
                ? fetchedData.body[0].market1[0].option1.price_1
                : 0.0,
              quantity: fetchedData.body[0].market1[0].option1.bet_1,
              total: fetchedData.body[0].market1[0].option1.money_bet_1,
            },
            {
              id: fetchedData.body[0].market1[0].option2.id,
              name: "No",
              price: fetchedData.body[0].market1[0].option2.price_2
                ? fetchedData.body[0].market1[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market1[0].option2.bet_2,
              total: fetchedData.body[0].market1[0].option2.money_bet_2,
            }
          ],
        },
        {
          id: fetchedData.body[0].market2[0].id,
          question: "For current, or aspiring, EV owners who do not have access to " +
              "charging at home, which regular valet-service charging option will be more popular by 2025?",
          subtotal: 0,
          options: [
            {
              id: fetchedData.body[0].market2[0].option1.id,
              name: "Higher cost option: Service driver takes car, charges it at a nearby" +
                  " DCFC (DC fast-charging) plaza for around 30 mins to 1 hour, and brings it back to the owner",
              price: fetchedData.body[0].market2[0].option1.price_1
                ? fetchedData.body[0].market2[0].option1.price_1
                : 0.0,
              quantity: fetchedData.body[0].market2[0].option1.bet_1,
              total: fetchedData.body[0].market2[0].option1.money_bet_1,
            },
            {
              id: fetchedData.body[0].market2[0].option2.id,
              name: "Lower cost option: Service driver takes car to their home, " +
                  "charges it overnight, and brings it back the next day",
              price: fetchedData.body[0].market2[0].option2.price_2
                ? fetchedData.body[0].market2[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market2[0].option2.bet_2,
              total: fetchedData.body[0].market2[0].option2.money_bet_2,
            },
          ],
        },
        {
          id: fetchedData.body[0].market3[0].id,
          question: "Imagine there was a service where an electric car owner could pay to have" +
              " a service provider bring a mobile charging station to charge their car for them (e.g., " +
              "while they're shopping or at work). The service provider would meet the owner where they are," +
              " plug in the mobile charger to charge the car, and then leave once the car is" +
              " recharged (approximately 30 minutes). \n" +
              "\n" +
              "At $15 to charge from empty to full, what percentage of US EV owners would use such a service as " +
              "their primary mode of charging their vehicle?",
          subtotal: 0,
          options: [
            {
              id: fetchedData.body[0].market3[0].option1.id,
              name: "0-20%",
              price: fetchedData.body[0].market3[0].option1.price_1
                ? fetchedData.body[0].market3[0].option1.price_1
                : 0.0,
              quantity: fetchedData.body[0].market3[0].option1.bet_1,
              total: fetchedData.body[0].market3[0].option1.money_bet_1,
            },
            {
              id: fetchedData.body[0].market3[0].option2.id,
              name: "21-40%",
              price: fetchedData.body[0].market3[0].option2.price_2
                ? fetchedData.body[0].market3[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market3[0].option2.bet_2,
              total: fetchedData.body[0].market3[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market3[0].option2.id,
              name: "41-60%",
              price: fetchedData.body[0].market3[0].option2.price_2
                ? fetchedData.body[0].market3[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market3[0].option2.bet_2,
              total: fetchedData.body[0].market3[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market3[0].option2.id,
              name: "61-80%",
              price: fetchedData.body[0].market3[0].option2.price_2
                ? fetchedData.body[0].market3[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market3[0].option2.bet_2,
              total: fetchedData.body[0].market3[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market3[0].option2.id,
              name: "81-100%",
              price: fetchedData.body[0].market3[0].option2.price_2
                ? fetchedData.body[0].market3[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market3[0].option2.bet_2,
              total: fetchedData.body[0].market3[0].option2.money_bet_2,
            },
          ],
        },
        {
          id: fetchedData.body[0].market4[0].id,
          question:
            "Picture a valet service that fully charges, parks, cleans, and safekeeps an EV around metropolitan" +
              " areas in the US. Removing the need to own a charging station at home, as well as the time invested in " +
              "charging and parking the vehicle daily. \n" +
          "For the average customer, what would be the price range per service?",
          subtotal: 0,
          options: [
            {
              id: fetchedData.body[0].market4[0].option1.id,
              name: "Less $15",
              price: fetchedData.body[0].market4[0].option1.price_1
                ? fetchedData.body[0].market4[0].option1.price_1
                : 0.0,
              quantity: fetchedData.body[0].market4[0].option1.bet_1,
              total: fetchedData.body[0].market4[0].option1.money_bet_1,
            },
            {
              id: fetchedData.body[0].market4[0].option2.id,
              name: "$16 - $25",
              price: fetchedData.body[0].market4[0].option2.price_2
                ? fetchedData.body[0].market4[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market4[0].option2.bet_2,
              total: fetchedData.body[0].market4[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market4[0].option2.id,
              name: "$26 - $35",
              price: fetchedData.body[0].market4[0].option2.price_2
                ? fetchedData.body[0].market4[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market4[0].option2.bet_2,
              total: fetchedData.body[0].market4[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market4[0].option2.id,
              name: "$36 - $45",
              price: fetchedData.body[0].market4[0].option2.price_2
                ? fetchedData.body[0].market4[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market4[0].option2.bet_2,
              total: fetchedData.body[0].market4[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market4[0].option2.id,
              name: "$46 - $55",
              price: fetchedData.body[0].market4[0].option2.price_2
                ? fetchedData.body[0].market4[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market4[0].option2.bet_2,
              total: fetchedData.body[0].market4[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market4[0].option2.id,
              name: "$56 - $65",
              price: fetchedData.body[0].market4[0].option2.price_2
                ? fetchedData.body[0].market4[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market4[0].option2.bet_2,
              total: fetchedData.body[0].market4[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market4[0].option2.id,
              name: "More than $65",
              price: fetchedData.body[0].market4[0].option2.price_2
                ? fetchedData.body[0].market4[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market4[0].option2.bet_2,
              total: fetchedData.body[0].market4[0].option2.money_bet_2,
            },
          ],
        },
        {
          id: fetchedData.body[0].market5[0].id,
          question:
            "We estimate that 125 million adult Americans regularly drive gas-powered vehicles. If the majority" +
              " of these drivers have convenient access to non-home charging, what percentage will purchase an EV as " +
              "their next vehicle in the next 10 years?",
          subtotal: 0,
          options: [
            {
              id: fetchedData.body[0].market5[0].option1.id,
              name: "1% to 10%",
              price: fetchedData.body[0].market5[0].option1.price_1
                ? fetchedData.body[0].market5[0].option1.price_1
                : 0.0,
              quantity: fetchedData.body[0].market5[0].option1.bet_1,
              total: fetchedData.body[0].market4[0].option1.money_bet_1,
            },
            {
              id: fetchedData.body[0].market5[0].option2.id,
              name: "11% to 20%",
              price: fetchedData.body[0].market5[0].option2.price_2
                ? fetchedData.body[0].market4[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market5[0].option2.bet_2,
              total: fetchedData.body[0].market5[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market5[0].option2.id,
              name: "21% to 30%",
              price: fetchedData.body[0].market5[0].option2.price_2
                ? fetchedData.body[0].market5[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market5[0].option2.bet_2,
              total: fetchedData.body[0].market5[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market5[0].option2.id,
              name: "31% to 40%",
              price: fetchedData.body[0].market5[0].option2.price_2
                ? fetchedData.body[0].market5[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market5[0].option2.bet_2,
              total: fetchedData.body[0].market5[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market5[0].option2.id,
              name: "41% to 50%",
              price: fetchedData.body[0].market5[0].option2.price_2
                ? fetchedData.body[0].market5[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market5[0].option2.bet_2,
              total: fetchedData.body[0].market5[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market5[0].option2.id,
              name: "More than 50% ",
              price: fetchedData.body[0].market5[0].option2.price_2
                ? fetchedData.body[0].market5[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market5[0].option2.bet_2,
              total: fetchedData.body[0].market5[0].option2.money_bet_2,
            },
          ],
        },
        {
          id: fetchedData.body[0].market6[0].id,
          question:
            "Protection plans are increasingly offered with products such as TVs, phones, computers, " +
              "appliances, auto parts, tools, etc. In 2023, what percentage of purchases will the shopper " +
              "also purchase the protection plan if it is offered?",
          subtotal: 0,
          options: [
            {
              id: fetchedData.body[0].market6[0].option1.id,
              name: "Less than 10%",
              price: fetchedData.body[0].market6[0].option1.price_1
                ? fetchedData.body[0].market6[0].option1.price_1
                : 0.0,
              quantity: fetchedData.body[0].market6[0].option1.bet_1,
              total: fetchedData.body[0].market6[0].option1.money_bet_1,
            },
            {
              id: fetchedData.body[0].market6[0].option2.id,
              name: "11% to 20%",
              price: fetchedData.body[0].market6[0].option2.price_2
                ? fetchedData.body[0].market6[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market6[0].option2.bet_2,
              total: fetchedData.body[0].market6[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market6[0].option2.id,
              name: "21% to 30%",
              price: fetchedData.body[0].market6[0].option2.price_2
                ? fetchedData.body[0].market6[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market6[0].option2.bet_2,
              total: fetchedData.body[0].market6[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market6[0].option2.id,
              name: "31% to 40%",
              price: fetchedData.body[0].market6[0].option2.price_2
                ? fetchedData.body[0].market6[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market6[0].option2.bet_2,
              total: fetchedData.body[0].market6[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market6[0].option2.id,
              name: "41% to 50%",
              price: fetchedData.body[0].market6[0].option2.price_2
                ? fetchedData.body[0].market6[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market6[0].option2.bet_2,
              total: fetchedData.body[0].market6[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market6[0].option2.id,
              name: "51% to 60% ",
              price: fetchedData.body[0].market6[0].option2.price_2
                ? fetchedData.body[0].market6[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market6[0].option2.bet_2,
              total: fetchedData.body[0].market6[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market6[0].option2.id,
              name: "61% to 70%",
              price: fetchedData.body[0].market6[0].option2.price_2
                ? fetchedData.body[0].market6[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market6[0].option2.bet_2,
              total: fetchedData.body[0].market6[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market6[0].option2.id,
              name: "71% or more",
              price: fetchedData.body[0].market6[0].option2.price_2
                ? fetchedData.body[0].market6[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market6[0].option2.bet_2,
              total: fetchedData.body[0].market6[0].option2.money_bet_2,
            },
          ],
        },
        {
          id: fetchedData.body[0].market7[0].id,
          question:
            "In the future, when a US consumer purchases a fully autonomous vehicle, who will " +
              "hold the insurance policy for that vehicle?",
          subtotal: 0,
          options: [
            {
              id: fetchedData.body[0].market7[0].option1.id,
              name: "Vehicle buyer",
              price: fetchedData.body[0].market7[0].option1.price_1
                ? fetchedData.body[0].market7[0].option1.price_1
                : 0.0,
              quantity: fetchedData.body[0].market7[0].option1.bet_1,
              total: fetchedData.body[0].market7[0].option1.money_bet_1,
            },
            {
              id: fetchedData.body[0].market7[0].option2.id,
              name: "Vehicle manufacturer",
              price: fetchedData.body[0].market7[0].option2.price_2
                ? fetchedData.body[0].market7[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market7[0].option2.bet_2,
              total: fetchedData.body[0].market7[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market7[0].option2.id,
              name: "Local government",
              price: fetchedData.body[0].market7[0].option2.price_2
                ? fetchedData.body[0].market7[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market7[0].option2.bet_2,
              total: fetchedData.body[0].market7[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market7[0].option2.id,
              name: "Passengers – pay as you go insurance",
              price: fetchedData.body[0].market7[0].option2.price_2
                ? fetchedData.body[0].market7[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market7[0].option2.bet_2,
              total: fetchedData.body[0].market7[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market7[0].option2.id,
              name: "No need for insurance",
              price: fetchedData.body[0].market7[0].option2.price_2
                ? fetchedData.body[0].market7[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market7[0].option2.bet_2,
              total: fetchedData.body[0].market7[0].option2.money_bet_2,
            },
          ],
        },
        {
          id: fetchedData.body[0].market8[0].id,
          question:
            "Imagine a service that delivers home scenting products via mail on a subscription basis. " +
              "Which monthly subscription product will have more sales?",
          subtotal: 0,
          options: [
            {
              id: fetchedData.body[0].market8[0].option1.id,
              name: "Large space diffuser - a device ($125) that scents 1,000 sq ft for $35 / month",
              price: fetchedData.body[0].market8[0].option1.price_1
                ? fetchedData.body[0].market8[0].option1.price_1
                : 0.0,
              quantity: fetchedData.body[0].market8[0].option1.bet_1,
              total: fetchedData.body[0].market8[0].option1.money_bet_1,
            },
            {
              id: fetchedData.body[0].market8[0].option2.id,
              name: "Small space diffuser - a device ($25) that scents 500 sq ft for $15 / month",
              price: fetchedData.body[0].market8[0].option2.price_2
                ? fetchedData.body[0].market8[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market8[0].option2.bet_2,
              total: fetchedData.body[0].market8[0].option2.money_bet_2,
            },
          ],
        },
        {
          id: fetchedData.body[0].market9[0].id,
          question:
            "In February 2022, Tesla disabled it’s “Full Self-Driving” on 53,000 vehicles through a software" +
              " update as part of a NHTSA recall. Will Tesla's 'Full Self-Driving' feature be reinstated " +
              "by March 4th, 2022?",
          subtotal: 0,
          options: [
            {
              id: fetchedData.body[0].market9[0].option1.id,
              name: "Yes",
              price: fetchedData.body[0].market9[0].option1.price_1
                ? fetchedData.body[0].market9[0].option1.price_1
                : 0.0,
              quantity: fetchedData.body[0].market9[0].option1.bet_1,
              total: fetchedData.body[0].market9[0].option1.money_bet_1,
            },
            {
              id: fetchedData.body[0].market9[0].option2.id,
              name: "No",
              price: fetchedData.body[0].market9[0].option2.price_2
                ? fetchedData.body[0].market9[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market9[0].option2.bet_2,
              total: fetchedData.body[0].market9[0].option2.money_bet_2,
            },
          ],
        },
        {
          id: fetchedData.body[0].market10[0].id,
          question:
            "Of employers who provide EV charging stations in office parking lots," +
              " which will be the most common policy in 2022?",
          subtotal: 0,
          options: [
            {
              id: fetchedData.body[0].market10[0].option1.id,
              name: "Free EV charging to employees",
              price: fetchedData.body[0].market10[0].option1.price_1
                ? fetchedData.body[0].market10[0].option1.price_1
                : 0.0,
              quantity: fetchedData.body[0].market10[0].option1.bet_1,
              total: fetchedData.body[0].market10[0].option1.money_bet_1,
            },
            {
              id: fetchedData.body[0].market10[0].option2.id,
              name: "Subsidized EV charging for employees, employees pay a discounted rate",
              price: fetchedData.body[0].market10[0].option2.price_2
                ? fetchedData.body[0].market10[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market10[0].option2.bet_2,
              total: fetchedData.body[0].market10[0].option2.money_bet_2,
            },
            {
              id: fetchedData.body[0].market10[0].option2.id,
              name: "Employees pay full cost of charging",
              price: fetchedData.body[0].market10[0].option2.price_2
                ? fetchedData.body[0].market10[0].option2.price_2
                : 0.0,
              quantity: fetchedData.body[0].market10[0].option2.bet_2,
              total: fetchedData.body[0].market10[0].option2.money_bet_2,
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
            let url = `https://vivint.az1.qualtrics.com/jfe/form/SV_5yWNcj04ZjV7yyG?RID=${RID}`
              window.location.href = url;
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
