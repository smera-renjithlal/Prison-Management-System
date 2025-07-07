require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
   host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Serve static files from root folder
app.use(express.static(__dirname));


// API Route for Registration
app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        db.query(sql, [username, email, hashedPassword, role], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//login
// Login API Route
/*app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Login successful' });
    });
});*/
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Send role along with the success message
        res.status(200).json({ message: 'Login successful', role: user.role });
    });
});


// Enroll a new prisoner (Insert into DB)
app.post("/prisoners/add", (req, res) => {
    const { Name, DOB, Gender, Address, Sentence_Duration } = req.body;  // No Prisoner_ID

    if (!Name || !DOB || !Gender || !Address || !Sentence_Duration) {
        return res.status(400).json({ message: "⚠️ All fields are required!" });
    }

    const sql = `
        INSERT INTO prisoner (Name, DOB, Gender, Address, Sentence_Duration) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [Name, DOB, Gender, Address, Sentence_Duration], (err, result) => {
        if (err) {
            console.error("❌ MySQL Error:", err.sqlMessage);
            return res.status(500).json({ message: "⚠️ Database insertion failed", error: err.sqlMessage });
        }
        res.status(201).json({ message: "✅ Prisoner successfully enrolled!", prisonerId: result.insertId });
    });
});






///wardennn

//search
// Get all prisoner records
// Search prisoner by ID
app.get('/prisoners/search', (req, res) => {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "Prisoner ID is required for search" });

    const sql = "SELECT * FROM prisoner WHERE Prisoner_ID = ?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error searching prisoner:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});

// Fetch all prisoner records (for enrollment display)
app.get('/prisoners/all', (req, res) => {
    const sql = "SELECT * FROM prisoner";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching all prisoners:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});

// Enroll a new prisoner (Insert into DB)
app.post("/prisoners/add", (req, res) => {
    const { Name, DOB, Gender, Address, Sentence_Duration } = req.body;  // No Prisoner_ID

    if (!Name || !DOB || !Gender || !Address || !Sentence_Duration) {
        return res.status(400).json({ message: "⚠️ All fields are required!" });
    }

    const sql = `
        INSERT INTO prisoner (Name, DOB, Gender, Address, Sentence_Duration) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [Name, DOB, Gender, Address, Sentence_Duration], (err, result) => {
        if (err) {
            console.error("❌ MySQL Error:", err.sqlMessage);
            return res.status(500).json({ message: "⚠️ Database insertion failed", error: err.sqlMessage });
        }
        res.status(201).json({ message: "✅ Prisoner successfully enrolled!", prisonerId: result.insertId });
    });
});

// Fetch All Parole Requests
app.get('/parole/all-unapproved', (req, res) => {
    const sql = "SELECT * FROM parole WHERE approve = false";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching parole requests:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});

// Approve Parole Request
app.post('/paroles/approve', (req, res) => {
    const { request_id } = req.body;

    if (!request_id) {
        return res.status(400).json({ message: "⚠️ Request ID is required!" });
    }

    const sql = `
        UPDATE parole
        SET approve = true 
        WHERE request_id = ?
    `;

    db.query(sql, [request_id], (err, result) => {
        if (err) {
            console.error("❌ MySQL Error:", err.sqlMessage);
            return res.status(500).json({ message: "⚠️ Database update failed", error: err.sqlMessage });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "⚠️ Parole request not found!" });
        }

        res.status(200).json({ message: `✅ Parole request ${request_id} approved successfully!` });
    });
});

// Fetch All Visitation Requests
app.get('/visit/all-unapproved', (req, res) => {
    const sql = "SELECT * FROM visit WHERE Status LIKE '%Pending%'";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching parole requests:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});

// Approve Visitation Request
app.post('/visit/approve', (req, res) => {
    const { Vis_ID } = req.body;

    if (!Vis_ID) {
        return res.status(400).json({ message: "⚠️ Visit ID is required!" });
    }

    const sql = `
        UPDATE visit
        SET Status = 'Approved' 
        WHERE Vis_ID = ?
    `;

    db.query(sql, [Vis_ID], (err, result) => {
        if (err) {
            console.error("❌ MySQL Error:", err.sqlMessage);
            return res.status(500).json({ message: "⚠️ Database update failed", error: err.sqlMessage });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "⚠️ Parole request not found!" });
        }

        res.status(200).json({ message: `✅ Visit request ${Vis_ID} approved successfully!` });
    });
});

