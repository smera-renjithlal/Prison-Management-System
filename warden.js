import { BACKEND_URL } from './config.js';

// Function to search prisoners by ID
async function searchPrisoner() {
    const id = document.getElementById("searchInput").value.trim();
    
    if (id === "") {
        alert("Please enter a Prisoner ID to search.");
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/prisoners/search?id=${id}`);
        const data = await response.json();

        if (response.ok) {
            displayResults(data, "searchResults", "searchTableContainer");
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error searching prisoner:", error);
        alert("Failed to fetch search results");
    }
}

// Function to fetch all prisoner records
async function fetchAllRecords() {
    try {
        const response = await fetch(`${BACKEND_URL}/prisoners/all`);
        const data = await response.json();

        if (response.ok) {
            displayResults(data, "allRecordsSection", "allRecordsTableContainer");
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error fetching all records:", error);
        alert("Failed to fetch all prisoner records");
    }
}

// Function to fetch all prisoners for enrollment
async function showEnrollInmate() {
    try {
        const response = await fetch(`${BACKEND_URL}/prisoners/all`);
        const data = await response.json();

        if (response.ok) {
            displayResults(data, "enrollSection", "enrollTableContainer");
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error fetching prisoners for enrollment:", error);
        alert("Failed to fetch enrollment data");
    }
}

async function fetchParoleRecords() {
    try {
        const response = await fetch(`${BACKEND_URL}/parole/all-unapproved`);
        const data = await response.json();

        if (response.ok) {
            displayResults2(data, "paroleSection", "parole-records");
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error fetching all records:", error);
        alert("Failed to fetch unapproved parole records");
    }
}

// Function to handle approving parole
function approveParole(requestId) {
    fetch(`${BACKEND_URL}/paroles/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ request_id: requestId })
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse JSON response
            } else {
                throw new Error('Failed to approve the parole request.');
            }
        })
        .then(data => {
            alert(data.message); // Display success message
            fetchParoleRecords(); // Refresh the table after successful approval
        })
        .catch(error => {
            console.error(error); // Log any errors
            alert('An error occurred while approving the parole request.');
        });
}

async function fetchVisitRecords() {
    try {
        const response = await fetch(`${BACKEND_URL}/visit/all-unapproved`);
        const data = await response.json();

        if (response.ok) {
            displayResults3(data, "visitSection", "visit-records");
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error fetching all records:", error);
        alert("Failed to fetch unapproved visitation records");
    }
}

// Function to handle approving visitation
function approveVisit(visitId) {
    fetch(`${BACKEND_URL}/visit/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Vis_ID: visitId })
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse JSON response
            } else {
                throw new Error('Failed to approve the visitation request.');
            }
        })
        .then(data => {
            alert(data.message); // Display success message
            fetchVisitRecords(); // Refresh the table after successful approval
        })
        .catch(error => {
            console.error(error); // Log any errors
            alert('An error occurred while approving the visitation request.');
        });
}

// Function to handle rejecting visitation
function rejectVisit(visitId) {
    fetch(`${BACKEND_URL}/visit/reject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Vis_ID: visitId })
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse JSON response
            } else {
                throw new Error('Failed to reject the visitation request.');
            }
        })
        .then(data => {
            alert(data.message); // Display success message
            fetchVisitRecords(); // Refresh the table after successful rejection
        })
        .catch(error => {
            console.error(error); // Log any errors
            alert('An error occurred while rejecting the visitation request.');
        });
}

// Function to hide all sections
function hideAllSections() {
    document.getElementById("searchResults").style.display = "none";
    document.getElementById("allRecordsSection").style.display = "none";
    document.getElementById("enrollSection").style.display = "none";
    document.getElementById("paroleSection").style.display = "none";
    document.getElementById("visitSection").style.display = "none";
}

