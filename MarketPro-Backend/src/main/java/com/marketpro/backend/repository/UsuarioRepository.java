package com.marketpro.backend.repository;

import com.marketpro.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca un usuario por su correo electrónico.
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Busca un usuario por su nombre de usuario (username).
     * (Este es el método que hacía falta y generaba el error de compilación)
     */
    Optional<Usuario> findByUsername(String username);
}