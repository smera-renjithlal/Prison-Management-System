// Fetch all staff records from the database
function fetchStaff() {
    fetch('${process.env.BACKEND_URL}/staff')  // Adjust the API URL as per your backend
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#staffTable tbody');
            tableBody.innerHTML = '';  // Clear existing table data

            data.forEach(staff => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${staff.Staff_ID}</td>
                    <td>${staff.Name}</td>
                    <td>${staff.Contact_No}</td>
                    <td>${staff.Hire_Date}</td>
                    <td>${staff.Gender}</td>
                    <td>${staff.Salary}</td>
                    <td>${staff.Address}</td>
                    <td>
                        <button class="editBtn" onclick="editStaff(${staff.Staff_ID})">✏️ Edit</button>
                        <button class="deleteBtn" onclick="deleteStaff(${staff.Staff_ID})">🗑️ Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching staff data:', error);
        });
}

// Function to handle the Edit button click
function editStaff(staffId) {
    fetch(`${process.env.BACKEND_URL}/staff/${staffId}`)
        .then(response => response.json())
        .then(staff => {
            document.getElementById('name').value = staff.Name;
            document.getElementById('contact').value = staff.Contact_No;

            // Handle the hire date format for the input type="date"
            const hireDateFormatted = staff.Hire_Date.split('T')[0];  // Convert to 'yyyy-MM-dd'
            document.getElementById('hireDate').value = hireDateFormatted;

            document.getElementById('gender').value = staff.Gender;
            document.getElementById('salary').value = staff.Salary;
            document.getElementById('address').value = staff.Address;
            document.getElementById('saveButton').setAttribute('data-id', staff.Staff_ID);  // Store staff ID in the save button
        })
        .catch(error => {
            console.error('Error fetching staff details:', error);
        });
}

// Function to update staff details
function updateStaff() {
    const staffId = document.getElementById('saveButton').getAttribute('data-id');
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const hireDate = document.getElementById('hireDate').value;
    const gender = document.getElementById('gender').value;
    const salary = document.getElementById('salary').value;
    const address = document.getElementById('address').value;

    // Prepare the data to send
    const updatedData = {
        name,
        contact,
        hireDate,
        gender,
        salary,
        address
    };

    // Send PUT request to update staff details
    fetch(`${process.env.BACKEND_URL}/staff/${staffId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(result => {
        alert('Staff record updated successfully!');
        fetchStaff();  // Refresh the staff list after update
    })
    .catch(error => {
        alert('Failed to update staff record.');
        console.error('Error:', error);
    });
}

// Function to handle Add Staff button click
function addStaff() {
    const name = document.getElementById('addName').value;
    const contact = document.getElementById('addContact').value;
    const hireDate = document.getElementById('addHireDate').value;
    const gender = document.getElementById('addGender').value;
    const salary = document.getElementById('addSalary').value;
    const address = document.getElementById('addAddress').value;

    const newStaffData = {
        name,
        contact,
        hireDate,
        gender,
        salary,
        address
    };

    fetch('${process.env.BACKEND_URL}/staff', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStaffData)
    })
    .then(response => response.json())
    .then(result => {
        alert('New staff member added!');
        fetchStaff();  // Refresh the staff list after adding
    })
    .catch(error => {
        alert('Failed to add new staff.');
        console.error('Error:', error);
    });
}

// Function to handle the Delete button click
function deleteStaff(staffId) {
    const confirmDelete = confirm("Are you sure you want to delete this staff member?");
    if (confirmDelete) {
        fetch(`${process.env.BACKEND_URL}/staff/${staffId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(result => {
            alert('Staff record deleted successfully!');
            fetchStaff();  // Refresh the staff list after deletion
        })
        .catch(error => {
            alert('Failed to delete staff record.');
            console.error('Error:', error);
        });
    }
}

// Fetch the staff records when the page loads
document.addEventListener('DOMContentLoaded', fetchStaff);
