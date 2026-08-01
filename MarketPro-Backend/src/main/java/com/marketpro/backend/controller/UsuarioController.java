package com.marketpro.backend.controller;

import com.marketpro.backend.model.Usuario;
import com.marketpro.backend.repository.UsuarioRepository;
import com.marketpro.backend.jdbc.UsuarioJdbcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioJdbcService usuarioJdbcService;

    @GetMapping("/jdbc")
    public ResponseEntity<List<Usuario>> listarConJdbc() {
        return ResponseEntity.ok(usuarioJdbcService.listarUsuarios());
    }

    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Usuario crear(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario usuarioDetalles) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setUsername(usuarioDetalles.getUsername());
            usuario.setEmail(usuarioDetalles.getEmail());
            if (usuarioDetalles.getPassword() != null && !usuarioDetalles.getPassword().isEmpty()) {
                usuario.setPassword(usuarioDetalles.getPassword());
            }
            if (usuarioDetalles.getRole() != null) {
                usuario.setRole(usuarioDetalles.getRole());
            }
            Usuario actualizado = usuarioRepository.save(usuario);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}