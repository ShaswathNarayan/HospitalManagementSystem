document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('PatientForm');
    const doctorId = new URLSearchParams(window.location.search).get('doctorId');
    document.getElementById('doctorId').value = doctorId;

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const patientId = document.getElementById('patientId').value;
        const data = {
            patientName: document.getElementById('name').value,
            patientAge: parseInt(document.getElementById('age').value),
            patientBloodGroup: document.getElementById('bloodgroup').value,
            patientGender: document.getElementById('gender').value,
            patientContact: document.getElementById('contact').value
        };

        const url = patientId ? `http://localhost:9000/patient/update/${patientId}` : 'http://localhost:9000/patient/add';
        const method = patientId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                alert(patientId ? 'Patient details updated successfully!' : 'Patient details submitted successfully!');
                form.reset();
                fetchPatientDetails();
            } else {
                alert('Error submitting patient details.');
                console.error('Response status:', response.status, 'Response:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting patient details.');
        });
    });

    document.getElementById('appointmentButton').addEventListener('click', function() {
        const patientId = document.getElementById('patientId').value;
        window.location.href = `appointment.html?doctorId=${doctorId}&patientId=${patientId}`;
    });

    function fetchPatientDetails() {
        fetch('http://localhost:9000/patient/getAll')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('table tbody');
                tableBody.innerHTML = '';
                data.forEach(patient => {
                    const row = document.createElement('tr');
                    row.setAttribute('data-patient-id', patient.patientId);

                    const patientIdCell = document.createElement('td');
                    patientIdCell.textContent = patient.patientId;

                    const patientNameCell = document.createElement('td');
                    patientNameCell.textContent = patient.patientName;

                    const patientAgeCell = document.createElement('td');
                    patientAgeCell.textContent = patient.patientAge;

                    const patientBloodGroupCell = document.createElement('td');
                    patientBloodGroupCell.textContent = patient.patientBloodGroup;

                    const patientGenderCell = document.createElement('td');
                    patientGenderCell.textContent = patient.patientGender;

                    const patientContactCell = document.createElement('td');
                    patientContactCell.textContent = patient.patientContact;

                    const actionCell = document.createElement('td');

                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Update';
                    updateButton.addEventListener('click', () => {
                        document.getElementById('patientId').value = patient.patientId;
                        document.getElementById('name').value = patient.patientName;
                        document.getElementById('age').value = patient.patientAge;
                        document.getElementById('bloodgroup').value = patient.patientBloodGroup;
                        document.getElementById('gender').value = patient.patientGender;
                        document.getElementById('contact').value = patient.patientContact;
                    });

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => {
                        deletePatient(patient.patientId);
                    });

                    actionCell.appendChild(updateButton);
                    actionCell.appendChild(deleteButton);

                    row.appendChild(patientIdCell);
                    row.appendChild(patientNameCell);
                    row.appendChild(patientAgeCell);
                    row.appendChild(patientBloodGroupCell);
                    row.appendChild(patientGenderCell);
                    row.appendChild(patientContactCell);
                    row.appendChild(actionCell);

                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching patient details:', error);
                alert('Error fetching patient details.');
            });
    }

    function deletePatient(patientId) {
        const confirmDelete = confirm('Are you sure you want to delete this patient?');
        if (!confirmDelete) {
            return;
        }

        fetch(`http://localhost:9000/patient/delete/${patientId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Patient deleted successfully.');
                fetchPatientDetails();
            } else {
                alert('Error deleting patient.');
                console.error('Response status:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error deleting patient:', error);
            alert('Error deleting patient.');
        });
    }

    fetchPatientDetails();
});
