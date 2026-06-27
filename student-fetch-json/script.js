const statusMessage = document.getElementById("status-message");
const studentList = document.getElementById("student-list");

function renderStudents(students) {
    studentList.innerHTML = "";

    students.forEach((student) => {
        const card = document.createElement("div");
        card.innerHTML = `
            <p>Student ID: ${student.studentId}</p>
            <p>Name: ${student.studentName}</p>
            <p>Email: ${student.email}</p>
            <p>Status: ${student.status}</p>
        `;
        studentList.appendChild(card);
    });
}

async function loadStudents() {
    statusMessage.textContent = "Loading students...";

    try {
        const response = await fetch("students.json");

        if (!response.ok) {
            throw new Error("Failed to load student data.");
        }

        const students = await response.json();

        statusMessage.textContent = "";
        renderStudents(students);
    } catch (error) {
        statusMessage.textContent = "Error: " + error.message;
    }
}

loadStudents();
