// to run, type: node instructor-array.js

const instructors = [
    { instructorId: "I001", instructorName: "Ignacio de Paul", expertise: "Java and Spring Boot" },
    { instructorId: "I002", instructorName: "Roberto Tan", expertise: "React Development" },
    { instructorId: "I003", instructorName: "Juan Carlos Lee", expertise: "MongoDB" },
    { instructorId: "I004", instructorName: "Carlos Kim", expertise: "Testing" }
];

console.log("=== Instructor List ===");
for (const instructor of instructors) {
    console.log(`${instructor.instructorId} - ${instructor.instructorName} - ${instructor.expertise}`);
}

console.log();
console.log(`Total instructors: ${instructors.length}`);
