package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;

import java.util.List;

public class SearchPractice {
    public static void main(String[] args) {
        CourseRepository courseRepository = new InMemoryCourseRepository();
        CourseService courseService = new CourseService(courseRepository);

        courseService.createCourse(new Course("C001", "Java Fundamentals", 14, "Beginner"));
        courseService.createCourse(new Course("C002", "React Frontend Development", 21, "Intermediate"));
        courseService.createCourse(new Course("C003", "MongoDB Basics", 10, "Beginner"));
        courseService.createCourse(new Course("C004", "Spring Boot API Development", 18, "Intermediate"));

        System.out.println("=== Beginner Courses (Loop) ===");
        List<Course> beginnerCourses = courseService.searchByLevelUsingLoop("Beginner");
        for (Course course : beginnerCourses) {
            System.out.println(course.getCourseId() + " - " + course.getTitle());
        }

        System.out.println();
        System.out.println("=== Intermediate Courses (Stream) ===");
        List<Course> intermediateCourses = courseService.searchByLevelUsingStream("Intermediate");
        for (Course course : intermediateCourses) {
            System.out.println(course.getCourseId() + " - " + course.getTitle());
        }

        System.out.println();
        System.out.println("=== Courses with Duration >= 18 hours ===");
        List<Course> longerCourses = courseService.searchByMinimumDurationUsingLoop(18);
        for (Course course : longerCourses) {
            System.out.println(course.getCourseId() + " - " + course.getTitle() + " (" + course.getDurationHours() + " hours)");
        }
    }
}
