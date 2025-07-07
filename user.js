import { BACKEND_URL } from './config.js';

// Function to show the visitation form and hide the parole form
function showVisitationForm() {
    document.getElementById('visitationForm').style.display = 'block';
    document.getElementById('paroleForm').style.display = 'none';
}

// Function to show the parole form and hide the visitation form
function showParoleForm() {
    document.getElementById('paroleForm').style.display = 'block';
    document.getElementById('visitationForm').style.display = 'none';
}

// Handle the visitation form submission
document.querySelector('#visitationForm form').addEventListener('submit', async function(event) {
    console.log('Visitation form submitted'); // Log to check if the function is triggered
    event.preventDefault();

    const prisoner_id = document.getElementById('prisoner_id_visitation').value;
    const visitor_name = document.getElementById('visitor_name').value;
    const relationship = document.getElementById('relationship').value;
    const contact_no = document.getElementById('contact_no').value;
    const date = document.getElementById('date').value;

    // Sending data to the backend via POST request
    const response = await fetch(`${BACKEND_URL}/submit-visitation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prisoner_id,
            visitor_name,
            relationship,
            contact_no,
            date
        })
    });

    const result = await response.json();
    console.log('Visitation form response:', result); // Log the response

    if (result.success) {
        alert('Visitation submitted successfully!');
        document.querySelector('#visitationForm form').reset(); // Reset form
    } else {
        alert('Error submitting visitation.');
    }
});

// Handle the parole form submission
document.querySelector('#paroleForm form').addEventListener('submit', async function(event) {
    console.log('Parole form submitted'); // Log to check if the function is triggered
    event.preventDefault();

    const prisoner_id = document.getElementById('prisoner_id_parole').value;
    const details = document.getElementById('details').value;

    // Sending data to the backend via POST request
    const response = await fetch(`${BACKEND_URL}/submit-parole`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prisoner_id,
            details
        })
    });

    const result = await response.json();
    console.log('Parole form response:', result); // Log the response

    if (result.success) {
        alert('Parole request submitted successfully!');
        document.querySelector('#paroleForm form').reset(); // Reset form
    } else {
        alert('Error submitting parole request.');
    }
});
