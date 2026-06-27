const students = [
    { studentId: "S001", studentName: "Ignacio de Paul", email: "ignacio@example.com", status: "Active" },
    { studentId: "S002", studentName: "Ben Tan", email: "ben@example.com", status: "Inactive" },
    { studentId: "S003", studentName: "Chong Mei", email: "mei@example.com", status: "Active" },
    { studentId: "S004", studentName: "Danish Nawaz", email: "danish@example.com", status: "Active" }
];

const studentListDiv = document.getElementById("student-list");

students.forEach((student) => {
    const card = document.createElement("div");
    card.innerHTML = `
        <p>Student ID: ${student.studentId}</p>
        <p>Name: ${student.studentName}</p>
        <p>Email: ${student.email}</p>
        <p>Status: ${student.status}</p>
    `;
    studentListDiv.appendChild(card);
});