// Reject Visitation Request
app.post('/visit/reject', (req, res) => {
    const { Vis_ID } = req.body;

    if (!Vis_ID) {
        return res.status(400).json({ message: "⚠️ Visit ID is required!" });
    }

    const sql = `
        UPDATE visit
        SET Status = 'Rejected' 
        WHERE Vis_ID = ?
    `;

    db.query(sql, [Vis_ID], (err, result) => {
        if (err) {
            console.error("❌ MySQL Error:", err.sqlMessage);
            return res.status(500).json({ message: "⚠️ Database update failed", error: err.sqlMessage });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "⚠️ Parole request not found!" });
        }

        res.status(200).json({ message: `✅ Visit request ${Vis_ID} rejected successfully!` });
    });
});














//investigator
//search everything
app.get("/search", (req, res) => {
    const searchQuery = req.query.query;

    const sql = `
        SELECT p.Prisoner_ID, p.Name, p.DOB, p.Gender, p.Address, p.Sentence_Duration, 
               p.Supervisor_ID, s.Name AS Supervisor_Name
        FROM Prisoner p
        LEFT JOIN Staff s ON p.Supervisor_ID = s.Staff_ID
        WHERE p.Name LIKE ?`;

    const crimeSql = `SELECT * FROM Crime WHERE Prisoner_ID IN (SELECT Prisoner_ID FROM Prisoner WHERE Name LIKE ?)`;
    const cellSql = `SELECT * FROM Cell WHERE Prisoner_ID IN (SELECT Prisoner_ID FROM Prisoner WHERE Name LIKE ?)`;
    const rehabSql = `SELECT * FROM Rehabilitation WHERE Prisoner_ID IN (SELECT Prisoner_ID FROM Prisoner WHERE Name LIKE ?)`;
    const paroleSql = `SELECT * FROM Parole WHERE Prisoner_ID IN (SELECT Prisoner_ID FROM Prisoner WHERE Name LIKE ?)`;
    const visitSql = `SELECT * FROM Visit WHERE Prisoner_ID IN (SELECT Prisoner_ID FROM Prisoner WHERE Name LIKE ?)`;

    db.query(sql, [`%${searchQuery}%`], (err, prisoners) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(crimeSql, [`%${searchQuery}%`], (err, crimes) => {
            if (err) return res.status(500).json({ error: err.message });

            db.query(cellSql, [`%${searchQuery}%`], (err, cells) => {
                if (err) return res.status(500).json({ error: err.message });

                db.query(rehabSql, [`%${searchQuery}%`], (err, rehab) => {
                    if (err) return res.status(500).json({ error: err.message });

                    db.query(paroleSql, [`%${searchQuery}%`], (err, parole) => {
                        if (err) return res.status(500).json({ error: err.message });

                        db.query(visitSql, [`%${searchQuery}%`], (err, visits) => {
                            if (err) return res.status(500).json({ error: err.message });

                            res.json({
                                prisoners,
                                crimes,
                                cells,
                                rehabilitation: rehab,
                                parole,
                                visits
                            });
                        });
                    });
                });
            });
        });
    });
});










////user

app.post('/submit-visitation', (req, res) => {
    const { prisoner_id, visitor_name, relationship, contact_no, date } = req.body;

    if (!prisoner_id || !visitor_name || !relationship || !contact_no || !date) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const sql = `INSERT INTO Visit (Prisoner_ID, Visitor_Name, Relationship, Contact_No, Date, Status)
                 VALUES (?, ?, ?, ?, ?, 'Requested')`;

    db.query(sql, [prisoner_id, visitor_name, relationship, contact_no, date], (err, result) => {
        if (err) {
            console.error('Error inserting visitation:', err);
            return res.status(500).json({ message: 'Error submitting visitation request' });
        }
        res.status(200).json({ message: 'Visitation request submitted successfully', success: true });
    });
});

