const API_URL = 'http://127.0.0.1:5000/visit'; // Update this if your server URL is different

// Function to format date to yyyy-MM-dd
function formatDate(dateString) {
    if (!dateString) return ''; // Handle null dates
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Convert to yyyy-MM-dd format
}

// Fetch all visitor records
function fetchVisits() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#visitTable tbody');
            tableBody.innerHTML = '';

            data.forEach(visit => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${visit.Vis_ID}</td>
                    <td>${visit.Prisoner_ID}</td>
                    <td>${visit.Visitor_Name}</td>
                    <td>${visit.Relationship}</td>
                    <td>${visit.Contact_No}</td>
                    <td>${formatDate(visit.Date)}</td>
                    <td>${visit.Status}</td>
                    <td>
                        <button onclick="editVisit(${visit.Vis_ID})">✏️ Edit</button>
                        <button onclick="deleteVisit(${visit.Vis_ID})">🗑️ Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching visit data:', error));
}

// Add a new visit record
function addVisit() {
    const visitData = {
        Prisoner_ID: document.getElementById('visitPrisonerId').value,
        Visitor_Name: document.getElementById('visitVisitorName').value,
        Relationship: document.getElementById('visitRelationship').value,
        Contact_No: document.getElementById('visitContactNo').value,
        Date: document.getElementById('visitDate').value,
        Status: document.getElementById('visitStatus').value
    };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitData)
    })
        .then(response => response.json())
        .then(() => {
            alert('Visit record added successfully!');
            fetchVisits();
            clearVisitForm();
        })
        .catch(error => console.error('Error adding visit record:', error));
}

// Edit a visit record (fetch details)
function editVisit(visitId) {
    fetch(`${API_URL}/${visitId}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(visit => {
            document.getElementById('updateVisitId').value = visit.Vis_ID;
            document.getElementById('updateVisitPrisonerId').value = visit.Prisoner_ID;
            document.getElementById('updateVisitVisitorName').value = visit.Visitor_Name;
            document.getElementById('updateVisitRelationship').value = visit.Relationship;
            document.getElementById('updateVisitContactNo').value = visit.Contact_No;
            document.getElementById('updateVisitDate').value = formatDate(visit.Date);
            document.getElementById('updateVisitStatus').value = visit.Status;
        })
        .catch(error => {
            console.error('Error fetching visit record:', error);
            alert('Failed to fetch the visit data. Please try again.');
        });
}

// Update a visit record
function updateVisit() {
    const visitId = document.getElementById('updateVisitId').value;
    const visitData = {
        Prisoner_ID: document.getElementById('updateVisitPrisonerId').value,
        Visitor_Name: document.getElementById('updateVisitVisitorName').value,
        Relationship: document.getElementById('updateVisitRelationship').value,
        Contact_No: document.getElementById('updateVisitContactNo').value,
        Date: document.getElementById('updateVisitDate').value,
        Status: document.getElementById('updateVisitStatus').value
    };

    fetch(`${API_URL}/${visitId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitData)
    })
        .then(response => response.json())
        .then(() => {
            alert('Visit record updated successfully!');
            fetchVisits();
            clearUpdateVisitForm();
        })
        .catch(error => console.error('Error updating visit record:', error));
}

// Delete a visit record
function deleteVisit(visitId) {
    if (confirm('Are you sure you want to delete this visit record?')) {
        fetch(`${API_URL}/${visitId}`, {
            method: 'DELETE'
        })
            .then(() => {
                alert('Visit record deleted successfully!');
                fetchVisits();
            })
            .catch(error => console.error('Error deleting visit record:', error));
    }
}

// Clear the add visit form
function clearVisitForm() {
    document.getElementById('addVisitForm').reset();
}

// Clear the update visit form
function clearUpdateVisitForm() {
    document.getElementById('editVisitForm').reset();
}

// Fetch visit records when page loads
document.addEventListener('DOMContentLoaded', fetchVisits);
