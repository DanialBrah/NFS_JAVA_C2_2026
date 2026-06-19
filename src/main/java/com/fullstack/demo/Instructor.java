package com.fullstack.demo;
public class Instructor {
    private String name;
    private String email;
    private String department;
    
    public Instructor(String name, String email, String department) {
        this.name = name;
        this.email = email;
        this.department = department;
    }
    
    public String getName() {
        return name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getDepartment() {
        return department;
    }
    
    public void printInstructorInfo() {
        System.out.println("Instructor: " + name);
        System.out.println("Email: " + email);
        System.out.println("Department: " + department);
    }
}