// Parole Submission Route
// Parole Submission Route
app.post('/submit-parole', (req, res) => {
    const { prisoner_id, details } = req.body;

    // Remove 'status' from the query if it's not required
    const sql = `INSERT INTO parole (prisoner_id, details, approve)
                 VALUES (?, ?, false)`;  // Removed 'status' column

    db.query(sql, [prisoner_id, details], (err, result) => {
        if (err) {
            console.error('Error inserting parole: ', err);
            return res.status(500).json({ message: 'Error submitting parole request', success: false, error: err });
        }
        res.status(200).json({ message: 'Parole request submitted successfully', success: true });
    });
});









///admin
// Fetch all prisoner records
// Route to search for a prisoner and related records
// Define the route to get all records

app.get("/adminsearch", (req, res) => {
    const searchQuery = req.query.query;

    const prisonerSql = `SELECT * FROM Prisoner WHERE Name LIKE ?`;
    const crimeSql = `SELECT * FROM Crime WHERE Prisoner_ID IN (SELECT Prisoner_ID FROM Prisoner WHERE Name LIKE ?)`;
    const cellSql = `SELECT * FROM Cell WHERE Prisoner_ID IN (SELECT Prisoner_ID FROM Prisoner WHERE Name LIKE ?)`;
    const rehabSql = `SELECT * FROM Rehabilitation WHERE Prisoner_ID IN (SELECT Prisoner_ID FROM Prisoner WHERE Name LIKE ?)`;
    const paroleSql = `SELECT * FROM Parole WHERE Prisoner_ID IN (SELECT Prisoner_ID FROM Prisoner WHERE Name LIKE ?)`;
    const visitSql = `SELECT * FROM Visit WHERE Prisoner_ID IN (SELECT Prisoner_ID FROM Prisoner WHERE Name LIKE ?)`;

    db.query(prisonerSql, [`%${searchQuery}%`], (err, prisoners) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(crimeSql, [`%${searchQuery}%`], (err, crimes) => {
            if (err) return res.status(500).json({ error: err.message });

            db.query(cellSql, [`%${searchQuery}%`], (err, cells) => {
                if (err) return res.status(500).json({ error: err.message });

                db.query(rehabSql, [`%${searchQuery}%`], (err, rehab) => {
                    if (err) return res.status(500).json({ error: err.message });

                    db.query(paroleSql, [`%${searchQuery}%`], (err, parole) => {
                        if (err) return res.status(500).json({ error: err.message });

                        db.query(visitSql, [`%${searchQuery}%`], (err, visits) => {
                            if (err) return res.status(500).json({ error: err.message });

                            res.json({
                                prisoners,
                                crimes,
                                cells,
                                rehabilitation: rehab,
                                parole,
                                visits
                            });
                        });
                    });
                });
            });
        });
    });
});



app.get('/allrecord', (req, res) => {
    // Queries for all the required records
    const queries = {
        prisoners: 'SELECT * FROM prisoner',
        staff: 'SELECT * FROM staff',
        crimes: 'SELECT * FROM crime',
        cells: 'SELECT * FROM cell',
        rehab: 'SELECT * FROM rehabilitation',
        parole: 'SELECT * FROM parole',
        visits: 'SELECT * FROM visit'
    };

    // Fetch all records in parallel
    Promise.all(Object.values(queries).map(query => new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    })))
    .then(results => {
        // Combine all results into an object
        const [prisoners, staff, crimes, cells, rehab, parole, visits] = results;
        
        // Send all records as JSON
        res.json({
            prisoners,
            staff,
            crimes,
            cells,
            rehab,
            parole,
            visits
        });
    })
    .catch(error => {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: error.message });
    });
});






///edit prisoner
// GET all prisoners
app.get('/prisoners', (req, res) => {
    db.query('SELECT * FROM prisoner', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch prisoner records' });
        }
        res.json(results);
    });
});

// GET a specific prisoner
app.get('/prisoners/:id', (req, res) => {
    const prisonerId = req.params.id;
    db.query('SELECT * FROM prisoner WHERE Prisoner_ID = ?', [prisonerId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Prisoner not found' });
        }
        res.json(results[0]);
    });
});

