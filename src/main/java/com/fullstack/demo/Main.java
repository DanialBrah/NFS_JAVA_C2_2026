package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.model.CourseOffering;
import com.fullstack.demo.model.Instructor;
import com.fullstack.demo.model.Student;

public class Main {
    public static void main(String[] args) {
        Instructor instructor1 = new Instructor("I001", "Alice Johnson", "Java Development");
        Instructor instructor2 = new Instructor("I002", "Bob Smith", "React Development");

        Course course1 = new Course("C001", "Java Fundamentals", 14, "Beginner");
        Course course2 = new Course("C002", "React Frontend Development", 21, "Intermediate");

        Student student1 = new Student("S001", "Charlie Brown", "cFq0l@example.com");
        Student student2 = new Student("S002", "Daisy Duck", "d4oQG@example.com");

        course1.setInstructor(instructor1);
        course2.setInstructor(instructor2);

        System.out.println("Instructor Profiles:");
        instructor1.printProfile();
        instructor2.printProfile();

        System.out.println("Course Summaries:");
        course1.printSummary();
        course2.printSummary();

        System.out.println("Student Profiles:");
        student1.printProfile();
        student2.printProfile();

        CourseOffering offering1 = new CourseOffering("OFF001", "Java Fundamentals - June 2026 Intake",
                course1, instructor1, "2026-06-19", "2026-08-19", 25, "Physical");
        CourseOffering offering2 = new CourseOffering("OFF002", "React Frontend Development - July 2026 Intake",
                course2, instructor2, "2026-07-01", "2026-09-01", 30, "Online");

        System.out.println("Course Offerings:");
        offering1.printSummary();
        System.out.println();
        offering2.printSummary();
    }
}
