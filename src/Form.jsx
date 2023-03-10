import { getElementError } from "@testing-library/react";
import React from "react";
import PaymentHistory from "./PaymentHistory";

class Form extends React.Component {
  constructor() {
    super();
    this.state = {
      principal: 0,
      interest: 0,
      NumberOfPayments: "",
      Amount: 0,
      isButtonDisabled: true,
      remainingPayments: 0,
    };
    this.count = 0;
    this.AmountEntries = 0;
  }

  handleChange = (e, value) => {
    if (value === "principal") {
      this.principal = e.target.value;
      this.setState({ [value]: +e.target.value });
    } else if (value === "EstMonthlyPayment") {
      this.setState({
        [value]: e.target.value,
        NumberOfPayments: this.calculateNumberOfPayments() + " payments",
      });
    } else if (value === "interest") {
      this.setState({
        [value]: this.getPercentage(+e.target.value),
      });
      this.minimumPayment = this.updateMinimumPayment(e);
      this.interestEvent = e;
    } else if (value === "Amount") {
      this.AmountEntries++;
      this.amount = +e.target.value;
      this.onePercentMinCheck(e);
      this.setState({ [value]: +e.target.value });
      this.amountEvent = e;
      
    } else {
      this.setState({ [value]: +e.target.value });
    }
  };

  enableFinalPayment = (e) => {
    const { principal } = this.state;
    if (principal <= 100) {
      +e.target.value >= principal + (principal * 0.01) + (principal * 0.05)
        ? this.setState({ isButtonDisabled: false })
        : this.setState({ isButtonDisabled: true });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
  };

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

  calculateNumberOfPayments = () => {
    const { principal, EstMonthlyPayment } = this.state;
    return Math.ceil(principal / EstMonthlyPayment);
  };

  remaining = () => {
    const { interest } = this.state;
    let princApplied = this.amount - this.principal * interest;

    this.principal = this.principal - princApplied;
    if (this.principal <= 0) {
      this.setState({ remainingPayments: this.count });
      //    return
    } else {
      this.count++;
      this.remaining();
    }
  };

  getPercentage = (interest) => {
    return interest / 100;
  };

  updateMinimumPayment = (e) => {
    const { principal, Amount, interest } = this.state;
    const lastPayment = principal - (Amount - principal * interest)
    if (lastPayment <= 100 ) {
      this.minimumPayment = `$${(lastPayment + (lastPayment * 0.01) + (lastPayment * 0.05)).toFixed(2)}`;
    } else {
      return (this.minimumPayment = `$${(
        this.state.principal * 0.01 +
        this.state.principal * this.getPercentage(+e.target.value)
      ).toFixed(2)}`);
    }
   
  };

  buttonFunction = () => {
    const { principal, Amount, interest } = this.state;
    const entry = document.createElement("div");
    entry.className = "payment-entry";
    entry.innerHTML = `<div>$${Amount.toFixed(2)}</div>$${(Amount -principal * interest).toFixed(2)}</div><div>$${(principal -(Amount - principal * interest)).toFixed(2)}`;
    document.getElementById("payment-log").appendChild(entry);
    this.updatePrincipal();
    this.state.remainingPayments === 0
      ? this.remaining()
      : this.setState({ remainingPayments: this.state.remainingPayments - 1 });

    this.updateMinimumPayment(this.interestEvent);
    console.log(this.amount)
    console.log(this.state.Amount)
    if (this.amount != this.state.Amount) {
      // this.count = 0;
      console.log('go')
      this.remaining();
    }
  };

  updatePrincipal = () => {
    const { principal, Amount, interest } = this.state;
    this.setState({ principal: principal - (Amount - principal * interest) });
    this.checkFinalPayment(this.amountEvent);
  };

  checkFinalPayment = (e) => {
    const { principal, Amount, interest } = this.state;
    if (
      principal - (Amount - principal * interest) <= 100 
      &&
      !(+e.target.value > (principal - (Amount - principal * interest)) + ((principal - (Amount - principal * interest)) * 0.01))
    ) {
      +e.target.value >= principal + principal * 0.01
        ? this.setState({ isButtonDisabled: false })
        : this.setState({ isButtonDisabled: true });
      }
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
        changeState: "Amount",
      },
    ];
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div class="remaining-payments">
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
          <PaymentHistory />
        </form>
      </div>
    );
  }
}

export default Form;