// PUT - Update a prisoner
app.put('/prisoners/:id', (req, res) => {
    const prisonerId = req.params.id;
    const { name, dob, gender, address, sentenceDuration, supervisorId } = req.body;

    // Ensure no extra comma in the query.
    const query = `
        UPDATE prisoner
        SET 
            Name = ?, 
            DOB = ?, 
            Gender = ?, 
            Address = ?, 
            Sentence_Duration = ?, 
            Supervisor_ID = ?
        WHERE Prisoner_ID = ?`;

    db.query(query, [name, dob, gender, address, sentenceDuration, supervisorId, prisonerId], (err, results) => {
        if (err) {
            console.error('Error during database query:', err);  // Log error for better debugging
            return res.status(500).json({ error: 'Failed to update prisoner record' });
        }
        res.json({ message: 'Prisoner record updated successfully' });
    });
});





// DELETE - Delete a prisoner
app.delete('/prisoners/:id', (req, res) => {
    const prisonerId = req.params.id;
    db.query('DELETE FROM prisoner WHERE Prisoner_ID = ?', [prisonerId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete prisoner record' });
        }
        res.json({ message: 'Prisoner record deleted successfully' });
    });
});

///for cells
app.get('/cells', (req, res) => {
    db.query("SELECT * FROM cell", (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to fetch cells" });
        res.json(results);
    });
});

app.post('/cells', (req, res) => {
    const { block, capacity, prisonerId } = req.body;
    const query = `INSERT INTO cell (Block_ID, Capacity, Prisoner_ID) VALUES (?, ?, ?)`;
    db.query(query, [block, capacity, prisonerId], (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to add cell" });
        res.json({ message: "Cell added successfully", cellId: results.insertId });
    });
});

app.put('/cells/:id', (req, res) => {
    const cellId = req.params.id;
    const { block, capacity, prisonerId } = req.body;

    const query = `UPDATE cell SET Block_ID = ?, Capacity = ?, Prisoner_ID = ? WHERE Cell_ID = ?`;

    db.query(query, [block, capacity, prisonerId, cellId], (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to update cell" });
        res.json({ message: "Cell updated successfully" });
    });
});

app.delete('/cells/:id', (req, res) => {
    const cellId = req.params.id;
    db.query("DELETE FROM cell WHERE Cell_ID = ?", [cellId], (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to delete cell" });
        res.json({ message: "Cell deleted successfully" });
    });
});


///stafff

app.get('/staff', (req, res) => {
    const query = 'SELECT * FROM staff';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch staff records' });
        }
        res.json(results);
    });
});

// Route to get a specific staff member by ID
app.get('/staff/:id', (req, res) => {
    const staffId = req.params.id;
    const query = 'SELECT * FROM staff WHERE Staff_ID = ?';
    db.query(query, [staffId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch staff details' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        res.json(results[0]);
    });
});

// Route to add a new staff member
app.post('/staff', (req, res) => {
    const { name, contact, hireDate, gender, salary, address } = req.body;
    const query = 'INSERT INTO staff (Name, Contact_No, Hire_Date, Gender, Salary, Address) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, contact, hireDate, gender, salary, address], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add new staff member' });
        }
        res.status(201).json({ message: 'Staff member added successfully' });
    });
});

// Route to update a staff member's details
app.put('/staff/:id', (req, res) => {
    const staffId = req.params.id;
    const { name, contact, hireDate, gender, salary, address } = req.body;
    const query = 'UPDATE staff SET Name = ?, Contact_No = ?, Hire_Date = ?, Gender = ?, Salary = ?, Address = ? WHERE Staff_ID = ?';
    db.query(query, [name, contact, hireDate, gender, salary, address, staffId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update staff member' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        res.json({ message: 'Staff member updated successfully' });
    });
});

// Route to delete a staff member
app.delete('/staff/:id', (req, res) => {
    const staffId = req.params.id;
    const query = 'DELETE FROM staff WHERE Staff_ID = ?';
    db.query(query, [staffId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete staff member' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        res.json({ message: 'Staff member deleted successfully' });
    });
});




///crime
// Fetch all crime records
app.get('/crime', (req, res) => {
    const query = 'SELECT * FROM crime';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error', details: err });
            return;
        }
        res.json(results);
    });
});

// Route to get a single crime by Crime_ID
app.get('/crime/:id', (req, res) => {
    const crimeId = req.params.id;
    const query = 'SELECT * FROM crime WHERE Crime_ID = ?';
    db.query(query, [crimeId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error', details: err });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Crime not found' });
            return;
        }
        res.json(results[0]);
    });
});

