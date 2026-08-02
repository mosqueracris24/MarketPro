package com.marketpro.backend.controller;

import com.marketpro.backend.model.Usuario;
import com.marketpro.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String identificador = credentials.get("username");
        String password = credentials.get("password");

        System.out.println("Log: Buscando usuario " + identificador);

        // Buscamos por email o username
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(identificador);
        if (usuarioOpt.isEmpty()) {
            usuarioOpt = usuarioRepository.findByUsername(identificador);
        }

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // Validamos con BCrypt
            if (passwordEncoder.matches(password, usuario.getPassword())) {
                System.out.println("Log: Login exitoso para " + identificador);
                Map<String, Object> response = new LinkedHashMap<>();
                response.put("id", usuario.getId());
                response.put("username", usuario.getUsername());
                response.put("email", usuario.getEmail());
                response.put("role", usuario.getRole());
                if (usuario.getCreatedAt() != null) {
                    response.put("createdAt", usuario.getCreatedAt());
                }
                if (usuario.getIsActive() != null) {
                    response.put("isActive", usuario.getIsActive());
                }
                return ResponseEntity.ok(response);
            } else {
                System.out.println("Log: Contraseña incorrecta para " + identificador);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Credenciales incorrectas"));
            }
        }

        System.out.println("Log: Usuario no encontrado " + identificador);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Credenciales incorrectas"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        try {
            if (usuarioRepository.findByUsername(usuario.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "El nombre de usuario ya está en uso"));
            }
            
            // Cifrar la contraseña antes de guardar en la BD
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
            
            if (usuario.getRole() == null || usuario.getRole().isEmpty()) {
                usuario.setRole("USER");
            }

            Usuario nuevoUsuario = usuarioRepository.save(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al registrar el usuario: " + e.getMessage()));
        }
    }
    // NUEVO ENDPOINT: Verificar si el email existe en la base de datos
    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            return ResponseEntity.ok(Map.of("exists", true));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("exists", false, "error", "No existe una cuenta asociada a este email"));
        }
    }

    // NUEVO ENDPOINT: Restablecer contraseña directamente en la BD
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Ciframos la nueva contraseña con BCrypt
            usuario.setPassword(passwordEncoder.encode(newPassword));
            usuarioRepository.save(usuario);

            System.out.println("Log: Contraseña restablecida exitosamente para " + email);
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada exitosamente"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado"));
        }
    }
}