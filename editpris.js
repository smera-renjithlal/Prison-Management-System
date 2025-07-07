// Fetch all prisoner records from the database when the page loads
function fetchPrisoners() {
    fetch('http://127.0.0.1:5000/prisoners')
        .then(response => response.json())
        .then(prisoners => {
            const tableBody = document.querySelector('#prisonersTable tbody');
            tableBody.innerHTML = ''; // Clear existing table rows

            prisoners.forEach(prisoner => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${prisoner.Prisoner_ID}</td>
                    <td>${prisoner.Name}</td>
                    <td>${prisoner.DOB}</td>
                    <td>${prisoner.Gender}</td>
                    <td>${prisoner.Address}</td>
                    <td>${prisoner.Sentence_Duration}</td>
                    <td>${prisoner.Supervisor_ID}</td>

                    <td>
                        <button onclick="editPrisoner(${prisoner.Prisoner_ID})">Edit</button>
                        <button onclick="deletePrisoner(${prisoner.Prisoner_ID})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching prisoner records:', error));
}

// Fetch and fill the form with the selected prisoner's data
function editPrisoner(prisonerId) {
    fetch(`http://127.0.0.1:5000/prisoners/${prisonerId}`)
        .then(response => response.json())
        .then(prisoner => {
            document.getElementById('name').value = prisoner.Name;
            document.getElementById('dob').value = prisoner.DOB ? prisoner.DOB.split('T')[0] : '';
            document.getElementById('gender').value = prisoner.Gender;
            document.getElementById('address').value = prisoner.Address;
            document.getElementById('sentenceDuration').value = prisoner.Sentence_Duration;
            document.getElementById('supervisorId').value = prisoner.Supervisor_ID;

            // Store prisoner ID for updating later
            document.getElementById('saveButton').setAttribute('data-prisoner-id', prisoner.Prisoner_ID);
        })
        .catch(error => console.error('Error fetching prisoner data:', error));
}

// Save the updated prisoner record
// Function to update a prisoner
function updatePrisoner() {
    const prisonerId = document.getElementById('saveButton').getAttribute('data-prisoner-id');
    const name = document.getElementById('name').value;
    const dob = document.getElementById('dob').value;  // Gets the value in the correct format
    const gender = document.getElementById('gender').value;
    const address = document.getElementById('address').value;
    const sentenceDuration = document.getElementById('sentenceDuration').value;
    const supervisorId = document.getElementById('supervisorId').value;

    const data = {
        name,
        dob,
        gender,
        address,
        sentenceDuration,
        supervisorId,
    };

    fetch(`http://127.0.0.1:5000/prisoners/${prisonerId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        alert('Prisoner record updated successfully!');
        fetchPrisoners();  // Refresh the prisoner list after update
    })
    .catch(error => {
        alert('Failed to update prisoner record.');
        console.error('Error:', error);
    });
}




// Delete a prisoner record
function deletePrisoner(prisonerId) {
    if (confirm('Are you sure you want to delete this prisoner?')) {
        fetch(`http://127.0.0.1:5000/prisoners/${prisonerId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Prisoner record deleted successfully!');
                fetchPrisoners();  // Refresh the list of prisoners
            } else {
                alert('Failed to delete prisoner record.');
            }
        })
        .catch(error => {
            alert('Failed to delete prisoner record.');
            console.error('Error:', error);
        });
    }
}

// Fetch prisoners when the page loads
window.onload = function() {
    fetchPrisoners();
};
