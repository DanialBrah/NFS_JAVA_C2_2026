package com.fullstack.demo;
public class Student {
    private String name;
    private String studentID;
    private Course enrolledCourse;
    private double gpa;
    
    public Student(String name, String studentID) {
        this.name = name;
        this.studentID = studentID;
        this.enrolledCourse = null;
        this.gpa = 0.0;
    }
    
    public void enrollCourse(Course course) {
        this.enrolledCourse = course;
    }
    
    public void setGPA(double gpa) {
        this.gpa = gpa;
    }
    
    public String getName() {
        return name;
    }
    
    public String getStudentID() {
        return studentID;
    }
    
    public Course getEnrolledCourse() {
        return enrolledCourse;
    }
    
    public double getGPA() {
        return gpa;
    }
    
    public void printProfile() {
        System.out.println("=== Student Profile ===");
        System.out.println("Name: " + name);
        System.out.println("Student ID: " + studentID);
        System.out.println("GPA: " + gpa);
        if (enrolledCourse != null) {
            System.out.println("Enrolled Course: " + enrolledCourse.getCourseName());
        } else {
            System.out.println("Enrolled Course: None");
        }
        System.out.println();
    }
}
