const API_URL = '${process.env.BACKEND_URL}/parole'; // Ensure this matches your server

// Function to format date to yyyy-MM-dd
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Fetch all parole records
function fetchParole() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#paroleTable tbody');
            tableBody.innerHTML = '';

            data.forEach(parole => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${parole.request_id}</td>
                    <td>${parole.prisoner_id}</td>
                    <td>${parole.details}</td>
                    <td>${formatDate(parole.hearing_date)}</td>
                    <td>${parole.approve ? 'Approved' : 'Not Approved'}</td>
                    <td>
                        <button onclick="editParole(${parole.request_id})">✏️ Edit</button>
                        <button onclick="deleteParole(${parole.request_id})">🗑️ Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching parole data:', error);
            alert('There was an error fetching the parole data. Please try again later.');
        });
}

// Fetch parole details for editing
function editParole(paroleId) {
    fetch(`${API_URL}/${paroleId}`)
        .then(response => response.json())
        .then(parole => {
            document.getElementById('updateParoleId').value = parole.request_id;
            document.getElementById('updateParolePrisonerId').value = parole.prisoner_id;
            document.getElementById('updateParoleDetails').value = parole.details;
            document.getElementById('updateParoleApproved').checked = parole.approve;
            document.getElementById('updateParoleHearingDate').value = formatDate(parole.hearing_date);
        })
        .catch(error => {
            console.error('Error fetching parole record:', error);
            alert('Failed to fetch the parole data. Please try again.');
        });
}

// Update a parole record
function updateParole() {
    const paroleId = document.getElementById('updateParoleId').value;
    const paroleData = {
        prisoner_id: document.getElementById('updateParolePrisonerId').value,
        details: document.getElementById('updateParoleDetails').value,
        approve: document.getElementById('updateParoleApproved').checked ? 1 : 0,
        hearing_date: document.getElementById('updateParoleHearingDate').value
    };

    fetch(`${API_URL}/${paroleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paroleData)
    })
        .then(response => response.json())
        .then(() => {
            alert('Parole record updated successfully!');
            fetchParole();
            clearUpdateParoleForm();
        })
        .catch(error => {
            console.error('Error updating parole record:', error);
            alert('Failed to update the parole record. Please try again.');
        });
}

// Delete a parole record
function deleteParole(paroleId) {
    if (confirm('Are you sure you want to delete this parole record?')) {
        fetch(`${API_URL}/${paroleId}`, {
            method: 'DELETE'
        })
            .then(() => {
                alert('Parole record deleted successfully!');
                fetchParole();
            })
            .catch(error => console.error('Error deleting parole record:', error));
    }
}

// Add a new parole record
function addParole() {
    const paroleData = {
        prisoner_id: document.getElementById('parolePrisonerId').value,
        details: document.getElementById('paroleDetails').value,
        approve: document.getElementById('paroleApproved').checked ? 1 : 0,
        hearing_date: document.getElementById('paroleHearingDate').value
    };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paroleData)
    })
        .then(response => response.json())
        .then(() => {
            alert('Parole record added successfully!');
            fetchParole(); // Refresh the list after adding
            clearParoleForm(); // Clear the form
        })
        .catch(error => console.error('Error adding parole record:', error));
}
// Clear the add parole form
function clearParoleForm() {
    document.getElementById('addParoleForm').reset();
}


// Clear the update parole form
function clearUpdateParoleForm() {
    document.getElementById('editParoleForm').reset();
}

// Fetch parole records when page loads
document.addEventListener('DOMContentLoaded', fetchParole);