// Route to add a new crime
app.post('/crime', (req, res) => {
    const { Crime_Type, Description, Date_Committed, Prisoner_ID } = req.body;

    if (!Crime_Type || !Description || !Date_Committed || !Prisoner_ID) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    const query = 'INSERT INTO crime (Crime_Type, Description, Date_Committed, Prisoner_ID) VALUES (?, ?, ?, ?)';
    db.query(query, [Crime_Type, Description, Date_Committed, Prisoner_ID], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to insert crime', details: err });
            return;
        }
        res.status(201).json({ message: 'Crime record added', Crime_ID: results.insertId });
    });
});

// Route to update a crime by Crime_ID
app.put('/crime/:id', (req, res) => {
    const crimeId = req.params.id;
    const { Crime_Type, Description, Date_Committed, Prisoner_ID } = req.body;

    if (!Crime_Type || !Description || !Date_Committed || !Prisoner_ID) {
        res.status(400).json({ error: 'All fields are required for update' });
        return;
    }

    const query = 'UPDATE crime SET Crime_Type = ?, Description = ?, Date_Committed = ?, Prisoner_ID = ? WHERE Crime_ID = ?';
    db.query(query, [Crime_Type, Description, Date_Committed, Prisoner_ID, crimeId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to update crime', details: err });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Crime not found' });
            return;
        }
        res.json({ message: 'Crime record updated' });
    });
});

// Route to delete a crime by Crime_ID
app.delete('/crime/:id', (req, res) => {
    const crimeId = req.params.id;
    const query = 'DELETE FROM crime WHERE Crime_ID = ?';
    db.query(query, [crimeId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to delete crime', details: err });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Crime not found' });
            return;
        }
        res.json({ message: 'Crime record deleted' });
    });
});



///rehab
// Add Rehabilitation

// 📌 Get all Rehabilitation Records
app.get('/rehabilitation', (req, res) => {
    const sql = 'SELECT * FROM rehabilitation';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        results.forEach(record => {
            record.Start_Date = record.Start_Date ? record.Start_Date.toISOString().split('T')[0] : null;
            record.End_Date = record.End_Date ? record.End_Date.toISOString().split('T')[0] : null;
        });
        res.json(results);
    });
});

// 📌 Get a Single Rehabilitation Record by ID
app.get('/rehabilitation/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM rehabilitation WHERE Rehab_ID = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching record:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Record not found' });
            return;
        }
        result[0].Start_Date = result[0].Start_Date ? result[0].Start_Date.toISOString().split('T')[0] : null;
        result[0].End_Date = result[0].End_Date ? result[0].End_Date.toISOString().split('T')[0] : null;

        res.json(result[0]);
    });
});

