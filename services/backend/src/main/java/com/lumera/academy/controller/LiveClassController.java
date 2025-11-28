package com.lumera.academy.controller;

import com.lumera.academy.dto.LiveClassDTO;
import com.lumera.academy.service.LiveClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/classes")
@RequiredArgsConstructor
@Tag(name = "Live Classes", description = "Public live class endpoints")
public class LiveClassController {

    private final LiveClassService liveClassService;

    @GetMapping
    @Operation(summary = "Get upcoming classes")
    public ResponseEntity<Page<LiveClassDTO>> getUpcomingClasses(
        @PageableDefault(size = 12) Pageable pageable
    ) {
        return ResponseEntity.ok(liveClassService.getUpcomingClasses(pageable));
    }

    @GetMapping("/live")
    @Operation(summary = "Get classes that are currently live")
    public ResponseEntity<List<LiveClassDTO>> getLiveNow() {
        return ResponseEntity.ok(liveClassService.getLiveNow());
    }

    @GetMapping("/category/{slug}")
    @Operation(summary = "Get classes by category")
    public ResponseEntity<Page<LiveClassDTO>> getByCategory(
        @PathVariable String slug,
        @PageableDefault(size = 12) Pageable pageable
    ) {
        return ResponseEntity.ok(liveClassService.getClassesByCategory(slug, pageable));
    }

    @GetMapping("/educator/{educatorId}")
    @Operation(summary = "Get classes by educator (public profile)")
    public ResponseEntity<Page<LiveClassDTO>> getByEducator(
        @PathVariable UUID educatorId,
        @PageableDefault(size = 12) Pageable pageable
    ) {
        return ResponseEntity.ok(liveClassService.getClassesByEducator(educatorId, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get class by ID")
    public ResponseEntity<LiveClassDTO> getClassById(@PathVariable UUID id) {
        return ResponseEntity.ok(liveClassService.getClassById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Search classes")
    public ResponseEntity<Page<LiveClassDTO>> searchClasses(
        @RequestParam String q,
        @PageableDefault(size = 12) Pageable pageable
    ) {
        return ResponseEntity.ok(liveClassService.searchClasses(q, pageable));
    }
}
