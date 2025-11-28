package com.lumera.academy.dto;

import com.lumera.academy.entity.Category;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CategoryDTO {

    private UUID id;
    private String name;
    private String slug;
    private String description;
    private String icon;
    private String imageUrl;
    private boolean visible;
    private int displayOrder;

    public static CategoryDTO fromEntity(Category category) {
        return CategoryDTO.builder()
            .id(category.getId())
            .name(category.getName())
            .slug(category.getSlug())
            .description(category.getDescription())
            .icon(category.getIcon())
            .imageUrl(category.getImageUrl())
            .visible(category.isVisible())
            .displayOrder(category.getDisplayOrder())
            .build();
    }
}
