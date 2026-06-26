package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;

public class CodeFlowPractice {
    public static void main(String[] args) {
        // We create the repository first because the service depends on it -
        // the repository must already exist so it can be handed to the service.
        CourseRepository courseRepository = new InMemoryCourseRepository();

        // CourseService needs a CourseRepository because the service does not
        // store data itself; it delegates all storage and lookup work to the repository.
        CourseService courseService = new CourseService(courseRepository);

        System.out.println("=== Add and Find Course ===");

        // Trace step 1: Demo class calls CourseService to create the course.
        // Trace step 2: CourseService validates the course (id, title, duration, level).
        // Trace step 3: CourseService asks CourseRepository to save the course.
        // Trace step 4: InMemoryCourseRepository stores the course in its LinkedHashMap.
        courseService.createCourse(new Course("C004", "Spring Boot API Development", 18, "Intermediate"));

        // Trace step 1: Demo class calls CourseService to get the course by ID.
        // Trace step 2: CourseService asks CourseRepository to find the course.
        // Trace step 3: InMemoryCourseRepository looks up the course in the LinkedHashMap.
        // Trace step 4: Course object is returned back up through CourseRepository to CourseService.
        // Trace step 5: CourseService returns the Course object to the demo class.
        Course foundCourse = courseService.getCourseById("C004");

        foundCourse.printSummary();
    }
}
