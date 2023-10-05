const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "train_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to database");
  }
});

const seatCounts = {
  sleeper: { u: 35, m: 30, l: 35 },
  ac: { u: 35, m: 30, l: 35 },
  general: { u: 35, m: 30, l: 35 },
};

function generatePNRNumber() {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shuffle function to randomize the seat type order
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function allocateUniqueSeatNumbers(
  trainId,
  selectedClass,
  numPassengers
) {
  const seatTypeOrder = ["u", "m", "l"];
  if (!seatCounts[selectedClass][seatTypeOrder[0]]) {
    seatTypeOrder.forEach((type) => {
      seatCounts[selectedClass][type] = 0;
    });
  }

  // Shuffle the seat type order to randomize allocation
  shuffle(seatTypeOrder);

  const availableSeats = {
    u: seatCounts[selectedClass].u,
    m: seatCounts[selectedClass].m,
    l: seatCounts[selectedClass].l,
  };

  const bookedSeats = [];
  const query = `UPDATE trains SET seats_${selectedClass} = seats_${selectedClass} - ? WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.beginTransaction(async (err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        reject("Error starting transaction");
      }

      // Track the count of seats selected for each class
      const seatCount = {
        sleeper: 0,
        ac: 0,
        general: 0,
      };

      for (let i = 0; i < numPassengers; i++) {
        let seatNumber = null;
        let seatType = null;

        for (const type of seatTypeOrder) {
          if (availableSeats[type] > 0) {
            seatType = type;
            seatNumber = availableSeats[seatType];
            break;
          }
        }

        if (!seatNumber || !seatType) {
          db.rollback((rollbackErr) => {
            if (rollbackErr) {
              console.error("Transaction rollback error:", rollbackErr);
            }
            reject("Seats not available");
          });
          return;
        }

        // Prefix seat number based on seat type (u, m, l)
        const modifiedSeatNumber = seatType + seatNumber;
        bookedSeats.push(modifiedSeatNumber);
        availableSeats[seatType]--;
        seatCount[selectedClass]++;

        try {
          await db.query(query, [1, trainId]);
        } catch (error) {
          db.rollback((rollbackErr) => {
            if (rollbackErr) {
              console.error("Transaction rollback error:", rollbackErr);
            }
            reject("Error updating seat count");
          });
          return;
        }
      }

      db.commit((commitErr) => {
        if (commitErr) {
          console.error("Transaction commit error:", commitErr);
          reject("Error committing transaction");
        } else {
          resolve({ bookedSeats, seatCount });
        }
      });
    });
  });
}

// REST API endpoints
app.get("/trains", (req, res) => {
  const { source, destination } = req.query;
  const query = `
    SELECT * FROM trains
    WHERE source = ? AND destination = ?
  `;
  db.query(query, [source, destination], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
    } else {
      res.status(200).json(results);
    }
  });
});

app.post("/bookings", async (req, res) => {
  const {
    trainId,
    selectedClass,
    numPassengers,
    passengers,
    source,
    destination,
  } = req.body;

  // Generate a PNR number
  const pnrNumber = generatePNRNumber();

  // Generate a booking date (format as YYYY-MM-DD)
  const booking_date = new Date().toISOString().split("T")[0];

  // Define the cost per seat for each class
  const costPerSeat = {
    general: 20,
    sleeper: 40,
    ac: 60,
  };

  // Calculate the total cost
  const totalCost = costPerSeat[selectedClass] * numPassengers;

  try {
    const { bookedSeats, seatCount } = await allocateUniqueSeatNumbers(
      trainId,
      selectedClass,
      numPassengers
    );

    if (bookedSeats) {
      db.beginTransaction(async (err) => {
        if (err) {
          console.error("Error starting transaction:", err);
          res.status(500).send("Error starting transaction");
          return;
        }

        for (const seatNumber of bookedSeats) {
          // Insert booking details into the database, including seat count and total cost
          db.query(
            "INSERT INTO bookings (train_id, source, destination, booking_date, seat_count, total_sum, booking_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
              trainId,
              source,
              destination,
              booking_date,
              seatCount[selectedClass],
              totalCost,
              pnrNumber,
            ],
            (err, result) => {
              if (err) {
                console.error("Error inserting booked seat:", err);
                db.rollback((rollbackErr) => {
                  if (rollbackErr) {
                    console.error("Transaction rollback error:", rollbackErr);
                  }
                  res.status(500).send("Error inserting booked seat");
                });
              } else {
                console.log(`Booked seat ${seatNumber} for train ${trainId}`);
              }
            }
          );
        }

        for (let i = 0; i < numPassengers; i++) {
          const passenger = passengers[i];
          const bookedSeat = bookedSeats[i];
          const seatType = bookedSeat[0]; // Get the seat type prefix
          const seatNumber = bookedSeat.substring(1); // Get the seat number without the prefix

          // Insert passenger details into the database, including seat class
          db.query(
            "INSERT INTO passengers (booking_id, name, age, gender, address, seat_type, seat_number, seat_class) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
              pnrNumber,
              passenger.name,
              passenger.age,
              passenger.gender,
              passenger.address,
              seatType,
              seatNumber,
              selectedClass, // Insert the selected class as seat_class
            ],
            (err, result) => {
              if (err) {
                console.error("Error inserting passenger details:", err);
                db.rollback((rollbackErr) => {
                  if (rollbackErr) {
                    console.error("Transaction rollback error:", rollbackErr);
                  }
                  res.status(500).send("Error inserting passenger details");
                });
              } else {
                console.log(`Inserted passenger details for booking ${pnrNumber}`);
              }
            }
          );
        }

        db.commit((commitErr) => {
          if (commitErr) {
            console.error("Transaction commit error:", commitErr);
            res.status(500).send("Error committing transaction");
          } else {
            res.status(200).json({ pnrNumber });
          }
        });
      });
    } else {
      res.status(400).send("Seats not available");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
