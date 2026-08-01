package com.marketpro.backend.controller;

import com.marketpro.backend.model.Usuario;
import com.marketpro.backend.repository.UsuarioRepository;
import com.marketpro.backend.jdbc.UsuarioJdbcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    private boolean esSuperusuarioProtegido(Usuario usuario) {
        return usuario != null
                && "admin".equalsIgnoreCase(usuario.getUsername())
                && "Administrador".equals(usuario.getRole());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario usuarioDetalles) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = usuarioOpt.get();
        if (esSuperusuarioProtegido(usuario) && (
                (usuarioDetalles.getIsActive() != null && Boolean.FALSE.equals(usuarioDetalles.getIsActive()))
                        || (usuarioDetalles.getRole() != null && !usuario.getRole().equals(usuarioDetalles.getRole()))
        )) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        usuario.setUsername(usuarioDetalles.getUsername());
        usuario.setEmail(usuarioDetalles.getEmail());
        if (usuarioDetalles.getPassword() != null && !usuarioDetalles.getPassword().isEmpty()) {
            usuario.setPassword(usuarioDetalles.getPassword());
        }
        if (usuarioDetalles.getRole() != null) {
            usuario.setRole(usuarioDetalles.getRole());
        }
        if (usuarioDetalles.getIsActive() != null) {
            usuario.setIsActive(usuarioDetalles.getIsActive());
        }
        Usuario actualizado = usuarioRepository.save(usuario);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = usuarioOpt.get();
        if (esSuperusuarioProtegido(usuario)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        usuarioRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}