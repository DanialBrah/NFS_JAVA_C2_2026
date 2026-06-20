package com.fullstack.demo.service;

import com.fullstack.demo.exception.DuplicateStudentException;
import com.fullstack.demo.exception.InvalidStudentException;
import com.fullstack.demo.exception.StudentNotFoundException;
import com.fullstack.demo.model.Student;
import com.fullstack.demo.repository.StudentRepository;

import java.util.ArrayList;
import java.util.List;

public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student registerStudent(Student student) {
        validateStudent(student);

        if (studentRepository.existsById(student.getStudentId())) {
            throw new DuplicateStudentException(student.getStudentId());
        }

        return studentRepository.save(student);
    }

    public Student getStudentById(String studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException(studentId));
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Student> searchByNameUsingLoop(String keyword) {
        String safeKeyword = keyword == null ? "" : keyword.trim().toLowerCase();
        List<Student> results = new ArrayList<>();

        for (Student student : studentRepository.findAll()) {
            if (student.getName().toLowerCase().contains(safeKeyword)) {
                results.add(student);
            }
        }

        return results;
    }

    public List<Student> searchByNameUsingStream(String keyword) {
        String safeKeyword = keyword == null ? "" : keyword.trim().toLowerCase();

        return studentRepository.findAll()
                .stream()
                .filter(student -> student.getName().toLowerCase().contains(safeKeyword))
                .toList();
    }

    private void validateStudent(Student student) {
        if (student == null) {
            throw new InvalidStudentException("Student cannot be null.");
        }
        if (isBlank(student.getStudentId())) {
            throw new InvalidStudentException("Student ID is required.");
        }
        if (isBlank(student.getName())) {
            throw new InvalidStudentException("Student name is required.");
        }
        if (isBlank(student.getEmail())) {
            throw new InvalidStudentException("Student email is required.");
        }
        if (!student.getEmail().contains("@")) {
            throw new InvalidStudentException("Student email must contain @.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
