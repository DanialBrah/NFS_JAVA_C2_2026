package com.fullstack.demo.model;
public class CourseOffering {
    private String offeringId;
    private String offeringName;
    private Course course;
    private Instructor instructor;
    private String startDate;
    private String endDate;
    private int capacity;
    private String deliveryMode;

    public CourseOffering(String offeringId, String offeringName, Course course, Instructor instructor,
                          String startDate, String endDate, int capacity, String deliveryMode) {
        setOfferingId(offeringId);
        setOfferingName(offeringName);
        setCourse(course);
        setInstructor(instructor);
        setStartDate(startDate);
        setEndDate(endDate);
        setCapacity(capacity);
        setDeliveryMode(deliveryMode);
    }

    public String getOfferingId() {
        return offeringId;
    }

    public void setOfferingId(String offeringId) {
        this.offeringId = requireText(offeringId, "Offering ID");
    }

    public String getOfferingName() {
        return offeringName;
    }

    public void setOfferingName(String offeringName) {
        this.offeringName = requireText(offeringName, "Offering Name");
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        if (course == null) {
            throw new IllegalArgumentException("Course is required.");
        }
        this.course = course;
    }

    public Instructor getInstructor() {
        return instructor;
    }

    public void setInstructor(Instructor instructor) {
        if (instructor == null) {
            throw new IllegalArgumentException("Instructor is required.");
        }
        this.instructor = instructor;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = requireText(startDate, "Start Date");
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = requireText(endDate, "End Date");
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Capacity must be more than 0.");
        }
        this.capacity = capacity;
    }

    public String getDeliveryMode() {
        return deliveryMode;
    }

    public void setDeliveryMode(String deliveryMode) {
        this.deliveryMode = requireText(deliveryMode, "Delivery Mode");
    }

    public String getSummary() {
        return "Offering ID: " + offeringId
                + ", Name: " + offeringName
                + ", Course: " + course.getTitle()
                + ", Instructor: " + instructor.getInstructorName()
                + ", Start Date: " + startDate
                + ", End Date: " + endDate
                + ", Capacity: " + capacity
                + ", Delivery Mode: " + deliveryMode;
    }

    public void printSummary() {
        System.out.println("Offering ID: " + offeringId);
        System.out.println("Name: " + offeringName);
        System.out.println("Course: " + course.getTitle());
        System.out.println("Instructor: " + instructor.getInstructorName());
        System.out.println("Start Date: " + startDate);
        System.out.println("End Date: " + endDate);
        System.out.println("Capacity: " + capacity);
        System.out.println("Delivery Mode: " + deliveryMode);
        System.out.println("----------------------------");
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + " is required.");
        }
        return value.trim();
    }
}
