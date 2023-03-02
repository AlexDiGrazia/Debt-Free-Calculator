import { render } from '@testing-library/react';
import React from 'react';

class PaymentHistory extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div id="payment-log" className="payment-history">
        <div class="payment-history-header">
          <h3>Payment</h3>
          <h3>Applied to Principal</h3>
          <h3>New Balance</h3>
        </div>
      </div>
    )
  }
}

export default PaymentHistory