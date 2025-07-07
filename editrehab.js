// ✅ Fetch all rehabilitation records
function fetchRehab() {
    fetch('http://127.0.0.1:5000/rehabilitation')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#rehabTable tbody');
        tableBody.innerHTML = '';

        data.forEach(rehab => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rehab.Rehab_ID}</td>
                <td>${rehab.Prisoner_ID}</td>
                <td>${rehab.Program_Name}</td>
                <td>${rehab.Start_Date}</td>
                <td>${rehab.End_Date}</td>
                <td>
                    <button onclick="editRehab(${rehab.Rehab_ID})">✏️ Edit</button>
                    <button onclick="deleteRehab(${rehab.Rehab_ID})">🗑️ Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching rehab data:', error));
}

// ✅ Add a new rehab program
function addRehab() {
    const rehabData = {
        Program_Name: document.getElementById('rehabProgramName').value,
        Start_Date: formatDate(document.getElementById('rehabStartDate').value),
        End_Date: formatDate(document.getElementById('rehabEndDate').value),
        Prisoner_ID: document.getElementById('rehabPrisonerId').value
    };

    fetch('http://127.0.0.1:5000/rehabilitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rehabData)
    })
    .then(response => response.json())
    .then(() => {
        alert('Rehabilitation program added successfully!');
        fetchRehab();
        clearRehabForm();
    })
    .catch(error => console.error('Error:', error));
}

// ✅ Edit a rehab program
function editRehab(rehabId) {
    fetch(`http://127.0.0.1:5000/rehabilitation/${rehabId}`)
    .then(response => response.json())
    .then(rehab => {
        document.getElementById('updateRehabId').value = rehab.Rehab_ID;
        document.getElementById('updateRehabProgramName').value = rehab.Program_Name;
        document.getElementById('updateRehabStartDate').value = rehab.Start_Date;
        document.getElementById('updateRehabEndDate').value = rehab.End_Date;
        document.getElementById('updateRehabPrisonerId').value = rehab.Prisoner_ID;
    })
    .catch(error => console.error('Error fetching rehab:', error));
}

// ✅ Update an existing rehab program
function updateRehab() {
    const rehabId = document.getElementById('updateRehabId').value;
    const rehabData = {
        Program_Name: document.getElementById('updateRehabProgramName').value,
        Start_Date: document.getElementById('updateRehabStartDate').value,
        End_Date: document.getElementById('updateRehabEndDate').value,
        Prisoner_ID: document.getElementById('updateRehabPrisonerId').value
    };

    fetch(`http://127.0.0.1:5000/rehabilitation/${rehabId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rehabData)
    })
    .then(response => response.json())
    .then(() => {
        alert('Rehabilitation program updated successfully!');
        fetchRehab();
        clearUpdateRehabForm();
    })
    .catch(error => console.error('Error updating rehab:', error));
}

// ✅ Delete a rehab program
function deleteRehab(rehabId) {
    if (confirm("Are you sure you want to delete this rehabilitation program?")) {
        fetch(`http://127.0.0.1:5000/rehabilitation/${rehabId}`, {
            method: 'DELETE'
        })
        .then(() => {
            alert('Rehabilitation program deleted successfully!');
            fetchRehab();
        })
        .catch(error => console.error('Error deleting rehab program:', error));
    }
}

// ✅ Format date to YYYY-MM-DD
function formatDate(dateString) {
    return dateString ? new Date(dateString).toISOString().split('T')[0] : null;
}

// ✅ Clear Add Form
function clearRehabForm() {
    document.getElementById('rehabProgramName').value = '';
    document.getElementById('rehabStartDate').value = '';
    document.getElementById('rehabEndDate').value = '';
    document.getElementById('rehabPrisonerId').value = '';
}

// ✅ Clear Update Form
function clearUpdateRehabForm() {
    document.getElementById('updateRehabId').value = '';
    document.getElementById('updateRehabProgramName').value = '';
    document.getElementById('updateRehabStartDate').value = '';
    document.getElementById('updateRehabEndDate').value = '';
    document.getElementById('updateRehabPrisonerId').value = '';
}

// ✅ Fetch records when page loads
document.addEventListener('DOMContentLoaded', fetchRehab);
