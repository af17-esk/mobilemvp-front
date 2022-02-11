import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { MarketType } from "../../types";

type Props = {
  totalPurchase: number | undefined;
  submitData: () => void;
  cartData: MarketType[] | [];
  buttonLoading: boolean;
  setButtonLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarTotal: React.FC<Props> = ({
  submitData,
  totalPurchase,
  cartData,
  buttonLoading,
  setButtonLoading,
}) => {
  return (
    <div className="sidebar_total">
      <div className="sidebar_total_left">
        <p className="text-uppercase" style={{ fontSize: "14px" }}>
          total :
        </p>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
          ${totalPurchase?.toFixed(2)}
        </p>
      </div>
      <Button
        className="sidebar_total_submit"
        onClick={() => {
          setButtonLoading(true);
          submitData();
        }}
        disabled={cartData.length === 0 || buttonLoading ? true : false}
      >
        {buttonLoading && (
          <Spinner
            size="sm"
            animation="border"
            style={{ marginRight: "10px" }}
          />
        )}
        <span>Submit</span>
      </Button>
    </div>
  );
};

export default SidebarTotal;
