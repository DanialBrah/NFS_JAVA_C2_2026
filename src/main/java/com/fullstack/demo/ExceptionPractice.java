package com.fullstack.demo;

import com.fullstack.demo.exception.CourseNotFoundException;
import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;

public class ExceptionPractice {
    public static void main(String[] args) {
        CourseRepository courseRepository = new InMemoryCourseRepository();
        CourseService courseService = new CourseService(courseRepository);

        courseService.createCourse(new Course("C001", "Java Fundamentals", 14, "Beginner"));
        courseService.createCourse(new Course("C002", "React Frontend Development", 21, "Intermediate"));

        System.out.println("=== Find Existing Course ===");
        Course course = courseService.getCourseById("C001");
        course.printSummary();

        System.out.println();
        System.out.println("=== Find Missing Course: C999 ===");
        try {
            Course missingCourse = courseService.getCourseById("C999");
            missingCourse.printSummary();
        } catch (CourseNotFoundException e) {
            System.out.println("Friendly message for user: " + e.getMessage());
        }

        System.out.println();
        System.out.println("=== Find Missing Course: C888 ===");
        try {
            Course missingCourse = courseService.getCourseById("C888");
            missingCourse.printSummary();
        } catch (CourseNotFoundException e) {
            System.out.println("Cannot display course details because the course does not exist.");
        }
    }
}
