document.addEventListener('DOMContentLoaded', async function() {
    const doctorDropdown = document.getElementById('doctorId');
    doctorDropdown.addEventListener('change', fetchDoctorAvailability);
    await fetchDoctors();
});

async function handleSubmit() {
    const doctorId = parseInt(document.getElementById('doctorId').value);
    const availabilityDateTimeInput = document.getElementById('availabilityDateTime').value;
    const isAvailable = document.getElementById('isAvailable').checked;
    const isoDateTime = new Date(availabilityDateTimeInput).toISOString();

    const availabilityData = {
        doctorId: doctorId,
        availabilityDateTime: isoDateTime,
        isAvailable: isAvailable
    };

    const updateDoctorId = document.getElementById('updateDoctorId').value;
    const updateAvailabilityDateTime = document.getElementById('updateAvailabilityDateTime').value;

    if (updateDoctorId && updateAvailabilityDateTime) {
        // Update existing availability
        await updateDoctorAvailability(updateDoctorId, updateAvailabilityDateTime, availabilityData);
    } else {
        // Add new availability
        await addDoctorAvailability(availabilityData);
    }

    clearForm();
    fetchDoctorAvailability();
}

async function addDoctorAvailability(availabilityData) {
    try {
        const response = await fetch('http://localhost:9000/doctorAvailability/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(availabilityData)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        alert('Doctor availability added successfully!');
    } catch (error) {
        console.error('Error adding doctor availability:', error);
        alert(`Error adding doctor availability: ${error.message}`);
    }
}

async function updateDoctorAvailability(doctorId, availabilityDateTime, updatedData) {
    try {
        const response = await fetch(`http://localhost:9000/doctorAvailability/update/${doctorId}/${availabilityDateTime}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error: ${response.status} - ${errorMessage}`);
        }

        alert('Doctor availability updated successfully!');
    } catch (error) {
        console.error('Error updating doctor availability:', error);
        alert(`Error updating doctor availability: ${error.message}`);
    }
}

async function deleteAvailability(doctorId, availabilityDateTime) {
    try {
        const response = await fetch(`http://localhost:9000/doctorAvailability/delete/${doctorId}/${availabilityDateTime}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error: ${response.status} - ${errorMessage}`);
        }

        alert('Doctor availability deleted successfully!');
        fetchDoctorAvailability(); // Refresh the table with the updated availability
    } catch (error) {
        console.error('Error deleting doctor availability:', error);
        alert(`Error deleting doctor availability: ${error.message}`);
    }
}

async function fetchDoctors() {
    try {
        const response = await fetch('http://localhost:9000/doctor/getAll');
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const doctors = await response.json();
        populateDoctorDropdown(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        alert(`Error fetching doctors: ${error.message}`);
    }
}

function populateDoctorDropdown(doctors) {
    const doctorDropdown = document.getElementById('doctorId');
    doctorDropdown.innerHTML = ''; // Clear previous options
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.doctorId;
        option.textContent = `${doctor.doctorId} - ${doctor.doctorName}`;
        doctorDropdown.appendChild(option);
    });
}

async function fetchDoctorAvailability() {
    const doctorId = document.getElementById('doctorId').value;
    try {
        const response = await fetch(`http://localhost:9000/doctorAvailability/${doctorId}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const availability = await response.json();
        populateAvailabilityTable(availability);
    } catch (error) {
        console.error('Error fetching doctor availability:', error);
        alert(`Error fetching doctor availability: ${error.message}`);
    }
}

function populateAvailabilityTable(availability) {
    const tableBody = document.querySelector('#availabilityTable tbody');
    tableBody.innerHTML = ''; // Clear previous entries
    availability.forEach(entry => {
        const doctorId = entry.doctor ? entry.doctor.doctorId : entry.doctorId;
        const availabilityDateTime = new Date(entry.availabilityDateTime).toLocaleString();
        const isAvailable = entry.isAvailable ? 'Yes' : 'No'; // Ensure this is the correct field from your data
        const isoDateTime = new Date(entry.availabilityDateTime).toISOString();
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${doctorId}</td>
            <td>${availabilityDateTime}</td>
            <td>${parseIsAvailable(isAvailable)}</td>
            <td>
                <button onclick="loadAvailabilityForUpdate(${doctorId}, '${isoDateTime}', ${entry.isAvailable})">Update</button>
                <button onclick="deleteAvailability(${doctorId}, '${isoDateTime}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadAvailabilityForUpdate(doctorId, availabilityDateTime, isAvailable) {
    const doctorDropdown = document.getElementById('doctorId');
    const availabilityDateTimeInput = document.getElementById('availabilityDateTime');
    const isAvailableInput = document.getElementById('isAvailable');
    const updateDoctorId = document.getElementById('updateDoctorId');
    const updateAvailabilityDateTime = document.getElementById('updateAvailabilityDateTime');
    const submitButton = document.getElementById('submitButton');

    doctorDropdown.value = doctorId;
    availabilityDateTimeInput.value = availabilityDateTime.slice(0, 16); // Exclude seconds and milliseconds
    isAvailableInput.checked = parseIsAvailable(isAvailable); // Pass the isAvailable value directly as a boolean
    updateDoctorId.value = doctorId;
    updateAvailabilityDateTime.value = availabilityDateTime;
    submitButton.textContent = 'Update Availability';
}

function parseIsAvailable(isAvailable) {
    return isAvailable ? 'Yes' : 'No';
}

function clearForm() {
    const doctorDropdown = document.getElementById('doctorId');
    const availabilityDateTimeInput = document.getElementById('availabilityDateTime');
    const isAvailableInput = document.getElementById('isAvailable');
    const updateDoctorId = document.getElementById('updateDoctorId');
    const updateAvailabilityDateTime = document.getElementById('updateAvailabilityDateTime');
    const submitButton = document.getElementById('submitButton');

    doctorDropdown.value = '';
    availabilityDateTimeInput.value = '';
    isAvailableInput.checked = false;
    updateDoctorId.value = '';
    updateAvailabilityDateTime.value = '';
    submitButton.textContent = 'Add Availability';
}
