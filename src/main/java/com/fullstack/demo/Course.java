package com.fullstack.demo;
public class Course {
    private String courseName;
    private String courseCode;
    private Instructor instructor;
    
    public Course(String courseName, String courseCode) {
        this.courseName = courseName;
        this.courseCode = courseCode;
        this.instructor = null;
    }
    
    public void assignInstructor(Instructor instructor) {
        this.instructor = instructor;
    }
    
    public String getCourseName() {
        return courseName;
    }
    
    public String getCourseCode() {
        return courseCode;
    }
    
    public Instructor getInstructor() {
        return instructor;
    }
    
    public void printCourseInfo() {
        System.out.println("Course: " + courseName + " (" + courseCode + ")");
        if (instructor != null) {
            System.out.println("Instructor: " + instructor.getName());
        } else {
            System.out.println("Instructor: Not assigned");
        }
    }
}
