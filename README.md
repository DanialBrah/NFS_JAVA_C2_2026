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

## Day 1 Exercise 03 - Add a CourseOffering Class

### Question: Why is CourseOffering more useful than using only Course when building a real web application?

A `Course` is just a template — e.g. "Java Fundamentals" — but in a real system the same course can run many times, with different instructors, dates, and capacities. If we only had `Course`, we couldn't represent two different intakes of the same course at the same time, or track which specific run a student enrolled in.

`CourseOffering` separates "what is taught" (the `Course`) from "when/how/by whom it is delivered" (the offering). This matches how scheduling, enrollment, and capacity actually work on a real platform:

- The same `Course` can have multiple `CourseOffering`s (different intakes/dates).
- Each offering can have its own instructor, start/end dates, capacity, and delivery mode (Physical/Online/Hybrid).
- Students enroll in a specific `CourseOffering`, not just a `Course`, so the system can track seats remaining and schedule conflicts correctly.

This mirrors how the project will later map onto a Spring Boot + MongoDB + React stack, where `Course` and `CourseOffering` would likely be separate collections/documents with a reference between them.

### AI-Assisted Note

Used AI (Claude Code) to scaffold `CourseOffering.java` following the same style as the existing `Course`/`Instructor`/`Student` classes, wire it into `Main.java` with two sample offerings, and verify the program compiles and runs correctly.


Before submitting, check:

- [/] `CourseOffering.java` exists.
- [/] The class has all required fields.
- [/] Getter methods are included.
- [/] Constructor is working.
- [/] `printOfferingSummary()` works.
- [/] `Main.java` creates at least two course offerings.
- [/] Program runs successfully.
- [/] Code has been committed and pushed to GitHub.
- [/] README reflection is completed.

## Day 3 Exercise 01 - Build and Trace the Code Flow

### Question: When `getCourseById("C004")` is called, which file does the request go to first, second, and third?

1. **First** - `CodeFlowPractice.java` (the demo class): it calls `courseService.getCourseById("C004")`.
2. **Second** - `CourseService.java`: its `getCourseById` method receives the call and delegates to `courseRepository.findById("C004")`.
3. **Third** - `InMemoryCourseRepository.java`: its `findById` method looks up the course in the underlying `LinkedHashMap` and returns an `Optional<Course>`, which `CourseService` unwraps (or throws `CourseNotFoundException` if empty) before returning the `Course` back up to the demo class.

Before submitting, check:

- [/] `CodeFlowPractice.java` exists.
- [/] Repository and service are created correctly.
- [/] Course `C004` is created through `CourseService`.
- [/] Course `C004` is retrieved through `CourseService`.
- [/] Course details are printed.
- [/] Code contains trace comments explaining the flow.
- [/] Code compiles and runs.

## Day 3 Exercise 02 - Interface and Repository Storage Practice

### Question: Why is `InMemoryCourseRepository` temporary storage? What would probably replace it later when we use MongoDB?

`InMemoryCourseRepository` stores everything in a `LinkedHashMap` that lives only in the JVM's memory. As soon as the program stops running, the map and every course inside it are gone - nothing is written to disk, so there is no persistence across restarts. It's also single-instance only: it can't be shared across multiple servers.

Because the rest of the code talks to `CourseRepository` (the interface), not `InMemoryCourseRepository` (the class) directly, swapping the storage later is just a matter of writing a new implementation - e.g. `MongoCourseRepository` - that implements the same `save`, `findById`, `findAll`, `deleteById`, and `existsById` methods but backs them with real MongoDB collection calls (`insertOne`, `find`, etc.) instead of a `Map`. `CourseService` and the demo classes wouldn't need to change at all, since they only depend on the `CourseRepository` interface.

Before submitting, check:

- [/] `RepositoryPractice.java` exists.
- [/] Used `CourseRepository courseRepository = new InMemoryCourseRepository();`.
- [/] Saved at least three courses through the repository.
- [/] Printed all courses using a loop.
- [/] Used `Optional<Course>` when finding by ID.
- [/] Used `existsById()`.
- [/] Code compiles and runs.

