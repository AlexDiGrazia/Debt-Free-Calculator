import { render } from "@testing-library/react";
import React from "react";

class PaymentHistory extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { history } = this.props;

    return (
      <div id="payment-log" className="payment-history">
        <div className="payment-history-header">
          <h3>Payment</h3>
          <h3>Applied to Principal</h3>
          <h3>New Balance</h3>
        </div>
        {history.map((paymentObject, index) => (
          <div className="payment-entry" key={index}>
            <div>${paymentObject.payment}</div>
            <div>${paymentObject.applied}</div>
            <div>${paymentObject.balance}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default PaymentHistory;
