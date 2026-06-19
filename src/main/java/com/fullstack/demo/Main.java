package com.fullstack.demo;
public class Main {
    public static void main(String[] args) {
        // Create an instructor
        Instructor instructor1 = new Instructor("Dr. Alice Smith", "alice@school.com", "Computer Science");
        
        // Create courses
        Course course1 = new Course("Introduction to Java", "CS101");
        
        // Assign instructor to course
        course1.assignInstructor(instructor1);
        
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
    }
}
