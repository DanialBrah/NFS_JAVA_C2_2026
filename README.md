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

## Day 3 Exercise 06 - Build StudentService Using the Same Pattern as CourseService

### Question: How is `StudentService` similar to `CourseService`?

They follow the exact same structure: a constructor that receives a repository interface (`StudentRepository` / `CourseRepository`), a "register/create" method that checks for null and duplicates before saving, a `getXById()` method that uses `findById(...).orElseThrow(...)` to throw a custom not-found exception, a `getAllX()` method that just delegates to `findAll()`, and a `searchByXUsingLoop()` method that builds an `ArrayList` and filters with a plain `for` loop. Neither service stores data itself - both just coordinate validation and delegate storage to their repository.

### Question: Which file stores students temporarily while the program is running?

`InMemoryStudentRepository.java` - specifically the `Map<String, Student> students = new LinkedHashMap<>()` field inside it. Just like `InMemoryCourseRepository`, it only lives in memory, so all registered students disappear once the program stops.

Before submitting, check:

- [/] `StudentRepository.java` created.
- [/] `InMemoryStudentRepository.java` created.
- [/] `StudentNotFoundException.java` created.
- [/] `StudentService.java` created.
- [/] Demo class created.
- [/] At least 3 students are registered.
- [/] `getStudentById()` works for existing student.
- [/] Missing student is handled using exception.
- [/] Search by name works using loop.
- [/] Code compiles and runs.
- [/] Extension: `DuplicateStudentException` created and used in `registerStudent()`.
- [/] Extension: `searchByNameUsingStream()` added.

## Day 4 Exercise 01 - Create a JavaScript Student Object

### Question: What is one difference between a Java object and a JavaScript object?

A Java object always comes from a class - `Student` has fixed fields (`studentId`, `name`, `email`...) declared ahead of time, and you can only set or read them through the constructor and the getters/setters the class defines. A JavaScript object like `student` is just a plain `{}` literal: properties can be added, renamed, or removed at runtime, there's no compile-time check that `studentId` even exists, and you can read the same value with either dot notation (`student.studentId`) or bracket notation (`student["studentId"]`).

## Day 4 Exercise 02 - Store Instructors in an Array and Loop Through Them

### Question: How is a JavaScript array similar to Java ArrayList?

Both are dynamic, ordered collections that grow or shrink at runtime instead of needing a fixed size up front - you just call `.push()` on a JS array the same way you'd call `.add()` on an `ArrayList`. Both support iterating with a `for...of`/for-each style loop, and both give you a `.length`/`.size()` to know how many elements are stored. The difference is typing: an `ArrayList<Instructor>` only ever holds `Instructor` objects (checked at compile time), while a plain JS array like `instructors` could technically hold a mix of types since JavaScript doesn't enforce element types.

## Day 4 Exercise 03 - Write Functions and Arrow Functions for Student Data

### Question: Why are arrow functions important before learning React?

React components are themselves just functions, and almost every event handler, `.map()` callback, or `useEffect` you write in React is passed around as a value - arrow functions are the natural syntax for that because they're short expressions you can inline directly into JSX (e.g. `onClick={() => doSomething(student)}`). Just as importantly, arrow functions don't rebind `this` the way normal functions do, which avoids a whole class of "this is undefined" bugs that used to plague callback-heavy code before arrow functions existed. Getting comfortable writing `(student) => student.status`-style functions now means React's component and callback syntax won't feel like new material later - it's the same skill applied to JSX instead of plain objects.

## Day 4 Exercise 04 - Practise JavaScript Array Methods

### 1. What is the difference between filter, find, and map?

`filter` returns a **new array** containing every element that matches a condition (zero, one, or many). `find` returns just the **first matching element itself** (not wrapped in an array), or `undefined` if nothing matches. `map` doesn't filter anything - it returns a new array of the **same length** as the original, with every element transformed into something else (e.g. turning student objects into a list of email strings).

### 2. Which four array methods change the original array?

`push`, `pop`, `shift`, and `unshift`. `forEach`, `filter`, `find`, and `map` all leave the original array untouched.

### 3. What does push return?

The new length of the array after the item was added.

### 4. What does pop return?

The element that was removed (the last item in the array), or `undefined` if the array was already empty.

### 5. What is the difference between shift and unshift?

`shift` removes the **first** element from the array and returns that removed element. `unshift` adds one or more new elements to the **beginning** of the array and returns the new length - they act on the same end of the array but in opposite directions (remove vs. add).

## Day 4 Exercise 05 - Render Student Cards in HTML

### Question: What does the DOM allow JavaScript to do?

The DOM (Document Object Model) is the browser's live, in-memory representation of the HTML page as a tree of objects - it's what lets JavaScript reach into a page and read or change what's actually on screen *after* the page has loaded, instead of only being able to print to a console. In `script.js`, `document.getElementById("student-list")` grabs an existing element from that tree, `document.createElement("div")` builds a brand new node that doesn't exist in the original HTML yet, and `appendChild` inserts it into the page so the browser re-renders it visually. Without the DOM, JavaScript would have no way to turn an array of student objects into visible content - it's the bridge between data in a script and pixels in the browser.

## Day 4 Exercise 06 - Add Search to the Student List

### Question: How is JavaScript filter used in a search feature?

`filter` is exactly what a "live search" needs because it doesn't remove anything from the original data - it reads the full `students` array and returns a brand new array containing only the elements that match a condition, leaving `students` itself untouched so you can search again later without having lost any records. In `script.js`, clicking Search reads the typed keyword, lowercases it, and runs `students.filter((student) => student.studentName.toLowerCase().includes(keyword))` - each student is kept only if their name contains that keyword. That filtered array (which could even be empty) is then handed to `renderStudents()`, which redraws the cards from scratch - so the UI always reflects whatever subset `filter` just produced, and clicking Reset simply calls `renderStudents(students)` again with the untouched original array.

## Day 4 Exercise 07 - Load Students from a JSON File Using Fetch

### 1. What does async mean?

It marks a function as one that's allowed to pause and wait for something slow (like a network request) without blocking the rest of the page. An `async` function always returns a Promise under the hood, and only inside an `async` function can you use the `await` keyword.

### 2. What does await do?

It pauses execution of the `async` function on that line until the Promise it's waiting on settles, then unwraps the result so you can use it as a normal value on the next line - e.g. `const response = await fetch("students.json")` waits for the network request to finish before `response` is usable, instead of immediately moving on with a pending Promise.

### 3. What does fetch do?

It sends a request to get data from a URL or file path and returns a Promise that resolves to a `Response` object once the server (or, here, Live Server) responds. The response itself is just headers/status at that point - you still need a second step like `response.json()` to actually read and parse the body.

### 4. Why do we use fetch before connecting to a real backend API?

Loading `students.json` with `fetch("students.json")` exercises the exact same pattern - request, await, check `response.ok`, parse the body, handle errors with try/catch - that we'll use later with `fetch("http://localhost:8080/api/students")` against a real Spring Boot endpoint. Practicing it against a static file removes the variables of a real backend (server running, CORS, network failures) while still teaching the asynchronous flow, so by the time we connect to an actual API the syntax is already familiar and we can focus on the backend-specific parts.

### 5. Why should this exercise be run using Live Server?

Opening `index.html` by double-clicking it loads the page over the `file://` protocol, and browsers block `fetch()` from reading local files under `file://` for security reasons (no proper origin to apply CORS rules to) - the request either fails outright or gets blocked depending on the browser. Live Server serves the folder over real `http://`, giving the page an actual origin that `fetch("students.json")` is allowed to request from, which is exactly the same origin-based model a real backend API would use.