## Day 3 Exercise 03 - Exception Practice with CourseService

### Question: Why is throwing `CourseNotFoundException` better than printing inside `CourseService`?

If `CourseService` printed `"Course not found"` directly, that decision would be baked into the service forever - every caller would be stuck with a console message whether it wanted one or not. By throwing `CourseNotFoundException` instead, the service just reports that something went wrong and lets the **caller** decide how to present it:

- A console app (like `ExceptionPractice.java`) can catch it and print a friendly line.
- A Spring Boot REST controller can catch it and return a `404 Not Found` JSON response.
- A React frontend can catch the API error and show a toast or inline message in the UI.

One exception, three completely different presentations - none of which `CourseService` needs to know or care about. That separation is also what keeps the service testable: a unit test can assert that the exception was thrown without parsing console output.

Before submitting, check:

- [/] `ExceptionPractice.java` exists.
- [/] Created `CourseService` correctly.
- [/] Added at least two courses.
- [/] Successfully printed one existing course.
- [/] Handled `C999` using `try/catch`.
- [/] Handled another missing course ID using `try/catch`.
- [/] Program does not crash.

## Day 3 Exercise 04 - Object Relationships and Composition

### Question: Why is `CourseOffering` a better design than putting start date, end date, and capacity directly inside `Course`?

A `Course` is a template - e.g. "Java Fundamentals" - and that template doesn't change no matter how many times it runs. But in real life, the same course gets taught over and over with different dates, instructors, and capacities (see `OFF001` and `OFF003` both reusing the same `javaCourse` object). If start date, end date, and capacity lived inside `Course`, the course could only ever represent one single run at a time - we couldn't show two intakes happening in different months without making duplicate `Course` objects with the same title.

`CourseOffering` keeps "what is taught" (`Course`) separate from "when/how/by whom it's delivered" (the offering), which is exactly composition: `CourseOffering` *has a* `Course` and *has an* `Instructor` instead of repeating their data as plain text fields. That means students enroll in a specific offering (with its own seats and schedule), while the underlying course stays a single reusable definition.

Before submitting, check:

- [/] Created two instructors.
- [/] Created two courses.
- [/] Assigned instructors to courses.
- [/] Created two course offerings.
- [/] Printed all course offerings.
- [/] Code comments explain composition.
- [/] Code compiles and runs.

## Day 3 Exercise 05 - Write Search Using Loop, Then Compare with Stream

### Question: Which version is easier to understand: loop or stream? Why?

The loop version (`searchByLevelUsingLoop`) is easier to understand at first, because every step is spelled out: create an empty list, go through each course one at a time, check a condition, add it if it matches, then return the list. You can follow it line by line like a recipe.

The stream version (`searchByLevelUsingStream`) does the same thing in fewer lines, but it hides those steps behind method calls (`filter`, `toList`). It's faster to write and read once you already know what `filter` and `toList` do, but it's harder to follow if you're new to streams, since there's no visible loop or list-building happening.

### Question: What does `filter()` do in a stream?

`filter()` goes through each item in the stream and keeps only the ones that match a condition (a boolean test) you give it - any item where the condition is `false` gets dropped from the stream. It's basically the stream version of the `if` check inside a loop: in `searchByLevelUsingLoop`, the `if (course.getLevel().equalsIgnoreCase(safeLevel))` check is doing the exact same job that `.filter(course -> course.getLevel().equalsIgnoreCase(safeLevel))` does in the stream version.

Before submitting, check:

- [/] `searchByLevelUsingLoop()` is added to `CourseService`.
- [/] The method uses `ArrayList`.
- [/] The method uses a normal `for` loop.
- [/] The method handles `null` safely.
- [/] The demo class creates at least four courses.
- [/] The demo class prints only matching courses.
- [/] Code compiles and runs.
