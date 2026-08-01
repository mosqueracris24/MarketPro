package com.marketpro.backend.jdbc;

import com.marketpro.backend.model.Usuario;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@Service
public class UsuarioJdbcService {

    // Configuración de conexión apuntando a tu base de datos local
    private final String URL = "jdbc:mysql://localhost:3306/marketpro?useSSL=false&serverTimezone=UTC";
    private final String USER = "root";
    private final String PASSWORD = "";

    public List<Usuario> listarUsuarios() {
        List<Usuario> usuarios = new ArrayList<>();

        // Consulta usando el nombre real de tu tabla
        String sql = "SELECT * FROM usuario";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Usuario usuario = new Usuario();

                // Mapeo utilizando los sets correspondientes y nombres de columna reales
                usuario.setId(rs.getLong("id"));
                usuario.setUsername(rs.getString("username"));
                usuario.setEmail(rs.getString("email"));
                usuario.setRole(rs.getString("role"));

                // Ahora coincide perfectamente tipo Boolean con Boolean
                usuario.setIsActive(rs.getBoolean("is_active"));

                // Mapear created_at de forma segura
                if (rs.getTimestamp("created_at") != null) {
                    usuario.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
                }

                usuarios.add(usuario);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return usuarios;
    }
}