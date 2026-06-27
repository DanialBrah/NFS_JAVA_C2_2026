// to run, type: node student-functions.js

const student = {
    studentId: "S001",
    studentName: "Aina Rahman",
    email: "aina@example.com",
    status: "Active"
};

function formatStudent(student) {
    return `${student.studentId} - ${student.studentName} (${student.status})`;
}

const getStudentEmail = (student) => {
    return student.email;
};

const getStudentStatus = (student) => student.status;

console.log(formatStudent(student));
console.log(getStudentEmail(student));
console.log(getStudentStatus(student));