// Function to display prisoner data in a table with toggle feature
function displayResults(records, sectionId, containerId) {
    const section = document.getElementById(sectionId);
    const tableContainer = document.getElementById(containerId);

    // Toggle visibility: If already visible, hide it; otherwise, show it
    if (section.style.display === "block") {
        section.style.display = "none";
        return;
    }

    // Hide all other sections before showing the new one
    hideAllSections();
    
    // Show section and clear old results
    section.style.display = "block";
    tableContainer.innerHTML = "";    

    if (records.length === 0) {
        tableContainer.innerHTML = "<p>No records found.</p>";
        return;
    }

    let tableHTML = `
        <table border="1">
            <thead>
                <tr>
                    <th>Prisoner ID</th>
                    <th>Name</th>
                    <th>DOB</th>
                    <th>Gender</th>
                    <th>Address</th>
                    <th>Sentence Duration</th>
                </tr>
            </thead>
            <tbody>
    `;

    records.forEach(prisoner => {
        tableHTML += `
            <tr>
                <td>${prisoner.Prisoner_ID}</td>
                <td>${prisoner.Name}</td>
                <td>${prisoner.DOB}</td>
                <td>${prisoner.Gender}</td>
                <td>${prisoner.Address}</td>
                <td>${prisoner.Sentence_Duration}</td>
            </tr>
        `;
    });

    tableHTML += "</tbody></table>";
    tableContainer.innerHTML = tableHTML;
}

function displayResults2(records, sectionId, containerId) {
    const section = document.getElementById(sectionId);
    const tableContainer = document.getElementById(containerId);

    // Toggle visibility: If already visible, hide it; otherwise, show it
    if (section.style.display === "block") {
        section.style.display = "none";
        return;
    }

    // Hide all other sections before showing the new one
    hideAllSections();

    // Show section and clear old results
    section.style.display = "block";
    tableContainer.innerHTML = "";

    if (records.length === 0) {
        tableContainer.innerHTML = "<p>No records found.</p>";
        return;
    }

    let tableHTML = `
        <table border="1">
            <thead>
                <tr>
                    <th>Request ID</th>
                    <th>Prisoner ID</th>
                    <th>Details</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    records.forEach(request => {
        tableHTML += `
            <tr>
                <td>${request.request_id}</td>
                <td>${request.prisoner_id}</td>
                <td>${request.details}</td>
                <td><button onclick="approveParole(${request.request_id})">Approve</button></td>
            </tr>
        `;
    });

    tableHTML += "</tbody></table>";
    tableContainer.innerHTML = tableHTML;
}

function displayResults3(records, sectionId, containerId) {
    const section = document.getElementById(sectionId);
    const tableContainer = document.getElementById(containerId);

    // Toggle visibility: If already visible, hide it; otherwise, show it
    if (section.style.display === "block") {
        section.style.display = "none";
        return;
    }

    // Hide all other sections before showing the new one
    hideAllSections();

    // Show section and clear old results
    section.style.display = "block";
    tableContainer.innerHTML = "";

    if (records.length === 0) {
        tableContainer.innerHTML = "<p>No records found.</p>";
        return;
    }

    let tableHTML = `
        <table border="1">
            <thead>
                <tr>
                    <th>Visit ID</th>
                    <th>Prisoner ID</th>
                    <th>Visitor Name</th>
                    <th>Relationship</th>
                    <th>Contact Number</th>
                    <th>Date</th>
                    <th>Approve</th>
                    <th>Reject</th>
                </tr>
            </thead>
            <tbody>
    `;

    records.forEach(visit => {
        tableHTML += `
            <tr>
                <td>${visit.Vis_ID}</td>
                <td>${visit.Prisoner_ID}</td>
                <td>${visit.Visitor_Name}</td>
                <td>${visit.Relationship}</td>
                <td>${visit.Contact_No}</td>
                <td>${visit.Date}</td>
                <td><button onclick="approveVisit(${visit.Vis_ID})">Approve</button></td>
                <td><button onclick="rejectVisit(${visit.Vis_ID})">Reject</button></td>
            </tr>
        `;
    });

    tableHTML += "</tbody></table>";
    tableContainer.innerHTML = tableHTML;
}

document.getElementById('viewAllBtn').addEventListener('click', fetchAllRecords);
document.getElementById('enrollBtn').addEventListener('click', showEnrollInmate);
document.getElementById('paroleBtn').addEventListener('click', fetchParoleRecords);
document.getElementById('visitBtn').addEventListener('click', fetchVisitRecords);