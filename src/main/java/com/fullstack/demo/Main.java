package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.model.CourseOffering;
import com.fullstack.demo.model.Instructor;
import com.fullstack.demo.model.Student;

public class Main {
    public static void main(String[] args) {
        // Create an instructor
        Instructor instructor1 = new Instructor("Dr. Alice Smith", "alice@school.com", "Computer Science");
        
        // Create courses
        Course course1 = new Course("Introduction to Java", "CS101", "Programming", true);
        
        // Assign instructor to course
        course1.assignInstructor(instructor1);
        course1.printSummary();

        // Create students
        Student student1 = new Student("John Doe", "S001");
        Student student2 = new Student("Jane Johnson", "S002");
        
        // Enroll students in course
        student1.enrollCourse(course1);
        student2.enrollCourse(course1);
        
        // Set GPAs
        student1.setGPA(3.8);
        student2.setGPA(3.9);
        
        // Print information
        System.out.println("=== Course Information ===");
        course1.printCourseInfo();
        System.out.println();
        
        System.out.println("=== Instructor Information ===");
        instructor1.printInstructorInfo();
        System.out.println();
        
        System.out.println("=== Student Profiles ===");
        student1.printProfile();
        student2.printProfile();

        // Create a second course and instructor for the course offerings demo
        Instructor instructor2 = new Instructor("Aina Rahman", "aina@school.com", "Software Engineering");
        Course course2 = new Course("Web Development", "CS202", "Programming", true);

        // Create at least two course offerings
        CourseOffering offering1 = new CourseOffering("OFF001", "Introduction to Java - June 2026 Intake",course1, instructor1, "2026-06-19", "2026-08-19", 25, "Physical");

        CourseOffering offering2 = new CourseOffering("OFF002","Web Development - July 2026 Intake", course2, instructor2, "2026-07-01", "2026-09-01", 30, "Online");

        System.out.println("=== Course Offerings ===");
        offering1.printOfferingSummary();
        System.out.println();
        offering2.printOfferingSummary();
    }
}
