document.addEventListener('DOMContentLoaded', function() {
    fetchAppointments();
});

async function fetchAppointments() {
    try {
        const response = await fetch('http://localhost:9000/appointment/getAll');
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const appointments = await response.json();
        displayAppointments(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        alert(`Error fetching appointments: ${error.message}`);
    }
}

function displayAppointments(appointments) {
    const tableBody = document.getElementById('appointmentTableBody');
    tableBody.innerHTML = '';

    appointments.forEach(appointment => {
        const row = document.createElement('tr');

        // Display appointmentId
        const appointmentIdCell = document.createElement('td');
        appointmentIdCell.textContent = appointment.appointmentId;
        row.appendChild(appointmentIdCell);

        // Display appointmentDateTime
        const appointmentDateTimeCell = document.createElement('td');
        const appointmentDateTime = new Date(appointment.appointmentDateTime);
        const formattedDateTime = appointmentDateTime.toLocaleString(); // Adjust date format as needed
        appointmentDateTimeCell.textContent = formattedDateTime;
        row.appendChild(appointmentDateTimeCell);

        // Display patientId
        const patientCell = document.createElement('td');
        if (appointment.patient) {
            patientCell.textContent = appointment.patient.patientId;
        } else {
            patientCell.textContent = 'N/A';
        }
        row.appendChild(patientCell);

        // Display doctorId
        const doctorCell = document.createElement('td');
        if (appointment.doctor) {
            doctorCell.textContent = appointment.doctor.doctorId;
        } else {
            doctorCell.textContent = 'N/A';
        }
        row.appendChild(doctorCell);

        // Display appointmentStatus
        const appointmentStatusCell = document.createElement('td');
        appointmentStatusCell.textContent = appointment.appointmentStatus ? appointment.appointmentStatus : 'N/A';
        row.appendChild(appointmentStatusCell);

        // Action buttons
        const actionCell = document.createElement('td');

        // Schedule button
        const scheduleButton = document.createElement('button');
        scheduleButton.textContent = 'Schedule';
        scheduleButton.onclick = () => updateAppointmentStatus(appointment.appointmentId, 'Scheduled');
        actionCell.appendChild(scheduleButton);

        // Reschedule button
        const rescheduleButton = document.createElement('button');
        rescheduleButton.textContent = 'Reschedule';
        rescheduleButton.onclick = () => updateAppointmentStatus(appointment.appointmentId, 'Rescheduled');
        actionCell.appendChild(rescheduleButton);

        // Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = () => updateAppointmentStatus(appointment.appointmentId, 'Cancelled');
        actionCell.appendChild(cancelButton);

        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

async function updateAppointmentStatus(appointmentId, status) {
    try {
        // Fetch the existing appointment details
        const response = await fetch(`http://localhost:9000/appointment/${appointmentId}`);
        if (!response.ok) {
            throw new Error(`Error fetching appointment: ${response.status}`);
        }
        const appointment = await response.json();

        // Create an object with the updated status and existing details
        const updatedAppointment = {
            ...appointment,
            appointmentStatus: status
        };

        // Send the updated appointment object back to the server
        const updateResponse = await fetch(`http://localhost:9000/appointment/update/${appointmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAppointment),
        });

        if (!updateResponse.ok) {
            throw new Error(`Error updating appointment: ${updateResponse.status}`);
        }

        // If the status is updated to "Rescheduled", redirect back to the appointment page
        // If the status is updated to "Rescheduled", redirect back to the appointment page
        if (status === 'Rescheduled') {
            redirectToAppointmentPage(appointment.patient.patientId, appointment.doctor.doctorId);
        } else {
            alert(`Appointment ${appointmentId} updated to ${status}`);
            fetchAppointments(); // Refresh the appointments list
        }
    } catch (error) {
        console.error('Error updating appointment:', error);
        alert(`Error updating appointment: ${error.message}`);
    }
}

function redirectToAppointmentPage(patientId, doctorId) {
    // Construct the URL with query parameters
    const url = `appointment.html?patientId=${patientId}&doctorId=${doctorId}`;
    // Redirect to the appointment page with the parameters
    window.location.href = url;
}