const baseUrl = 'http://localhost:9000';

// Function to display doctor details
function displayDoctorDetails() {
    fetch(`${baseUrl}/doctor/getAll`)
        .then(response => response.json())
        .then(data => {
            const doctorList = document.getElementById('doctorTable');
            const tbody = doctorList.querySelector('tbody');
            
            // Clear existing rows
            tbody.innerHTML = '';
            
            // Append data rows
            data.forEach(doctor => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${doctor.doctorName}</td>
                                 <td>${doctor.doctorSpecialization}</td>
                                 <td>${doctor.doctorContact}</td>
                                 <td>${doctor.doctorConsultationFee.toFixed(2)}</td>
                                 <td>
                                    <button class="selectDoctorButton" data-doctor-id="${doctor.doctorId}">Select</button>
                                    <button class="updateDoctorButton" data-doctor-id="${doctor.doctorId}">Update</button>
                                 </td>`;
                tbody.appendChild(row);
            });

            const selectDoctorButtons = document.querySelectorAll('.selectDoctorButton');
            selectDoctorButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const doctorId = this.getAttribute('data-doctor-id');
                    window.location.href = `patientform.html?doctorId=${doctorId}`;
                });
            });

            const updateDoctorButtons = document.querySelectorAll('.updateDoctorButton');
            updateDoctorButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const doctorId = this.getAttribute('data-doctor-id');
                    window.location.href = `DoctorForm.html?doctorId=${doctorId}`;
                });
            });

        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching doctor details.');
        });
}

// Call the function to display doctor details when the page loads
displayDoctorDetails();
