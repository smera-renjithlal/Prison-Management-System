document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".search-box button").addEventListener("click", searchPrisoner);
});

function searchPrisoner() {
    const searchQuery = document.getElementById("searchInput").value.trim();
    if (searchQuery === "") {
        alert("Please enter a Prisoner ID or Name!");
        return;
    }

    fetch(`http://localhost:5000/search?query=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => {
            const prisonerTableBody = document.querySelector("#prisonerTable tbody");
            const crimeTableBody = document.querySelector("#crimeTable tbody");
            const cellTableBody = document.querySelector("#cellTable tbody");
            const rehabTableBody = document.querySelector("#rehabTable tbody");
            const paroleTableBody = document.querySelector("#paroleTable tbody");
            const visitTableBody = document.querySelector("#visitTable tbody"); // Visit table

            prisonerTableBody.innerHTML = "";
            crimeTableBody.innerHTML = "";
            cellTableBody.innerHTML = "";
            rehabTableBody.innerHTML = "";
            paroleTableBody.innerHTML = "";
            visitTableBody.innerHTML = "";

            if (!data.prisoners.length) {
                prisonerTableBody.innerHTML = "<tr><td colspan='8'>No prisoner found</td></tr>";
                crimeTableBody.innerHTML = "<tr><td colspan='4'>No crimes found</td></tr>";
                cellTableBody.innerHTML = "<tr><td colspan='4'>No cell assigned</td></tr>";
                rehabTableBody.innerHTML = "<tr><td colspan='4'>No rehabilitation programs found</td></tr>";
                paroleTableBody.innerHTML = "<tr><td colspan='3'>No parole requests found</td></tr>";
                visitTableBody.innerHTML = "<tr><td colspan='6'>No visit records found</td></tr>";
                return;
            }

            const prisoner = data.prisoners[0];
            prisonerTableBody.innerHTML = `
                <tr>
                    <td>${prisoner.Prisoner_ID}</td>
                    <td>${prisoner.Name}</td>
                    <td>${prisoner.DOB}</td>
                    <td>${prisoner.Gender}</td>
                    <td>${prisoner.Address}</td>
                    <td>${prisoner.Sentence_Duration}</td>
                    <td>${prisoner.Supervisor_ID}</td>
                    <td>${prisoner.Supervisor_Name || 'N/A'}</td>
                </tr>
            `;

            data.crimes.forEach(crime => {
                crimeTableBody.innerHTML += `
                    <tr>
                        <td>${crime.Crime_ID}</td>
                        <td>${crime.Crime_Type}</td>
                        <td>${crime.Description}</td>
                        <td>${crime.Date_Committed}</td>
                    </tr>
                `;
            });

            data.cells.forEach(cell => {
                cellTableBody.innerHTML += `
                    <tr>
                        <td>${cell.Cell_ID}</td>
                        <td>${cell.Block_ID}</td>
                        <td>${cell.Capacity}</td>
                        <td>${cell.Prisoner_ID}</td>
                    </tr>
                `;
            });

            data.rehabilitation.forEach(rehab => {
                rehabTableBody.innerHTML += `
                    <tr>
                        <td>${rehab.Rehab_ID}</td>
                        <td>${rehab.Program_Name}</td>
                        <td>${rehab.Start_Date}</td>
                        <td>${rehab.End_Date}</td>
                    </tr>
                `;
            });

            data.parole.forEach(parole => {
                paroleTableBody.innerHTML += `
                    <tr>
                        <td>${parole.request_id}</td>
                        <td>${parole.details}</td>
                        <td>${parole.approve ? "Yes" : "No"}</td>
                    </tr>
                `;
            });

            data.visits.forEach(visit => {
                visitTableBody.innerHTML += `
                    <tr>
                        <td>${visit.Vis_ID}</td>
                        <td>${visit.Visitor_Name}</td>
                        <td>${visit.Relationship}</td>
                        <td>${visit.Contact_No}</td>
                        <td>${visit.Date}</td>
                        <td>${visit.Status}</td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error("Error fetching records:", error));
}
