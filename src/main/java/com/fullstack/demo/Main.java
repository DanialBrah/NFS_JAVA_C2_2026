package com.fullstack.demo;

import java.util.ArrayList;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.model.CourseOffering;
import com.fullstack.demo.model.Instructor;
import com.fullstack.demo.model.Student;

public class Main {
    public static void main(String[] args) {
        Instructor instructor1 = new Instructor("I001", "Alice Johnson", "Java Development");
        Instructor instructor2 = new Instructor("I002", "Bob Smith", "React Development");

        ArrayList<Instructor> instructors = new ArrayList<>();
        instructors.add(instructor1);
        instructors.add(instructor2);

        Course course1 = new Course("C001", "Java Fundamentals", 14, "Beginner");
        Course course2 = new Course("C002", "React Frontend Development", 21, "Intermediate");
        Course course3 = new Course("C003", "MongoDB Basics", 14, "Beginner");

        course1.setInstructor(instructor1);
        course2.setInstructor(instructor2);
        course3.setInstructor(instructor1);

        ArrayList<Course> courses = new ArrayList<>();
        courses.add(course1);
        courses.add(course2);
        courses.add(course3);

        Student student1 = new Student("S001", "Charlie Brown", "cFq0l@example.com");
        Student student2 = new Student("S002", "Daisy Duck", "d4oQG@example.com");
        Student student3 = new Student("S003", "Evan Wright", "eWr1g@example.com");

        ArrayList<Student> students = new ArrayList<>();
        students.add(student1);
        students.add(student2);
        students.add(student3);

        CourseOffering offering1 = new CourseOffering("O001", "Java Fundamentals - Morning Batch",
                course1, instructor1, "2026-07-01", "2026-07-15", 25, "Online");
        CourseOffering offering2 = new CourseOffering("O002", "React Frontend - Evening Batch",
                course2, instructor2, "2026-07-05", "2026-07-26", 20, "In-Person");

        ArrayList<CourseOffering> offerings = new ArrayList<>();
        offerings.add(offering1);
        offerings.add(offering2);

        System.out.println("Instructor Profiles:");
        for (Instructor instructor : instructors) {
            instructor.printProfile();
        }

        System.out.println("Course Summaries:");
        for (Course course : courses) {
            course.printSummary();
        }

        System.out.println("Student Profiles:");
        for (Student student : students) {
            student.printProfile();
        }

        System.out.println("Course Offerings:");
        for (CourseOffering offering : offerings) {
            offering.printSummary();
        }
    }
}
