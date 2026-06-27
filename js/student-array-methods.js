// to run, type: node student-array-methods.js

const students = [
    { studentId: "S001", studentName: "Ignacio de Paul", email: "ignacio@example.com", status: "Active" },
    { studentId: "S002", studentName: "Ben Tan", email: "ben@example.com", status: "Inactive" },
    { studentId: "S003", studentName: "Chong Mei", email: "mei@example.com", status: "Active" }
];

console.log("=== Original Students ===");
console.log(students);

console.log();
console.log("=== All Student Names ===");
students.forEach((student) => {
    console.log(student.studentName);
});

console.log();
console.log("=== Active Students ===");
const activeStudents = students.filter((student) => student.status === "Active");
console.log(activeStudents);

console.log();
console.log("=== Find Student S002 ===");
const foundStudent = students.find((student) => student.studentId === "S002");
console.log(foundStudent);

console.log();
console.log("=== Student Emails ===");
const studentEmails = students.map((student) => student.email);
console.log(studentEmails);

console.log();
console.log("=== After push ===");
const newLengthAfterPush = students.push({
    studentId: "S004",
    studentName: "Danish Nawaz",
    email: "danish@example.com",
    status: "Active"
});
console.log(students);
console.log(`New length after push: ${newLengthAfterPush}`);

console.log();
console.log("=== After pop ===");
const removedLastStudent = students.pop();
console.log(students);
console.log("Removed last student:");
console.log(removedLastStudent);

console.log();
console.log("=== After unshift ===");
const newLengthAfterUnshift = students.unshift({
    studentId: "S000",
    studentName: "Ignacio de Paul",
    email: "ignacio@example.com",
    status: "Active"
});
console.log(students);
console.log(`New length after unshift: ${newLengthAfterUnshift}`);

console.log();
console.log("=== After shift ===");
const removedFirstStudent = students.shift();
console.log(students);
console.log("Removed first student:");
console.log(removedFirstStudent);

console.log();
console.log("=== Final Students Array ===");
console.log(students);
