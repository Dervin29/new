import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PaymentPage({
  selectedClass,
  numPassengers,
  onBackToBooking,
  onPayment,
  confirmationData,
}) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (paymentSuccess) {
      // Make an API call to fetch booking details after payment is successful
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/bookings/${confirmationData.pnrNumber}`);
          if (response.status === 200) {
            setBookingDetails(response.data);
          } else {
            console.error('Failed to fetch booking details.');
          }
        } catch (error) {
          console.error('Error fetching booking details:', error);
        }
      };

      fetchData();
    }
  }, [paymentSuccess, confirmationData.pnrNumber]);

  
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
          {bookingDetails && (
            <>
              <h2>Booking Details</h2>
              {/* Display booking details here */}
              <p>PNR Number: {bookingDetails.pnr_number}</p>
              <p>Selected Date: {bookingDetails.selected_date}</p>
              <p>Source: {bookingDetails.source}</p>
              <p>Destination: {bookingDetails.destination}</p>
              <p>Train ID: {bookingDetails.train_id}</p>
              <p>Name of the Train: {bookingDetails.train_name}</p>
              <p>Departure Time: {bookingDetails.departure_time}</p>
              <p>Arrival Time: {bookingDetails.arrival_time}</p>
              <p>Selected Class: {bookingDetails.selected_class}</p>
            </>
          )}
          {bookingDetails && (
            <>
              <h2>Passenger Details</h2>
              {/* Display passenger details here */}
              <table>
                <thead>
                  <tr>
                    <th>Passenger</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Seat Type</th>
                    <th>Seat Number</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingDetails.map((passenger, index) => (
                    <tr key={index}>
                      <td>Passenger {index + 1}</td>
                      <td>{passenger.passenger_name}</td>
                      <td>{passenger.age}</td>
                      <td>{passenger.gender}</td>
                      <td>{passenger.seat_type}</td>
                      <td>{passenger.seat_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
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
