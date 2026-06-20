package com.fullstack.demo.model;

public class Course {
    private String courseId;
    private String title;
    private int durationHours;
    private String level;
    private Instructor instructor;
    private boolean active;

    public Course(String courseId, String title, int durationHours, String level) {
        setCourseId(courseId);
        setTitle(title);
        setDurationHours(durationHours);
        setLevel(level);
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = requireText(courseId, "Course ID");
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = requireText(title, "Course title");
    }

    public int getDurationHours() {
        return durationHours;
    }

    public void setDurationHours(int durationHours) {
        if (durationHours <= 0) {
            throw new IllegalArgumentException("Course duration must be greater than zero.");
        }
        this.durationHours = durationHours;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = requireText(level, "Course level");
    }

    public Instructor getInstructor() {
        return instructor;
    }

    public void setInstructor(Instructor instructor) {
        this.instructor = instructor;
    }

    public String getSummary() {
        String instructorName = instructor == null ? "Not assigned yet" : instructor.getInstructorName();
        return "Course ID: " + courseId
                + ", Title: " + title
                + ", Duration: " + durationHours + " hours"
                + ", Level: " + level
                + ", Instructor: " + instructorName;
    }

    public void printSummary() {
        System.out.println("Course ID: " + courseId);
        System.out.println("Title: " + title);
        System.out.println("Duration: " + durationHours + " hours");
        System.out.println("Level: " + level);
        System.out.println("Status: " + (active ? "Active" : "Inactive"));

        if (instructor == null) {
            System.out.println("Instructor: Not assigned yet");
        } else {
            System.out.println("Instructor: " + instructor.getInstructorName());
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
