package com.marketpro.backend.service;

import com.marketpro.backend.repository.CategoriaRepository;
import com.marketpro.backend.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private CategoriaService categoriaService;

    @Test
    void eliminar_debeRechazarSiLaCategoriaTieneProductosAsociados() {
        Long id = 10L;
        when(productoRepository.existsByCategoriaId(id)).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> categoriaService.eliminar(id));

        assertEquals("No se puede eliminar una categoría con productos asociados", exception.getMessage());
        verify(productoRepository).existsByCategoriaId(id);
        verify(categoriaRepository, never()).deleteById(anyLong());
    }
}
