package com.marketpro.backend.repository;

import com.marketpro.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    boolean existsBySku(String sku);
}
