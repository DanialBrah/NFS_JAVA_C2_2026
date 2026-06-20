package com.fullstack.demo.model;

public class Student {
    private String studentId;
    private String name;
    private String email;
    private Course enrolledCourse;
    private double gpa;

    public Student(String studentId, String name, String email) {
        setStudentId(studentId);
        setName(name);
        setEmail(email);
        this.enrolledCourse = null;
        this.gpa = 0.0;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = requireText(studentId, "Student ID");
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = requireText(name, "Name");
    }

    public void setStudentName(String name) {
        this.name = requireText(name, "Student Name");
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = requireText(email, "Email");
    }

    public Course getEnrolledCourse() {
        return enrolledCourse;
    }

    public void setEnrolledCourse(Course enrolledCourse) {
        this.enrolledCourse = enrolledCourse;
    }

    public void enrollCourse(Course course) {
        setEnrolledCourse(course);
    }

    public double getGpa() {
        return gpa;
    }

    public void setGpa(double gpa) {
        this.gpa = gpa;
    }

    public void printProfile() {
        System.out.println("=== Student Profile ===");
        System.out.println("Student ID: " + studentId);
        System.out.println("Name: " + name);
        System.out.println("Email: " + email);
        System.out.println("GPA: " + gpa);
        if (enrolledCourse != null) {
            System.out.println("Enrolled Course: " + enrolledCourse.getTitle());
        } else {
            System.out.println("Enrolled Course: None");
        }
        System.out.println("----------------------------");
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + " is required.");
        }
        return value.trim();
    }
}
