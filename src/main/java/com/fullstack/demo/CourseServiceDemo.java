package com.fullstack.demo;

import java.util.List;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;

public class CourseServiceDemo {
    public static void main(String[] args) {
        CourseRepository courseRepository = new InMemoryCourseRepository();
        CourseService courseService = new CourseService(courseRepository);

        System.out.println("=== Create Courses ===");
        Course course1 = courseService.createCourse(new Course("C001", "Java Fundamentals", 14, "Beginner"));
        Course course2 = courseService.createCourse(new Course("C002", "React Frontend Development", 21, "Intermediate"));
        Course course3 = courseService.createCourse(new Course("C003", "MongoDB Basics", 14, "Beginner"));
        Course course4 = courseService.createCourse(new Course("C004", "Advanced Java Backend", 25, "Advanced"));
        System.out.println("Course saved: " + course1.getCourseId());
        System.out.println("Course saved: " + course2.getCourseId());
        System.out.println("Course saved: " + course3.getCourseId());
        System.out.println("Course saved: " + course4.getCourseId());

        System.out.println();
        System.out.println("=== All Courses ===");
        List<Course> courses = courseService.getAllCourses();
        for (Course course : courses) {
            System.out.println(course.getCourseId() + " - " + course.getTitle());
        }

        System.out.println();
        System.out.println("=== Search by Title: java ===");
        for (Course course : courseService.searchByTitle("java")) {
            System.out.println(course.getCourseId() + " - " + course.getTitle());
        }

        System.out.println();
        System.out.println("=== Search by Title: react ===");
        for (Course course : courseService.searchByTitle("react")) {
            System.out.println(course.getCourseId() + " - " + course.getTitle());
        }

        System.out.println();
        System.out.println("=== Filter by Level: Beginner ===");
        for (Course course : courseService.filterByLevel("Beginner")) {
            System.out.println(course.getCourseId() + " - " + course.getTitle());
        }

        System.out.println();
        System.out.println("=== Filter by Level: Advanced ===");
        for (Course course : courseService.filterByLevel("Advanced")) {
            System.out.println(course.getCourseId() + " - " + course.getTitle());
        }

        System.out.println();
        System.out.println("=== Valid Course Test ===");
        try {
            courseService.createCourse(new Course("C005", "Spring Boot Basics", 18, "Intermediate"));
            System.out.println("Course saved successfully.");
        } catch (RuntimeException e) {
            System.out.println("Validation error: " + e.getMessage());
        }

        System.out.println();
        System.out.println("=== Invalid Course Test ===");

        try {
            courseService.createCourse(null);
        } catch (RuntimeException e) {
            System.out.println("Validation error: " + e.getMessage());
        }

        try {
            courseService.createCourse(new Course("", "No ID Course", 10, "Beginner"));
        } catch (RuntimeException e) {
            System.out.println("Validation error: " + e.getMessage());
        }

        try {
            courseService.createCourse(new Course("C006", "", 10, "Beginner"));
        } catch (RuntimeException e) {
            System.out.println("Validation error: " + e.getMessage());
        }

        try {
            courseService.createCourse(new Course("C007", "Zero Duration Course", 0, "Beginner"));
        } catch (RuntimeException e) {
            System.out.println("Validation error: " + e.getMessage());
        }

        try {
            courseService.createCourse(new Course("C008", "No Level Course", 10, ""));
        } catch (RuntimeException e) {
            System.out.println("Validation error: " + e.getMessage());
        }
    }
}
