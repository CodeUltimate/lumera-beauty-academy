-- Luméra Beauty Academy - Seed Categories
-- Version: 1.0.0

-- Visible Categories (the 7 main categories)
INSERT INTO categories (id, name, slug, description, icon, visible, display_order) VALUES
(uuid_generate_v4(), 'Aesthetics (Needle)', 'aesthetics-needle', 'Injectable treatments including Botox, dermal fillers, and advanced facial sculpting techniques', 'Syringe', TRUE, 1),
(uuid_generate_v4(), 'Aesthetics (Non-Needle)', 'aesthetics-non-needle', 'Non-invasive treatments such as chemical peels, microdermabrasion, and LED therapy', 'Sparkles', TRUE, 2),
(uuid_generate_v4(), 'Skin', 'skin', 'Comprehensive skincare treatments, facials, and advanced skin analysis techniques', 'Droplet', TRUE, 3),
(uuid_generate_v4(), 'Laser', 'laser', 'Laser treatments for hair removal, skin rejuvenation, and pigmentation correction', 'Zap', TRUE, 4),
(uuid_generate_v4(), 'Hair', 'hair', 'Hair styling, cutting, coloring, and advanced hair treatment techniques', 'Scissors', TRUE, 5),
(uuid_generate_v4(), 'Nails', 'nails', 'Nail art, manicure, pedicure, and gel/acrylic application techniques', 'Palette', TRUE, 6),
(uuid_generate_v4(), 'Makeup & Beauty', 'makeup-beauty', 'Professional makeup artistry, bridal looks, and beauty techniques', 'Heart', TRUE, 7);

-- Hidden Categories (admin-activated, for future expansion)
INSERT INTO categories (id, name, slug, description, icon, visible, display_order) VALUES
(uuid_generate_v4(), 'Wellness & Spa', 'wellness-spa', 'Massage therapy, body treatments, and holistic wellness practices', 'Leaf', FALSE, 8),
(uuid_generate_v4(), 'Business & Marketing', 'business-marketing', 'Building your beauty business, marketing strategies, and client management', 'Briefcase', FALSE, 9),
(uuid_generate_v4(), 'Tattoo & Micropigmentation', 'tattoo-micropigmentation', 'Permanent makeup, microblading, and tattoo artistry', 'Pen', FALSE, 10),
(uuid_generate_v4(), 'Medical Aesthetics', 'medical-aesthetics', 'Advanced medical-grade treatments requiring clinical supervision', 'Stethoscope', FALSE, 11),
(uuid_generate_v4(), 'Barbering', 'barbering', 'Men''s grooming, beard styling, and traditional barbering techniques', 'ScissorsIcon', FALSE, 12),
(uuid_generate_v4(), 'Lash & Brow', 'lash-brow', 'Lash extensions, brow lamination, tinting, and shaping techniques', 'Eye', FALSE, 13),
(uuid_generate_v4(), 'Body Contouring', 'body-contouring', 'Non-surgical body sculpting, cellulite treatments, and skin tightening', 'Activity', FALSE, 14);
