package org.healthcare.healthcare_backend.Services;

import org.healthcare.healthcare_backend.Entity.AdminEntity;
import org.healthcare.healthcare_backend.Repository.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private AdminRepo adminRepo;

    /**
     * Register a new admin
     */
    public AdminEntity registerAdmin(String fullname, String email, String password) {
        // Check if admin already exists
        if (adminRepo.findByEmail(email) != null) {
            throw new RuntimeException("Admin with this email already exists");
        }

        // Create new admin entity
        AdminEntity admin = new AdminEntity();
        admin.setFullname(fullname);
        admin.setEmail(email);
        admin.setRole("ADMIN");
        admin.setPassword(passwordEncoder.encode(password));

        return adminRepo.save(admin);
    }

    /**
     * Login admin
     */
    public AdminEntity loginAdmin(String email, String password) {
        AdminEntity admin = adminRepo.findByEmail(email);

        if (admin == null) {
            throw new RuntimeException("Admin not found with this email");
        }

        // Verify password
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return admin;
    }

    /**
     * Get admin by email
     */
    public AdminEntity getAdminByEmail(String email) {
        return adminRepo.findByEmail(email);
    }
}
