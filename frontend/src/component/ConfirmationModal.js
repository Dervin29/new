import React from 'react';
import "../App.css";

function ConfirmationModal({ show, onClose, onProceed, confirmationData }) {
  const modalStyles = {
    display: show ? 'block' : 'none',
  };

  return (
    <div className="modal-overlay" style={modalStyles}>
      <div className="modal">
        <div className="modal-content">
          <h2 className='heading'>Ticket Confirmation</h2>
          {/* Display confirmation details using the 'confirmationData' prop */}
          {confirmationData && (
            <div>
              <p>Selected date: {confirmationData.selectedDate.toDateString()}</p>
              <p>Source: {confirmationData.source}</p>
              <p>Destination: {confirmationData.destination}</p>
              <p>Train ID: {confirmationData.selectedTrain.id}</p>
              <p>Name of the Train: {confirmationData.selectedTrain.name}</p>
              <p>Departure Time: {confirmationData.selectedTrain.departure_time}</p>
              <p>Arrival Time: {confirmationData.selectedTrain.arrival_time}</p>
              <p>Selected Class: {confirmationData.selectedClass}</p>
              <p>Number of Passengers: {confirmationData.numPassengers}</p>
            </div>
          )}

          {/* Display passenger details in a table */}
          <h3 className='heading'>Passenger Details:</h3>
          {confirmationData && (
            <table>
              <thead>
                <tr>
                  <th>Passenger</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {confirmationData.passengers.map((passenger, index) => (
                  <tr key={index}>
                    <td>Passenger {index + 1}</td>
                    <td>{passenger.name}</td>
                    <td>{passenger.age}</td>
                    <td>{passenger.gender}</td>
                    <td>{passenger.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="modal-buttons">
            <button onClick={onProceed}>Proceed to Payment</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
