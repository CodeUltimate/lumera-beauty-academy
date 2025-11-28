package com.lumera.academy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String icon;

    private String imageUrl;

    @Column(nullable = false)
    @Builder.Default
    private boolean visible = true;

    @Column(nullable = false)
    @Builder.Default
    private int displayOrder = 0;

    @OneToMany(mappedBy = "category")
    @Builder.Default
    private Set<LiveClass> liveClasses = new HashSet<>();
}
