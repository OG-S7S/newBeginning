-- Seed Data: Migrate static frontend data to database
-- Run this AFTER running supabase-data-migration.sql

-- ============================================
-- SEED PROGRAMS
-- ============================================
INSERT INTO programs (id, title, ages, duration, class_size, description, icon_name, color, display_order) VALUES
('little-explorers', 'Little Explorers', 'K1 - K3 (Ages 4-7)', '2 hour sessions', '4-8 students', 
 'Introduction to basic robotics concepts through play-based learning and simple machines. Perfect for curious young minds taking their first steps into STEM.', 
 'Rocket', 'bg-[#ffb800]', 1),
('young-engineers', 'Young Engineers', 'Grade 3 - 6 (Ages 8-12)', '2 hour sessions', '4-8 students',
 'Building and programming robots using block-based coding and hands-on projects. Students develop technical skills while working on exciting team projects.',
 'Cog', 'bg-[#3abafb]', 2),
('tech-pioneers', 'Tech Pioneers', 'Preparatory (Ages 13-15)', '2 hour sessions', '4-8 students',
 'Advanced robotics with Arduino, Python basics, and competition preparation. Students tackle real engineering challenges and prepare for national competitions.',
 'Cpu', 'bg-[#10b981]', 3),
('innovation-lab', 'Innovation Lab', 'Secondary (Ages 16-18)', '2.5 hour sessions', '4-8 students',
 'Full-stack development, advanced robotics, AI concepts, and real-world projects. Prepare for university and careers in technology.',
 'Code', 'bg-[#8b5cf6]', 4)
ON CONFLICT (id) DO NOTHING;

-- Little Explorers - Highlights
INSERT INTO program_highlights (program_id, highlight, display_order) VALUES
('little-explorers', 'Hands-on building with age-appropriate materials', 0),
('little-explorers', 'Introduction to basic circuits and electricity', 1),
('little-explorers', 'Simple machines and mechanisms', 2),
('little-explorers', 'Creative problem-solving through play', 3),
('little-explorers', 'Team collaboration activities', 4)
ON CONFLICT DO NOTHING;

-- Little Explorers - Outcomes
INSERT INTO program_outcomes (program_id, outcome, display_order) VALUES
('little-explorers', 'Understanding of cause and effect', 0),
('little-explorers', 'Basic mechanical concepts', 1),
('little-explorers', 'Improved fine motor skills', 2),
('little-explorers', 'Early logical thinking', 3),
('little-explorers', 'Confidence in building and creating', 4)
ON CONFLICT DO NOTHING;

-- Little Explorers - Projects
INSERT INTO program_projects (program_id, project, display_order) VALUES
('little-explorers', 'Moving vehicles with wheels and axles', 0),
('little-explorers', 'Simple LED circuits', 1),
('little-explorers', 'Wind-powered machines', 2),
('little-explorers', 'Basic robots with motors', 3)
ON CONFLICT DO NOTHING;

-- Young Engineers - Highlights
INSERT INTO program_highlights (program_id, highlight, display_order) VALUES
('young-engineers', 'Block-based programming (Scratch, mBlock)', 0),
('young-engineers', 'Arduino basics with visual coding', 1),
('young-engineers', 'Sensors and motors integration', 2),
('young-engineers', 'Structured team projects', 3),
('young-engineers', 'Introduction to design thinking', 4)
ON CONFLICT DO NOTHING;

-- Young Engineers - Outcomes
INSERT INTO program_outcomes (program_id, outcome, display_order) VALUES
('young-engineers', 'Proficiency in block-based coding', 0),
('young-engineers', 'Understanding of sensors and actuators', 1),
('young-engineers', 'Project management skills', 2),
('young-engineers', 'Computational thinking', 3),
('young-engineers', 'Effective team collaboration', 4)
ON CONFLICT DO NOTHING;

-- Young Engineers - Projects
INSERT INTO program_projects (program_id, project, display_order) VALUES
('young-engineers', 'Line-following robots', 0),
('young-engineers', 'Obstacle-avoiding cars', 1),
('young-engineers', 'Smart home automation models', 2),
('young-engineers', 'Interactive games and animations', 3)
ON CONFLICT DO NOTHING;

-- Tech Pioneers - Highlights
INSERT INTO program_highlights (program_id, highlight, display_order) VALUES
('tech-pioneers', 'Text-based programming (Python, C++)', 0),
('tech-pioneers', 'Advanced Arduino projects', 1),
('tech-pioneers', '3D design and printing basics', 2),
('tech-pioneers', 'Competition preparation', 3),
('tech-pioneers', 'Engineering documentation', 4)
ON CONFLICT DO NOTHING;

-- Tech Pioneers - Outcomes
INSERT INTO program_outcomes (program_id, outcome, display_order) VALUES
('tech-pioneers', 'Proficiency in Python basics', 0),
('tech-pioneers', 'Advanced electronics understanding', 1),
('tech-pioneers', 'Competition-ready skills', 2),
('tech-pioneers', 'Technical documentation skills', 3),
('tech-pioneers', 'Independent problem-solving', 4)
ON CONFLICT DO NOTHING;

-- Tech Pioneers - Projects
INSERT INTO program_projects (program_id, project, display_order) VALUES
('tech-pioneers', 'Autonomous robots for competitions', 0),
('tech-pioneers', 'IoT weather stations', 1),
('tech-pioneers', 'Robotic arms with sensors', 2),
('tech-pioneers', 'App-controlled devices', 3)
ON CONFLICT DO NOTHING;

-- Innovation Lab - Highlights
INSERT INTO program_highlights (program_id, highlight, display_order) VALUES
('innovation-lab', 'Full-stack web development', 0),
('innovation-lab', 'AI and machine learning basics', 1),
('innovation-lab', 'Advanced IoT projects', 2),
('innovation-lab', 'Industry-level tools and practices', 3),
('innovation-lab', 'Career guidance and portfolio building', 4)
ON CONFLICT DO NOTHING;

-- Innovation Lab - Outcomes
INSERT INTO program_outcomes (program_id, outcome, display_order) VALUES
('innovation-lab', 'Job-ready programming skills', 0),
('innovation-lab', 'Understanding of AI/ML concepts', 1),
('innovation-lab', 'Professional portfolio', 2),
('innovation-lab', 'University application support', 3),
('innovation-lab', 'Industry connections', 4)
ON CONFLICT DO NOTHING;

-- Innovation Lab - Projects
INSERT INTO program_projects (program_id, project, display_order) VALUES
('innovation-lab', 'Full-stack web applications', 0),
('innovation-lab', 'AI-powered robots', 1),
('innovation-lab', 'Mobile apps with IoT integration', 2),
('innovation-lab', 'Capstone industry projects', 3)
ON CONFLICT DO NOTHING;
