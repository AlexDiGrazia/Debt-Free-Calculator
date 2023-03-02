import { getElementError } from "@testing-library/react";
import React from "react";
import PaymentHistory from "./PaymentHistory";

class Form extends React.Component {
  constructor() {
    super();
    this.state = {
      principal: 0,
      interest: 0,
      // EstMonthlyPayment: 0,
      NumberOfPayments: "",
      Amount: 0,
      isButtonDisabled: true,
      remainingPayments: 0,
    };
    // let { principal, Amount, interest, remainingPayments } = this.state;
    this.count = 0;
  }

  handleChange = (e, value) => {
    if(value === "principal") {
      this.principal = e.target.value;
      this.setState({ [value]: +e.target.value });
    }
    else if (value === "EstMonthlyPayment") {
      this.setState({
        [value]: e.target.value,
        NumberOfPayments: this.calculateNumberOfPayments() + " payments",
      });

    } else if (value === "interest") {
      this.setState({
        [value]: this.getPercentage(+e.target.value),
      });
    } else if (value === "Amount") {
      this.amount = e.target.value;  
      this.onePercentMinCheck(e);
      this.setState({[value]: +e.target.value});
      
    } else {
      this.setState({ [value]: +e.target.value });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
  };

  onePercentMinCheck = (e) => {
    const { principal, interest } = this.state;
      +e.target.value >= principal * 0.01 + principal * interest
      && +e.target.value <= principal + principal * interest
        ? this.setState({ isButtonDisabled: false})
        : this.setState({ isButtonDisabled: true});
  };

  calculateNumberOfPayments = () => {
    const { principal, EstMonthlyPayment } = this.state;
    return Math.ceil(principal / EstMonthlyPayment);
  };

  
  
  remaining = () => {
   const { interest } = this.state;
    let princApplied = this.amount - (this.principal * interest);
   
    this.principal = this.principal - princApplied;
    if (this.principal <= 0) {  
       this.setState({remainingPayments: this.count})
    //    return
    } else {
      this.count++;
      console.log(this.count)
      this.remaining();
    }
  }

  getPercentage = (interest) => {
    return interest / 100;
  };

  updatePrincipal = () => {
    const { principal, Amount, interest } = this.state;
    this.setState({ principal: principal - (Amount - principal * interest)}) 
  }

  buttonFunction = () => {
    const { principal, Amount, interest } = this.state;
    const entry = document.createElement('div');
    entry.className="payment-entry"
    entry.innerHTML = `<div>$${Amount.toFixed(2)}</div>$${(Amount - principal * interest).toFixed(2)}</div><div>$${(principal - (Amount - principal * interest)).toFixed(2)}`;
    document.getElementById('payment-log').appendChild(entry);
    this.updatePrincipal();
    if(this.state.remainingPayments === 0) {
      this.remaining();
    } else {
      this.setState({remainingPayments: this.state.remainingPayments - 1})
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
      // {
      //   id: "est-monthly-payment",
      //   placeholder: "Est. monthly payment",
      //   label: `Debt free in:  ${this.state.NumberOfPayments} `,
      //   changeState: "EstMonthlyPayment",
      // },
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
          <button id="submit" disabled={this.state.isButtonDisabled} onClick={this.buttonFunction}>
            Submit
          </button>
          <p id="one-percent">*required 1% of Principal minimum</p>
          <PaymentHistory />
        </form>
      </div>
    );
  }
}

export default Form;


