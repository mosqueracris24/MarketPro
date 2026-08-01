package com.marketpro.backend.service;

import com.marketpro.backend.model.Categoria;
import com.marketpro.backend.repository.CategoriaRepository;
import com.marketpro.backend.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;
    private final ProductoRepository productoRepository;

    public CategoriaService(CategoriaRepository repository, ProductoRepository productoRepository) {
        this.repository = repository;
        this.productoRepository = productoRepository;
    }

    public List<Categoria> listar() {
        return repository.findAll();
    }

    public Categoria guardar(Categoria categoria) {
        return repository.save(categoria);
    }

    public Categoria actualizar(Long id, Categoria categoria) {
        Categoria existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        existente.setNombre(categoria.getNombre());
        existente.setDescripcion(categoria.getDescripcion());

        return repository.save(existente);
    }

    public void eliminar(Long id) {
        if (productoRepository.existsByCategoriaId(id)) {
            throw new RuntimeException("No se puede eliminar una categoría con productos asociados");
        }
        repository.deleteById(id);
    }
}
