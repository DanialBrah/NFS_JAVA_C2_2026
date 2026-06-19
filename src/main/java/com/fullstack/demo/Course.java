package com.fullstack.demo;
public class Course {
    private String courseName;
    private String courseCode;
    private Instructor instructor;
    private String category;
    private boolean active;
    
    public Course(String courseName, String courseCode, String category, boolean active) {
        this.courseName = courseName;
        this.courseCode = courseCode;
        this.category = category;
        this.active = active;
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
    
    public String getCategory() {
        return category;
    }
    
    public boolean isActive() {
        return active;
    }
    
    public Instructor getInstructor() {
        return instructor;
    }
    
    public void printCourseInfo() {
        System.out.println("Course: " + courseName + " (" + courseCode + ")");
        if (instructor != null) {
            System.out.println("Instructor: " + instructor.getName());
        }
        else {
            System.out.println("Instructor: Not assigned");
        }
    }
    
    public void printSummary() {
        System.out.println("Course Name: " + courseName);
        System.out.println("Course Code: " + courseCode);
        System.out.println("Category: " + category);
        String status = active ? "Active" : "Inactive";
        System.out.println("Status: " + status);
        if (instructor != null) {
            System.out.println("Instructor: " + instructor.getName());
        }
    }
}