// 📌 Add a New Rehabilitation Record
app.post('/rehabilitation', (req, res) => {
    const { Prisoner_ID, Program_Name, Start_Date, End_Date } = req.body;
    const sql = 'INSERT INTO rehabilitation (Prisoner_ID, Program_Name, Start_Date, End_Date) VALUES (?, ?, ?, ?)';
    db.query(sql, [Prisoner_ID, Program_Name, Start_Date, End_Date], (err, result) => {
        if (err) {
            console.error('Error inserting record:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ message: 'Rehabilitation program added successfully!', insertedId: result.insertId });
    });
});

// 📌 Update an Existing Rehabilitation Record
app.put('/rehabilitation/:id', (req, res) => {
    const { id } = req.params;
    const { Program_Name, Start_Date, End_Date, Prisoner_ID } = req.body;
    const sql = 'UPDATE rehabilitation SET Program_Name = ?, Start_Date = ?, End_Date = ?, Prisoner_ID = ? WHERE Rehab_ID = ?';

    db.query(sql, [Program_Name, Start_Date, End_Date, Prisoner_ID, id], (err, result) => {
        if (err) {
            console.error('Error updating record:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ message: 'Rehabilitation program updated successfully!' });
    });
});

// 📌 Delete a Rehabilitation Record
app.delete('/rehabilitation/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM rehabilitation WHERE Rehab_ID = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting record:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ message: 'Rehabilitation program deleted successfully!' });
    });
});



///parolee
// Fetch all parole records
app.get('/parole', (req, res) => {
    db.query('SELECT * FROM parole', (err, result) => {
        if (err) {
            console.error('Error fetching parole records:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(result);
    });
});

// Get parole record by ID
app.get('/parole/:id', (req, res) => {
    const requestId = req.params.id;
    db.query('SELECT * FROM parole WHERE request_id = ?', [requestId], (err, result) => {
        if (err) {
            console.error('Error fetching parole record:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Parole request not found' });
        }
        res.json(result[0]);
    });
});

// Add a new parole record
app.post('/parole', (req, res) => {
    const { prisoner_id, details, approve, hearing_date } = req.body;
    const query = 'INSERT INTO parole (prisoner_id, details, approve, hearing_date) VALUES (?, ?, ?, ?)';
    db.query(query, [prisoner_id, details, approve, hearing_date], (err, result) => {
        if (err) {
            console.error('Error adding parole record:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'Parole request added successfully' });
    });
});

// Update a parole record by ID
app.put('/parole/:id', (req, res) => {
    const requestId = req.params.id;
    const { prisoner_id, details, approve, hearing_date } = req.body;
    const query = 'UPDATE parole SET prisoner_id = ?, details = ?, approve = ?, hearing_date = ? WHERE request_id = ?';
    db.query(query, [prisoner_id, details, approve, hearing_date, requestId], (err, result) => {
        if (err) {
            console.error('Error updating parole record:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Parole request not found' });
        }
        res.status(200).json({ message: 'Parole record updated successfully' });
    });
});

// Delete a parole record by ID
app.delete('/parole/:id', (req, res) => {
    const requestId = req.params.id;
    db.query('DELETE FROM parole WHERE request_id = ?', [requestId], (err, result) => {
        if (err) {
            console.error('Error deleting parole record:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Parole request not found' });
        }
        res.status(200).json({ message: 'Parole record deleted successfully' });
    });
});


///visit
app.get('/visit', (req, res) => {
    db.query('SELECT * FROM visit', (err, results) => {
        if (err) {
            console.error('Error fetching visit records:', err);
            res.status(500).json({ error: 'Database query failed' });
        } else {
            res.json(results);
        }
    });
});

// Get a single visit record by ID
app.get('/visit/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM visit WHERE Vis_ID = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching visit record:', err);
            res.status(500).json({ error: 'Database query failed' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Visit record not found' });
        } else {
            res.json(results[0]);
        }
    });
});

// Add a new visit record
app.post('/visit', (req, res) => {
    const { Prisoner_ID, Visitor_Name, Relationship, Contact_No, Date, Status } = req.body;
    db.query(
        'INSERT INTO visit (Prisoner_ID, Visitor_Name, Relationship, Contact_No, Date, Status) VALUES (?, ?, ?, ?, ?, ?)',
        [Prisoner_ID, Visitor_Name, Relationship, Contact_No, Date, Status],
        (err, result) => {
            if (err) {
                console.error('Error adding visit record:', err);
                res.status(500).json({ error: 'Database insert failed' });
            } else {
                res.json({ message: 'Visit record added successfully', id: result.insertId });
            }
        }
    );
});

// Update a visit record
app.put('/visit/:id', (req, res) => {
    const { id } = req.params;
    const { Prisoner_ID, Visitor_Name, Relationship, Contact_No, Date, Status } = req.body;

    db.query(
        'UPDATE visit SET Prisoner_ID = ?, Visitor_Name = ?, Relationship = ?, Contact_No = ?, Date = ?, Status = ? WHERE Vis_ID = ?',
        [Prisoner_ID, Visitor_Name, Relationship, Contact_No, Date, Status, id],
        (err, result) => {
            if (err) {
                console.error('Error updating visit record:', err);
                res.status(500).json({ error: 'Database update failed' });
            } else {
                res.json({ message: 'Visit record updated successfully' });
            }
        }
    );
});

// Delete a visit record
app.delete('/visit/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM visit WHERE Vis_ID = ?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting visit record:', err);
            res.status(500).json({ error: 'Database delete failed' });
        } else {
            res.json({ message: 'Visit record deleted successfully' });
        }
    });
});





// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${process.env.BACKEND_URL}`));
