import { getElementError } from "@testing-library/react";
import React from "react";
import PaymentHistory from "./PaymentHistory";

class Form extends React.Component {
  constructor() {
    super();
    this.state = {
      principal: 0,
      interest: 0,
      amount: 0,
      isButtonDisabled: true,
      remainingPayments: 0,
      paymentHistory: [],
    };
    this.count = 0;
  }

  handleChange = (e, value) => {
    if (value === "principal") {
      this.handlePrincipal(e, value);
    } else if (value === "interest") {
      this.handleInterest(e, value);
    } else if (value === "amount") {
      this.handleAmount(e, value);
    }
  };

  handlePrincipal = (e, value) => {
    this.principal = +e.target.value;
    this.principalEvent = +e.target;
    this.setState({ [value]: +e.target.value });
  }

  handleInterest = (e, value) => {
    this.setState({ [value]: this.getPercentage(+e.target.value) });
    this.minimumPayment = this.updateMinimumPayment(e);
    this.interestEvent = e;
  }

  handleAmount = (e, value) => {
    this.payment = +e.target.value;
    this.onePercentMinCheck(e);
    this.setState({ [value]: +e.target.value });
    this.amountEvent = e;
    this.principal = this.state.principal;
    if (this.state.remainingPayments === 1) {
      this.count = 1;
    } else {
      this.setState({ remainingPayments: 0 });
      this.count = 0;
    }
  }

  onePercentMinCheck = (e) => {
    const { principal, interest } = this.state;
    if (principal <= 100) {
      this.enableFinalPayment(e);
    } else {
      +e.target.value >= principal * 0.01 + principal * interest &&
      +e.target.value <= principal + principal * interest
        ? this.setState({ isButtonDisabled: false })
        : this.setState({ isButtonDisabled: true });
    }
  };

  enableFinalPayment = (e) => {
    const { principal } = this.state;
    +e.target.value >= principal + principal * 0.01
      ? this.setState({ isButtonDisabled: false })
      : this.setState({ isButtonDisabled: true });
  };

  getPercentage = (interest) => {
    return interest / 100 / 12;
  };

  updateMinimumPayment = (e) => {
    const { principal, amount, interest } = this.state;
    const remainingBalance = principal - (amount - principal * interest);
    if (remainingBalance <= 100) {
      this.minimumPayment = `$${(
        remainingBalance +
        remainingBalance * 0.01 
      ).toFixed(2)}`;
    } else {
      return (this.minimumPayment = `$${(
        this.state.principal * 0.01 +
        this.state.principal * this.getPercentage(+e.target.value)
      ).toFixed(2)}`);
    }
  };

  buttonFunction = () => {
    this.addNewPaymentToHistory();
    this.updatePrincipal();
    this.checkFinalPayment(this.amountEvent);
    this.setRemainingPaymentsAmount();
    this.updateMinimumPayment(this.interestEvent);
  };

  addNewPaymentToHistory = () => {
    const { principal, amount, interest } = this.state;
    this.setState((prev) => ({
      paymentHistory: [
        ...prev.paymentHistory,
        {
          payment: amount.toFixed(2),
          applied: (amount - principal * interest).toFixed(2),
          balance: (principal - (amount - principal * interest)).toFixed(2),
        },
      ],
    }));
  }

  updatePrincipal = () => {
    const { principal, amount, interest } = this.state;
    this.setState({ principal: principal - (amount - principal * interest) });
  };

  checkFinalPayment = (e) => {
    const { principal, amount, interest } = this.state;
    if (
      principal - (amount - principal * interest) <= 100 &&
      !(
        +e.target.value >
        principal -
          (amount - principal * interest) +
          (principal - (amount - principal * interest)) * 0.01
      )
    ) {
      +e.target.value >= principal + principal * 0.01
        ? this.setState({ isButtonDisabled: false })
        : this.setState({ isButtonDisabled: true });
    }
  };

  setRemainingPaymentsAmount = () => {
    this.state.remainingPayments === 0
      ? this.remaining()
      : this.setState({ remainingPayments: this.state.remainingPayments - 1 });
  };

  remaining = () => {
    const { interest } = this.state;
    let portionOfPaymentAppliedToPrincipal = this.payment - this.principal * interest;
    this.principal = this.principal - portionOfPaymentAppliedToPrincipal;
    if (this.principal <= 100) {
      this.setState({ remainingPayments: this.count + 1 });
    } else {
      this.count++;
      this.remaining();
    }
  };



  handleSubmit = (e) => {
    e.preventDefault();
  };

  render() {
    const inputsArray = [
      {
        id: "total-debt",
        placeholder: "Total debt",
        label: "Initial Amount",
        changeState: "principal",
      },
      {
        id: "interest",
        placeholder: "Interest",
        label: "Interest Rate",
        changeState: "interest",
      },
      {
        id: "make-payment",
        placeholder: "Amount",
        label: "Make a payment",
        divId: "last-input",
        changeState: "amount",
      },
    ];
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="remaining-payments">
            <h3>Payments Remaining</h3>
            <p>{this.state.remainingPayments}</p>
          </div>
          {inputsArray.map((obj, index) => (
            <div key={index} id={obj.divId}>
              <input
                id={obj.id}
                placeholder={obj.placeholder}
                type="number"
                onChange={(e) => this.handleChange(e, obj.changeState)}
              />
              <label htmlFor={obj.id}>{obj.label}</label>
            </div>
          ))}
          <button
            id="submit"
            disabled={this.state.isButtonDisabled}
            onClick={this.buttonFunction}
          >
            Submit
          </button>
          <p id="one-percent">
            Minimum payment required: {this.minimumPayment}
          </p>
          <PaymentHistory history={this.state.paymentHistory} />
        </form>
      </div>
    );
  }
}

export default Form;
