// Function to handle Add Crime
function addCrime() {
    const crimeName = document.getElementById('crimeName').value;
    const crimeType = document.getElementById('crimeType').value;
    const dateCommitted = document.getElementById('dateCommitted').value;
    const prisonerId = document.getElementById('prisonerId').value;

    // Validate input fields
    if (!crimeName || !crimeType || !dateCommitted || !prisonerId) {
        alert("All fields are required.");
        return;
    }

    const crimeData = {
        Crime_Type: crimeType,
        Description: crimeName, // Assuming the Crime Name corresponds to the Description
        Date_Committed: dateCommitted,
        Prisoner_ID: prisonerId
    };

    fetch('${process.env.BACKEND_URL}/crime', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(crimeData)
    })
    .then(response => response.json())
    .then(result => {
        alert('Crime record added successfully!');
        fetchCrimes(); // Refresh the crime list after adding
        clearAddForm(); // Clear the Add form fields
    })
    .catch(error => {
        alert('Failed to add crime record.');
        console.error('Error:', error);
    });
}

// Function to handle Update Crime
function updateCrime() {
    const crimeId = document.getElementById('updateCrimeId').value;
    const crimeName = document.getElementById('updateCrimeName').value;
    const crimeType = document.getElementById('updateCrimeType').value;
    const dateCommitted = document.getElementById('updateDateCommitted').value;
    const prisonerId = document.getElementById('updatePrisonerId').value;

    // Validate input fields
    if (!crimeName || !crimeType || !dateCommitted || !prisonerId) {
        alert("All fields are required.");
        return;
    }

    const updatedCrimeData = {
        Crime_Type: crimeType,
        Description: crimeName, // Assuming Crime Name corresponds to Description
        Date_Committed: dateCommitted,
        Prisoner_ID: prisonerId
    };

    fetch(`${process.env.BACKEND_URL}/crime/${crimeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCrimeData)
    })
    .then(response => response.json())
    .then(result => {
        alert('Crime record updated successfully!');
        fetchCrimes(); // Refresh the crime list after update
        clearUpdateForm(); // Clear the Update form fields
    })
    .catch(error => {
        alert('Failed to update crime record.');
        console.error('Error:', error);
    });
}

// Function to populate the Update form with data from the server
function editCrime(crimeId) {
    fetch(`${process.env.BACKEND_URL}/crime/${crimeId}`)
        .then(response => response.json())
        .then(crime => {
            // Fill in the update form with the existing data
            document.getElementById('updateCrimeId').value = crime.Crime_ID;  // Crime ID is read-only
            document.getElementById('updateCrimeName').value = crime.Description;
            document.getElementById('updateCrimeType').value = crime.Crime_Type;
            document.getElementById('updateDateCommitted').value = crime.Date_Committed;
            document.getElementById('updatePrisonerId').value = crime.Prisoner_ID;

            // Show the Update form and hide the Add form
            document.getElementById('updateCrimeForm').style.display = 'block';
            document.getElementById('addCrimeForm').style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching crime details:', error);
        });
}

// Function to fetch all crime records from the database
function fetchCrimes() {
    fetch('${process.env.BACKEND_URL}/crime')  // Adjust the API URL as per your backend
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#crimeTable tbody');
            tableBody.innerHTML = '';  // Clear existing table data

            data.forEach(crime => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${crime.Crime_ID}</td>
                    <td>${crime.Prisoner_ID}</td>
                    <td>${crime.Crime_Type}</td>
                    <td>${crime.Description}</td>
                    <td>${crime.Date_Committed}</td>
                    <td>
                        <button class="editBtn" onclick="editCrime(${crime.Crime_ID})">✏️ Edit</button>
                        <button class="deleteBtn" onclick="deleteCrime(${crime.Crime_ID})">🗑️ Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching crime data:', error);
        });
}

// Function to handle the Delete button click
function deleteCrime(crimeId) {
    const confirmDelete = confirm("Are you sure you want to delete this crime record?");
    if (confirmDelete) {
        fetch(`${process.env.BACKEND_URL}/crime/${crimeId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(result => {
            alert('Crime record deleted successfully!');
            fetchCrimes();  // Refresh the crime list after deletion
        })
        .catch(error => {
            alert('Failed to delete crime record.');
            console.error('Error:', error);
        });
}
}
// Function to clear the Add form
function clearAddForm() {
    document.getElementById('crimeName').value = '';
    document.getElementById('crimeType').value = '';
    document.getElementById('dateCommitted').value = '';
    document.getElementById('prisonerId').value = '';
}

// Function to clear the Update form
function clearUpdateForm() {
    document.getElementById('updateCrimeId').value = '';
    document.getElementById('updateCrimeName').value = '';
    document.getElementById('updateCrimeType').value = '';
    document.getElementById('updateDateCommitted').value = '';
    document.getElementById('updatePrisonerId').value = '';
    document.getElementById('updateCrimeForm').style.display = 'none';
    document.getElementById('addCrimeForm').style.display = 'block';
}

// Fetch the crime records when the page loads
document.addEventListener('DOMContentLoaded', fetchCrimes);
