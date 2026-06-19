# Java-React-Class

## Day 1 Exercise 01 - Code Explanation

### Questions and Answers

**1. What is the purpose of Course.java?**
The Course class represents a course in the educational system. It stores course information like the course name and course code. It also maintains a relationship with an Instructor object, allowing a course to be assigned an instructor. This class demonstrates the concept of objects holding references to other objects.

**2. What is the purpose of Instructor.java?**
The Instructor class represents a person who teaches courses. It stores instructor-specific information like name, email, and department. This class demonstrates how to create an object with multiple fields (properties) and methods to retrieve that information.

**3. What is the purpose of Student.java?**
The Student class represents a person enrolled in courses. It stores student-specific information like name, student ID, enrolled course, and GPA. This class demonstrates how students can be associated with courses and how to track their academic performance.

**4. What does the constructor do?**
A constructor is a special method that runs when an object is created. For example, in `Student.java`, the constructor `public Student(String name, String studentID)` initializes the student object by:
- Accepting parameters (name and studentID)
- Setting the instance fields to the provided values
- Initializing other fields with default values (enrolledCourse = null, gpa = 0.0)

Without a constructor, you wouldn't have a way to set up the initial state of an object.

**5. Why are the fields marked as private?**
Fields are marked as private for **encapsulation** - a core principle of object-oriented programming. This means:
- External code cannot directly access or modify these fields
- Data protection: prevents accidental or malicious changes
- We provide public getter/setter methods for controlled access
- Example: In `Student.java`, instead of allowing direct access to `gpa`, we control it through the `setGPA()` and `getGPA()` methods

**6. What does `course1.assignInstructor(instructor1);` mean?**
This line calls the `assignInstructor()` method on the `course1` object, passing `instructor1` as an argument. This creates a **relationship** between the course and the instructor - the course now "knows" who its instructor is. This is an example of **object association**: one object (Course) holds a reference to another object (Instructor).

**7. What does `student1.printProfile();` do?**
This method call prints out the complete profile of a student in a formatted way. It displays:
- The student's name
- Student ID
- GPA
- The course they're enrolled in (if any)

This demonstrates how methods can be used to display object information in a user-friendly format.

### AI-Assisted Explanation

**One AI explanation that helped:**
"In Java, a class is like a blueprint (similar to a struct in C++ or a class in Python), and an object is an instance of that blueprint. When you write `Student student1 = new Student("John", "S001");`, you're creating a new object (instance) from the Student blueprint. The `new` keyword allocates memory and calls the constructor to initialize it."

**One part I still needed to understand deeper:**
The concept of **object references and relationships** - specifically how `Course` holds a reference to `Instructor` and how these objects interact through method calls. Understanding when to use composition (has-a relationship) vs inheritance (is-a relationship) requires more practice with real examples.

---

### Running the Code
1. Create all the Java files (Course.java, Instructor.java, Student.java, Main.java) in this directory
2. Compile: `javac *.java`
3. Run: `java Main`

Expected output will show course information, instructor details, and student profiles.