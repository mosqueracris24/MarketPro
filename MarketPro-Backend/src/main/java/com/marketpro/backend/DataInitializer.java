package com.marketpro.backend;

import com.marketpro.backend.model.Categoria;
import com.marketpro.backend.repository.CategoriaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initCategorias(CategoriaRepository categoriaRepository) {
        return args -> {

            if (categoriaRepository.count() == 0) {

                Categoria c1 = new Categoria();
                c1.setNombre("Alimentos");
                c1.setDescripcion("Productos de consumo alimenticio");

                Categoria c2 = new Categoria();
                c2.setNombre("Aseo");
                c2.setDescripcion("Productos de limpieza y aseo");

                Categoria c3 = new Categoria();
                c3.setNombre("Tecnología");
                c3.setDescripcion("Dispositivos y productos tecnológicos");

                Categoria c4 = new Categoria();
                c4.setNombre("Bebidas");
                c4.setDescripcion("Bebidas y refrescos");

                Categoria c5 = new Categoria();
                c5.setNombre("Hogar");
                c5.setDescripcion("Artículos para el hogar");

                categoriaRepository.save(c1);
                categoriaRepository.save(c2);
                categoriaRepository.save(c3);
                categoriaRepository.save(c4);
                categoriaRepository.save(c5);

                System.out.println("✔ Categorías iniciales creadas");
            }
        };
    }
}
