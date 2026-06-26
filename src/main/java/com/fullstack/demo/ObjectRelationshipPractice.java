package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.model.CourseOffering;
import com.fullstack.demo.model.Instructor;

public class ObjectRelationshipPractice {
    public static void main(String[] args) {
        Instructor mike = new Instructor("I001", "Mike Rahman", "Java and Spring Boot");
        Instructor marcus = new Instructor("I002", "Marcus Lee", "React and Frontend Development");

        Course javaCourse = new Course("C001", "Java Fundamentals", 14, "Beginner");
        Course reactCourse = new Course("C002", "React Frontend Development", 21, "Intermediate");

        javaCourse.setInstructor(mike);
        reactCourse.setInstructor(marcus);

        System.out.println("=== Courses ===");
        System.out.println(javaCourse.getTitle() + " with " + javaCourse.getInstructor().getInstructorName());
        System.out.println(reactCourse.getTitle() + " with " + reactCourse.getInstructor().getInstructorName());

        System.out.println();
        System.out.println("=== Course Offerings ===");

        // CourseOffering uses composition because it has a Course and has an Instructor.
        CourseOffering offering1 = new CourseOffering(
                "OFF001", "Java Fundamentals June Intake",
                javaCourse, mike,
                "2026-06-29", "2026-06-30",
                25, "Physical");

        CourseOffering offering2 = new CourseOffering(
                "OFF002", "React Frontend July Intake",
                reactCourse, marcus,
                "2026-07-01", "2026-07-03",
                20, "Hybrid");

        // Extension task: OFF003 reuses the same Course (javaCourse) with a different
        // date/capacity, proving Course and CourseOffering are not the same thing -
        // one Course can have many separate offerings.
        CourseOffering offering3 = new CourseOffering(
                "OFF003", "Java Fundamentals July Weekend Intake",
                javaCourse, mike,
                "2026-07-18", "2026-07-19",
                15, "Online");

        offering1.printSummary();
        offering2.printSummary();
        offering3.printSummary();
    }
}
