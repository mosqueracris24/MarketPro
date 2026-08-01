package com.marketpro.backend.service;

import com.marketpro.backend.model.Categoria;
import com.marketpro.backend.model.Producto;
import com.marketpro.backend.repository.CategoriaRepository;
import com.marketpro.backend.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoService(ProductoRepository productoRepository,
                           CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    // LISTAR TODOS LOS PRODUCTOS
    public List<Producto> listar() {
        return productoRepository.findAll();
    }

    // CREAR PRODUCTO
    public Producto guardar(Producto producto, Long categoriaId) {

        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        producto.setCategoria(categoria);
        return productoRepository.save(producto);
    }

    // ACTUALIZAR PRODUCTO
    public Producto actualizar(Long id, Producto producto, Long categoriaId) {

        Producto existente = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        // USAR LOS NOMBRES CORRECTOS DEL MODELO
        existente.setNombre(producto.getNombre());
        existente.setSku(producto.getSku());
        existente.setPrecioCompra(producto.getPrecioCompra());
        existente.setPrecioVenta(producto.getPrecioVenta());
        existente.setStock(producto.getStock());
        existente.setFechaVencimiento(producto.getFechaVencimiento());
        existente.setCategoria(categoria);

        return productoRepository.save(existente);
    }

    // ELIMINAR PRODUCTO
    public void eliminar(Long id) {
        productoRepository.deleteById(id);
    }
}
