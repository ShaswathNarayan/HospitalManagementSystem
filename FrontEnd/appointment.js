document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('doctorId');
    const patientId = urlParams.get('patientId');

    if (!doctorId || !patientId) {
        alert('Missing doctor or patient ID.');
        return;
    }

    document.getElementById('doctorId').value = doctorId;
    document.getElementById('patientId').value = patientId;

    fetchDoctorAvailability(doctorId);
});

let selectedAppointment = null; // Variable to store the selected appointment details

async function fetchDoctorAvailability(doctorId) {
    try {
        const response = await fetch(`http://localhost:9000/doctorAvailability/${doctorId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        displayDoctorAvailability(data);
    } catch (error) {
        console.error('Error fetching doctor availability:', error);
        alert(`Error fetching doctor availability: ${error.message}`);
    }
}

function displayDoctorAvailability(data) {
    const tableBody = document.getElementById('availabilityTableBody');
    tableBody.innerHTML = '';

    data.forEach(entry => {
        const row = document.createElement('tr');

        const dateTimeCell = document.createElement('td');
        const dateTime = new Date(entry.availabilityDateTime);

        // Format the date as DD-MM-YYYY
        const date = `${String(dateTime.getDate()).padStart(2, '0')}-${String(dateTime.getMonth() + 1).padStart(2, '0')}-${dateTime.getFullYear()}`;

        // Format the time as HH:MM
        let hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        const formattedMinutes = String(minutes).padStart(2, '0');
        const time = `${String(hours).padStart(2, '0')}:${formattedMinutes}`;

        // Combine date and time
        const formattedDateTime = `${date} ${time}`;
        dateTimeCell.textContent = formattedDateTime;
        row.appendChild(dateTimeCell);

        const availableCell = document.createElement('td');
        availableCell.textContent = entry.available ? 'Yes' : 'No';
        row.appendChild(availableCell);

        const actionCell = document.createElement('td');
        if (entry.available) {
            const selectButton = document.createElement('button');
            selectButton.textContent = 'Select';
            selectButton.addEventListener('click', () => selectTimeSlot(entry.availabilityDateTime));
            actionCell.appendChild(selectButton);
        }
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}
function selectTimeSlot(dateTime) {
    const patientId = document.getElementById('patientId').value;
    const doctorId = document.getElementById('doctorId').value;

    // Generate or retrieve the appointment ID (assuming it's generated here)
    const appointmentId = generateAppointmentId(); // You need to implement this function

    // Store the appointment details in a variable
    selectedAppointment = {
        appointmentId: appointmentId,
        patient: { patientId: parseInt(patientId) },
        doctor: { doctorId: parseInt(doctorId) },
        appointmentDateTime: dateTime,
        appointmentStatus: 'Pending'
    };

    alert('Time slot selected: ' + dateTime);
}

function generateAppointmentId() {
    // Implement logic to generate or retrieve appointment ID
    // For example, you can use a timestamp or a unique identifier
    return /* Generated appointment ID */;
}

async function makeAppointment(event) {
    event.preventDefault();

    // Check if an appointment has been selected
    if (!selectedAppointment) {
        alert('Please select an available time slot.');
        return;
    }

    try {
        const response = await fetch('http://localhost:9000/appointment/add', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedAppointment)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        // Fetch doctor details after appointment is booked
        const doctorDetails = await fetchDoctorDetails(selectedAppointment.doctor.doctorId);
        if (!doctorDetails) {
            alert('Doctor details not found.');
            return;
        }

        // Inside the makeAppointment function, after successful booking and alert:
        alert(`Appointment is successful, waiting for admin confirmation!\nDoctor Name: ${doctorDetails.doctorName}\nSpecialization: ${doctorDetails.doctorSpecialization}\nAppointment DateTime: ${selectedAppointment.appointmentDateTime}\nAppointment Status: ${selectedAppointment.appointmentStatus}`);

    // Add this line to redirect:
    redirectToViewAppointment();
        
        // Update doctor availability after successful appointment
        await updateDoctorAvailability(selectedAppointment.doctor.doctorId, selectedAppointment.appointmentDateTime, false);
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert(`Error booking appointment: ${error.message}`);
    }
}

async function updateDoctorAvailability(doctorId, dateTime, available) {
    try {
        const response = await fetch(`http://localhost:9000/doctorAvailability/update/${doctorId}/${dateTime}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ available: available })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        console.log('Doctor availability updated successfully.');
    } catch (error) {
        console.error('Error updating doctor availability:', error);
        alert(`Error updating doctor availability: ${error.message}`);
    }
}

async function fetchDoctorDetails(doctorId) {
    try {
        const response = await fetch(`http://localhost:9000/doctor/${doctorId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const doctorDetails = await response.json();
        return doctorDetails;
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        alert(`Error fetching doctor details: ${error.message}`);
    }
}

async function viewAppointmentDetails() {
    const appointmentId = document.getElementById('appointmentIdInput').value;
    if (!appointmentId) {
        alert('Please enter an appointment ID.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:9000/appointment/${appointmentId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const appointmentDetails = await response.json();
        displayAppointmentDetails(appointmentDetails);
    } catch (error) {
        console.error('Error fetching appointment details:', error);
        alert(`Error fetching appointment details: ${error.message}`);
    }
}

function displayAppointmentDetails(appointmentDetails) {
    const appointmentDetailsSection = document.getElementById('appointmentDetailsSection');
    const appointmentDetailsContent = document.getElementById('appointmentDetailsContent');

    appointmentDetailsContent.textContent = `
        Appointment ID: ${appointmentDetails.appointmentId}
        Doctor Name: ${appointmentDetails.doctor.doctorName}
        Specialization: ${appointmentDetails.doctor.doctorSpecialization}
        Appointment DateTime: ${appointmentDetails.appointmentDateTime}
        Appointment Status: ${appointmentDetails.appointmentStatus}
    `;

    appointmentDetailsSection.style.display = 'block';
}
function redirectToViewAppointment() {
    const doctorId = document.getElementById('doctorId').value;
    const patientId = document.getElementById('patientId').value;
    
    // Redirect to the viewappointment.html page with parameters in the URL
    window.location.href = `viewappointment.html?doctorId=${doctorId}&patientId=${patientId}`;
}

