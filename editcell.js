import { BACKEND_URL } from './config.js';

document.addEventListener("DOMContentLoaded", fetchCells);

function fetchCells() {
    fetch(`${BACKEND_URL}/cells`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#cellsTable tbody");
            tableBody.innerHTML = "";
            data.forEach(cell => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${cell.Cell_ID}</td>
                    <td>${cell.Block_ID}</td>
                    <td>${cell.Capacity}</td>
                    <td>${cell.Prisoner_ID || "None"}</td>
                    <td>
                        <button onclick="fillUpdateForm(${cell.Cell_ID}, '${cell.Block_ID}', ${cell.Capacity}, ${cell.Prisoner_ID || 'null'})">Edit</button>
                        <button onclick="deleteCell(${cell.Cell_ID})" style="background-color: red;">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching cells:", error));
}

function fillUpdateForm(cellId, block, capacity, prisonerId) {
    document.getElementById("cellId").value = cellId;
    document.getElementById("block").value = block;
    document.getElementById("capacity").value = capacity;
    document.getElementById("prisonerId").value = prisonerId === "null" ? "" : prisonerId;
}

function updateCell() {
    const cellId = document.getElementById("cellId").value;
    const block = document.getElementById("block").value;
    const capacity = document.getElementById("capacity").value;
    const prisonerId = document.getElementById("prisonerId").value || null;

    const data = { block, capacity, prisonerId };

    fetch(`${BACKEND_URL}/cells/${cellId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(result => {
            alert("Cell updated successfully!");
            fetchCells();
        })
        .catch(error => {
            alert("Failed to update cell.");
            console.error("Error:", error);
        });
}

function deleteCell(cellId) {
    if (confirm("Are you sure you want to delete this cell?")) {
        fetch(`${BACKEND_URL}/cells/${cellId}`, {
            method: "DELETE"
        })
            .then(response => response.json())
            .then(result => {
                alert("Cell deleted successfully!");
                fetchCells();
            })
            .catch(error => {
                alert("Failed to delete cell.");
                console.error("Error:", error);
            });
    }
}

function addCell() {
    const block = document.getElementById("newBlock").value;
    const capacity = document.getElementById("newCapacity").value;
    const prisonerId = document.getElementById("newPrisonerId").value || null;

    const data = { block, capacity, prisonerId };

    fetch(`${BACKEND_URL}/cells`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(result => {
            alert("New cell added successfully!");
            document.getElementById("addCellForm").reset();
            fetchCells();
        })
        .catch(error => {
            alert("Failed to add cell.");
            console.error("Error:", error);
        });
}
