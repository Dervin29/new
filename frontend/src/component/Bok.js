import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmationModal from './ConfirmationModal';
import PaymentPage from './PaymentPage'; 
import "../App.css";

function App() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [numPassengers, setNumPassengers] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [passengers, setPassengers] = useState(
    Array.from({ length: numPassengers }, () => ({}))
  );
  const [selectedClass, setSelectedClass] = useState('sleeper');

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPaymentPage, setShowPaymentPage] = useState(false); 
  const [confirmationData, setConfirmationData] = useState(null);

  const fetchTrains = async () => {
    try {
      const baseURL = 'http://localhost:3001';
      const response = await axios.get(
        `${baseURL}/trains?source=${source}&destination=${destination}`
      );
      setTrains(response.data);
    } catch (error) {
      console.error('Error fetching trains:', error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];

    if (!updatedPassengers[index]) {
      updatedPassengers[index] = {};
    }

    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    
    const dataToConfirm = {
      selectedDate,
      source,
      destination,
      selectedTrain,
      numPassengers,
      selectedClass,
      passengers,
    };

    setConfirmationData(dataToConfirm);
    setShowConfirmationModal(true);
  };

  const resetBookingForm = () => {
    setSource('');
    setDestination('');
    setTrains([]);
    setSelectedTrain(null);
    setNumPassengers(1);
    setSelectedDate(new Date());
    setPassengers(Array.from({ length: numPassengers }, () => ({})));
    setSelectedClass('sleeper');
  };

  return (
    <div className="main_container">
      {showPaymentPage ? (
        <PaymentPage
          selectedClass={selectedClass}
          numPassengers={numPassengers}
          onBackToBooking={() => {
            resetBookingForm();
            setShowPaymentPage(false);
          }}
          onPayment={() => {
            alert('Payment successful');
          }}
          confirmationData={confirmationData}
        />
      ) : (
        <>
          <div className="train_details">
            <h1 className='heading'>Train Details</h1>
            <div className="source_destination">
              <input
                type="text"
                placeholder="Source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MM/dd/yyyy"
                isClearable
                placeholderText="Select a date"
              />
              <button onClick={fetchTrains}>Search</button>
            </div>
            {selectedTrain ? (
              <div className="selected_train">
                <h2>Selected Train Details</h2>
                {selectedDate && (
                  <p>Selected date: {selectedDate.toDateString()}</p>
                )}
                <p>Source: {source}</p>
                <p>Destination: {destination}</p>
                <p>Train ID: {selectedTrain.id}</p>
                <p>Name: {selectedTrain.name}</p>
                <p>Departure @ {source}: {selectedTrain.departure_time}</p>
                <p>Arrival @ {destination}: {selectedTrain.arrival_time}</p>
                <p>Seats (Sleeper): {selectedTrain.seats_sleeper}</p>
                <p>Seats (AC): {selectedTrain.seats_ac}</p>
                <p>Seats (General): {selectedTrain.seats_general}</p>

                <label>Select Number of Passengers:</label>
                <select
                  value={numPassengers}
                  onChange={(e) => setNumPassengers(Number(e.target.value))}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>

                <label>Select Class:</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="sleeper">Sleeper</option>
                  <option value="ac">AC</option>
                  <option value="general">General</option>
                </select>

                <form onSubmit={handleBooking}>
                  {Array.from({ length: numPassengers }).map((_, index) => (
                    <div key={index}>
                      <h3>Passenger {index + 1}</h3>
                      <input
                        type="text"
                        placeholder={`Name of Passenger ${index + 1}`}
                        value={passengers[index]?.name || ''}
                        onChange={(e) =>
                          handlePassengerChange(index, 'name', e.target.value)
                        }
                        required
                        maxLength={20}
                      />
                      <input
                        type="number"
                        placeholder={`Age of Passenger ${index + 1}`}
                        value={passengers[index]?.age || ''}
                        onChange={(e) =>
                          handlePassengerChange(index, 'age', e.target.value)
                        }
                        required
                        min={0}
                      />
                      <select
                        value={passengers[index]?.gender || ''}
                        onChange={(e) =>
                          handlePassengerChange(index, 'gender', e.target.value)
                        }
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <input
                        type="text"
                        placeholder={`Address of Passenger ${index + 1}`}
                        value={passengers[index]?.address || ''}
                        onChange={(e) =>
                          handlePassengerChange(index, 'address', e.target.value)
                        }
                        required
                      />
                    </div>
                  ))}

                  <button type="submit">Book Ticket</button>
                  <button onClick={() => setSelectedTrain(null)}>Back to Train Details</button>
                </form>
              </div>
            ) : (
              <div>
                <h2 className='heading'>Train List</h2>
                <ul>
                  {trains.map((train) => (
                    <li key={train.id}>
                      Train ID: {train.id}, Name: {train.name}, Departure:{' '}
                      {train.departure_time}
                      <button onClick={() => setSelectedTrain(train)}>
                        Select
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <ConfirmationModal
            show={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
            onProceed={() => {
              setShowConfirmationModal(false);
              setShowPaymentPage(true);
            }}
            confirmationData={confirmationData}
          />
        </>
      )}
    </div>
  );
}

export default App;
