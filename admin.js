// Search function to send query and fetch records
function searchPrisoner() {
    const query = document.getElementById('searchInput').value;

    if (query.trim() === "") {
        alert("Please enter a Prisoner Name or ID to search.");
        return;
    }

    fetch(`http://127.0.0.1:5000/adminsearch?query=${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error fetching data:", data.error);
                alert("Error fetching prisoner data.");
                return;
            }

            // Call functions to populate tables with fetched data
            populatePrisonerTable(data.prisoners);
            populateCrimeTable(data.crimes);
            populateCellTable(data.cells);
            populateRehabTable(data.rehabilitation);
            populateParoleTable(data.parole);
            populateVisitTable(data.visits);
        })
        .catch(error => {
            console.error("Error searching prisoner:", error);
            alert("Error searching prisoner.");
        });
}

// Populate Prisoner Table
function populatePrisonerTable(prisoners) {
    const tableBody = document.getElementById("prisonerTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    prisoners.forEach(prisoner => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${prisoner.Prisoner_ID || 'N/A'}</td>
            <td>${prisoner.Name || 'N/A'}</td>
            <td>${prisoner.DOB || 'N/A'}</td>
            <td>${prisoner.Gender || 'N/A'}</td>
            <td>${prisoner.Address || 'N/A'}</td>
            <td>${prisoner.Sentence_Duration || 'N/A'}</td>
            <td>${prisoner.Supervisor_ID || 'N/A'}</td>
            <td>${prisoner.Supervisor_Name || 'N/A'}</td>
        `;
    });
}

// Populate Crime Table
function populateCrimeTable(crimes) {
    const tableBody = document.getElementById("crimeTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    crimes.forEach(crime => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${crime.Prisoner_ID || 'N/A'}</td>
            <td>${crime.Crime_ID || 'N/A'}</td>
            <td>${crime.Crime_Type || 'N/A'}</td>
            <td>${crime.Description || 'N/A'}</td>
            <td>${crime.Date_Committed || 'N/A'}</td>
        `;
    });
}

// Populate Cell Table
function populateCellTable(cells) {
    const tableBody = document.getElementById("cellTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    cells.forEach(cell => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${cell.Prisoner_ID || 'N/A'}</td>
            <td>${cell.Cell_ID || 'N/A'}</td>
            <td>${cell.Block_ID || 'N/A'}</td>
            <td>${cell.Capacity || 'N/A'}</td>
        `;
    });
}

// Populate Rehabilitation Table
function populateRehabTable(rehabilitation) {
    const tableBody = document.getElementById("rehabTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    rehabilitation.forEach(program => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${program.Prisoner_ID || 'N/A'}</td>
            <td>${program.Rehab_ID || 'N/A'}</td>
            <td>${program.Program_Name || 'N/A'}</td>
            <td>${program.Start_Date || 'N/A'}</td>
            <td>${program.End_Date || 'N/A'}</td>
        `;
    });
}

// Populate Parole Table
function populateParoleTable(parole) {
    const tableBody = document.getElementById("paroleTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    parole.forEach(request => {
        const row = tableBody.insertRow();
        row.innerHTML = `
        <td>${request.request_id || 'N/A'}</td>
            <td>${request.prisoner_id || 'N/A'}</td>
            <td>${request.details || 'N/A'}</td>
            <td>${request.approve ? 'Yes' : 'No'}</td>
            <td>${request.hearing_date || 'N/A'}</td>
        `;
    });
}

// Populate Visit Table
function populateVisitTable(visits) {
    const tableBody = document.getElementById("visitTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    visits.forEach(visit => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${visit.Prisoner_ID || 'N/A'}</td>
            <td>${visit.Vis_ID || 'N/A'}</td>
            <td>${visit.Visitor_Name || 'N/A'}</td>
            <td>${visit.Relationship || 'N/A'}</td>
            <td>${visit.Contact_No || 'N/A'}</td>
            <td>${visit.Date || 'N/A'}</td>
            <td>${visit.Status || 'N/A'}</td>
        `;
    });
}

