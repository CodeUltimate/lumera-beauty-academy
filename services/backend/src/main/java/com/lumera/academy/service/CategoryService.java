package com.lumera.academy.service;

import com.lumera.academy.dto.CategoryDTO;
import com.lumera.academy.entity.Category;
import com.lumera.academy.exception.BadRequestException;
import com.lumera.academy.exception.ResourceNotFoundException;
import com.lumera.academy.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDTO> getVisibleCategories() {
        return categoryRepository.findByVisibleTrueOrderByDisplayOrderAsc()
                .stream()
                .map(CategoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(CategoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(UUID id) {
        return categoryRepository.findById(id)
                .map(CategoryDTO::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
    }

    public CategoryDTO getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .map(CategoryDTO::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "slug", slug));
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.existsBySlug(dto.getSlug())) {
            throw new BadRequestException("Category with slug '" + dto.getSlug() + "' already exists");
        }
        if (categoryRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Category with name '" + dto.getName() + "' already exists");
        }

        Category category = Category.builder()
                .name(dto.getName())
                .slug(dto.getSlug())
                .description(dto.getDescription())
                .icon(dto.getIcon())
                .imageUrl(dto.getImageUrl())
                .visible(dto.isVisible())
                .displayOrder(dto.getDisplayOrder())
                .build();

        return CategoryDTO.fromEntity(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDTO updateCategory(UUID id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        if (!category.getSlug().equals(dto.getSlug()) && categoryRepository.existsBySlug(dto.getSlug())) {
            throw new BadRequestException("Category with slug '" + dto.getSlug() + "' already exists");
        }

        category.setName(dto.getName());
        category.setSlug(dto.getSlug());
        category.setDescription(dto.getDescription());
        category.setIcon(dto.getIcon());
        category.setImageUrl(dto.getImageUrl());
        category.setVisible(dto.isVisible());
        category.setDisplayOrder(dto.getDisplayOrder());

        return CategoryDTO.fromEntity(categoryRepository.save(category));
    }

    @Transactional
    public void toggleCategoryVisibility(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        category.setVisible(!category.isVisible());
        categoryRepository.save(category);
    }
}
