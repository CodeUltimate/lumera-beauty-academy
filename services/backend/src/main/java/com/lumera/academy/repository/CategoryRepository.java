package com.lumera.academy.repository;

import com.lumera.academy.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    Optional<Category> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsByName(String name);

    List<Category> findByVisibleTrueOrderByDisplayOrderAsc();

    List<Category> findAllByOrderByDisplayOrderAsc();

    @Query("SELECT c FROM Category c WHERE c.visible = true OR :includeHidden = true ORDER BY c.displayOrder ASC")
    List<Category> findAllCategories(boolean includeHidden);
}
