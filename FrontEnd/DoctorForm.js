document.addEventListener('DOMContentLoaded', function() {
    // Your JavaScript code here
    // Add event listeners, define functions, etc.

    function addDetails(event) {
        event.preventDefault(); 
    
        // Retrieve form values
        const doctorId = document.getElementById('doctorId').value.trim(); // Assuming the ID is present in a hidden field
        const doctorName = document.getElementById('doctorName').value.trim();
        const doctorContact = document.getElementById('doctorContact').value.trim();
        const doctorSpec = document.getElementById('doctorSpecialization').value.trim();
        const doctorFee = parseFloat(document.getElementById('doctorConsultationFee').value.trim());
    
        const data = {
            doctorName,
            doctorContact,
            doctorSpecialization: doctorSpec,
            doctorConsultationFee: doctorFee
        };
    
        let url = 'http://localhost:9000/doctor/add';
        let method = 'POST';
    
        // If doctorId is present, it means we're updating an existing record
        if (doctorId) {
            url = `http://localhost:9000/doctor/update/${doctorId}`;
            method = 'PUT';
        }
    
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                if (method === 'POST') {
                    alert('Doctor details submitted successfully!');
                } else {
                    alert('Doctor details updated successfully!');
                }
                document.getElementById('DoctorForm').reset();
                fetchDoctorRecords();
            } else {
                console.error('Error submitting doctor details:', response.statusText);
                alert('Error submitting doctor details.');
            }
        })
        .catch(error => {
            console.error('Error submitting doctor details:', error);
            alert('An error occurred while submitting doctor details.');
        });
    }
    
    
    // Add event listener to the form submission
    document.getElementById('DoctorForm').addEventListener('submit', addDetails);

    // Function to fetch and display doctor records
    function fetchDoctorRecords() {
        fetch('http://localhost:9000/doctor/getAll')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#doctorTable tbody');
                tableBody.innerHTML = ''; 

                // Iterate through doctor data and add rows to the table
                data.forEach(doctor => {
                    const row = document.createElement('tr');
                    row.setAttribute('data-doctor-id', doctor.doctorId); // Add data attribute for doctor ID

                    // Add cells for each doctor property
                    const doctorIdCell = document.createElement('td');
                    doctorIdCell.textContent = doctor.doctorId;

                    const doctorNameCell = document.createElement('td');
                    doctorNameCell.textContent = doctor.doctorName;

                    const doctorContactCell = document.createElement('td');
                    doctorContactCell.textContent = doctor.doctorContact;

                    const doctorSpecIdCell = document.createElement('td');
                    doctorSpecIdCell.textContent = doctor.doctorSpecialization;

                    const doctorConsultationFeeCell = document.createElement('td');
                    doctorConsultationFeeCell.textContent = doctor.doctorConsultationFee.toFixed(2);

                    const actionCell = document.createElement('td');

                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Update';
                    updateButton.addEventListener('click', () => {
                        // Populate the form fields with the selected doctor's data
                        document.getElementById('doctorId').value = doctor.doctorId;
                        document.getElementById('doctorName').value = doctor.doctorName;
                        document.getElementById('doctorContact').value = doctor.doctorContact;
                        document.getElementById('doctorSpecialization').value = doctor.doctorSpecialization;
                        document.getElementById('doctorConsultationFee').value = doctor.doctorConsultationFee;
                    });

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => {
                        // Call the deleteDoctorInfo function with the doctor ID
                        deleteDoctorInfo(doctor.doctorId);
                    });

                    actionCell.appendChild(updateButton);
                    actionCell.appendChild(deleteButton);

                    row.appendChild(doctorIdCell);
                    row.appendChild(doctorNameCell);
                    row.appendChild(doctorContactCell);
                    row.appendChild(doctorSpecIdCell);
                    row.appendChild(doctorConsultationFeeCell);
                    row.appendChild(actionCell);

                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching doctor records:', error);
                alert('Error fetching doctor records.');
            });
    }

    // Fetch and display doctor records when the page loads
    fetchDoctorRecords();

    // Function to delete a doctor record
    function deleteDoctorInfo(doctorId) {
        const confirmDelete = confirm('Are you sure you want to delete this doctor record?');
        if (!confirmDelete) {
            return; // If user cancels, exit the function
        }
        
        fetch(`http://localhost:9000/doctor/delete/${doctorId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Doctor record deleted successfully.');
                fetchDoctorRecords();
            } else {
                console.error('Failed to delete doctor record:', response.status, response.statusText);
                alert('Failed to delete doctor record. Please try again later.');
            }
        })
        .catch(error => {
            console.error('Error deleting doctor record:', error);
            alert('An error occurred while deleting the doctor record. Please try again later.');
        });
    }

    // Function to update doctor details
    function updateDoctorInfo(event) {
        event.preventDefault(); 

        const doctorId = document.getElementById('doctorId').value;
        const doctorName = document.getElementById('doctorName').value.trim();
        const doctorContact = document.getElementById('doctorContact').value.trim();

        const data = {
            doctorName,
            doctorContact
        };

        fetch(`http://localhost:9000/doctor/update/${doctorId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                alert('Doctor details updated successfully');
                fetchDoctorRecords();
                document.getElementById('DoctorForm').reset(); // Reset the form after updating
            } else {
                console.error('Failed to update doctor details:', response.statusText);
                alert('Failed to update doctor details. Please check the server response.');
            }
        })
        .catch(error => {
            console.error('Error updating doctor details:', error);
            alert('Error updating doctor details.');
        });
    }

    // Add event listener to update button
    document.getElementById('updateButton').addEventListener('click', function() {
        // Get the doctorId from the data attribute of the row
        const doctorId = document.querySelector('#doctorTable tbody tr.selected').getAttribute('data-doctor-id');

        // Fetch the doctor record based on the ID
        fetch(`http://localhost:9000/doctor/get/${doctorId}`)
            .then(response => response.json())
            .then(doctor => {
                // Populate form fields with doctor data
                document.getElementById('doctorId').value = doctorId; // Set the doctorId in a hidden input field
                document.getElementById('doctorName').value = doctor.doctorName;
                document.getElementById('doctorContact').value = doctor.doctorContact;
                document.getElementById('doctorSpecialization').value = doctor.doctorSpecialization;
                document.getElementById('doctorConsultationFee').value = doctor.doctorConsultationFee;
            })
            .catch(error => {
                console.error('Error fetching doctor details for update:', error);
                alert('Error fetching doctor details for update.');
            });
    });
});
function redirectToAvailabilityPage(){
    window.location.href = 'doctorAvailability.html';
}