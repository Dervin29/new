import React, { useState } from 'react';
import axios from 'axios';

function PaymentPage({
  selectedClass,
  numPassengers,
  onBackToBooking,
  onPayment,
  confirmationData,
}) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Define the cost per seat for each class
  const costPerSeat = {
    general: 20,
    sleeper: 40,
    ac: 60,
  };

  // Calculate the total cost
  const totalCost = costPerSeat[selectedClass] * numPassengers;

  const handlePayment = async () => {
    // Prepare data to be sent to the server
    const dataToSend = {
      trainId: confirmationData.selectedTrain.id,
      selectedClass,
      numPassengers,
      source: confirmationData.source,
      destination: confirmationData.destination,
      passengers: confirmationData.passengers,
    };
  
    try {
      // Make an API call to your backend to insert data into the database
      const response = await axios.post('http://localhost:3001/bookings', dataToSend);
  
      if (response.status === 200) {
        // Payment successful and data inserted into the database
        setPaymentSuccess(true);
        onPayment(); // You can handle any additional actions for a successful payment
      } else {
        // Handle payment failure or server error
        // You can display an error message or retry payment
        console.error('Payment failed.');
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Payment error:', error);
    }
  };
  
  return (
    <div>
      {paymentSuccess ? (
        <div>
          <h1>Payment Successful!</h1>
          <p>Your booking and passenger details have been successfully recorded.</p>
          {/* You can display a booking summary or additional information here */}
          <button onClick={onBackToBooking}>Back to Booking Form</button>
        </div>
      ) : (
        <div>
          <h1>Payment Page</h1>
          <p>Selected Class: {selectedClass}</p>
          <p>Number of Passengers: {numPassengers}</p>
          <p>Total Amount: Rs. {totalCost}</p>
          <button onClick={handlePayment}>Make Payment</button>
          <button onClick={onBackToBooking}>Back to Booking Form</button>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
