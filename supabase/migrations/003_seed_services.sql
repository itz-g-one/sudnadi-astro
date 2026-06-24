-- ============================================================
-- Astrosuman — Seed Data
-- ============================================================
-- Populates services, blog_posts, testimonials, and site_settings
-- with the existing static data from the frontend.
-- ============================================================

-- ─── SERVICES ───────────────────────────────────────────────

INSERT INTO public.services (slug, name, price, category, tagline, description, delivery_text, covers, receive, faqs, sort_order) VALUES
(
  'kundli-report',
  'Kundli Report',
  499,
  'personal',
  'Your complete birth chart, decoded',
  'A full Vedic birth chart reading covering your life path, career arc, relationships, finances and key timings — written personally for you, not generated.',
  '3–5 business days',
  '["Planetary placements across all twelve houses","Dasha periods — what is active now and what''s coming next","Career, finance and relationship outlook","Key strengths and areas to handle with care","Specific timings for major life decisions"]'::jsonb,
  '["A detailed 12–15 page PDF report by email","Your full Vedic birth chart (Lagna, Navamsa, Chalit)","Personalised remedy guidance — simple and practical","One round of follow-up over WhatsApp"]'::jsonb,
  '[{"q":"How do I receive my report?","a":"After payment we prepare your reading personally and email a detailed PDF within 3–5 business days. We never send templated or auto-generated reports."},{"q":"What details do I need to provide?","a":"Your full name as on documents, date of birth, exact birth time (from hospital records if possible), and place of birth. The more precise the time, the more precise the reading."},{"q":"Can I ask follow-up questions?","a":"Yes. Every consultation includes one round of follow-up clarification over WhatsApp or email within 14 days of delivery."},{"q":"Is my information kept private?","a":"Always. Your birth details and reading are confidential and never shared, sold, or used in marketing."}]'::jsonb,
  1
),
(
  'career-report',
  'Career Report',
  151,
  'professional',
  'Find work that finally fits',
  'Discover the profession your chart actually supports, the right time for a switch, and how to navigate the next two years of your work life.',
  '2–3 business days',
  '["Career fields aligned with your tenth house and planetary strengths","Best windows for job changes, promotions and new ventures","Whether business or service suits you better","Obstacles your chart is currently working through"]'::jsonb,
  '["A 6–8 page career-focused PDF report","Specific industries and roles to consider","Timing guidance for the next 24 months","Practical remedies to ease career friction"]'::jsonb,
  '[{"q":"How do I receive my report?","a":"After payment we prepare your reading personally and email a detailed PDF within 2–3 business days. We never send templated or auto-generated reports."},{"q":"What details do I need to provide?","a":"Your full name as on documents, date of birth, exact birth time (from hospital records if possible), and place of birth. The more precise the time, the more precise the reading."},{"q":"Can I ask follow-up questions?","a":"Yes. Every consultation includes one round of follow-up clarification over WhatsApp or email within 14 days of delivery."},{"q":"Is my information kept private?","a":"Always. Your birth details and reading are confidential and never shared, sold, or used in marketing."}]'::jsonb,
  2
),
(
  'health-report',
  'Health Report',
  151,
  'health',
  'Listen to what your chart says about your body',
  'Astrological patterns that reveal long-term health tendencies and the lifestyle adjustments your chart is asking you to make.',
  '2–3 business days',
  '["Health-sensitive houses and planetary influences in your chart","Areas of the body that need extra care","Periods that may bring more strain","Preventive lifestyle and dietary guidance"]'::jsonb,
  '["A 6–8 page health-focused PDF report","Long-term wellness recommendations","Ayurvedic and Vedic remedies suited to your chart","Follow-up clarification over WhatsApp"]'::jsonb,
  '[{"q":"How do I receive my report?","a":"After payment we prepare your reading personally and email a detailed PDF within 2–3 business days. We never send templated or auto-generated reports."},{"q":"What details do I need to provide?","a":"Your full name as on documents, date of birth, exact birth time (from hospital records if possible), and place of birth. The more precise the time, the more precise the reading."},{"q":"Can I ask follow-up questions?","a":"Yes. Every consultation includes one round of follow-up clarification over WhatsApp or email within 14 days of delivery."},{"q":"Is my information kept private?","a":"Always. Your birth details and reading are confidential and never shared, sold, or used in marketing."}]'::jsonb,
  3
),
(
  'love-marriage',
  'Love & Marriage Compatibility',
  151,
  'relationship',
  'Honest answers about your relationship',
  'A complete horoscope matching for love or arranged marriage — Guna milan plus a deeper look at emotional, financial and karmic compatibility.',
  '2–3 business days',
  '["Guna milan score and what the points actually mean","Mangal dosha check for both partners","Emotional, mental and financial compatibility","Likely friction points and how to handle them","Most auspicious windows for marriage"]'::jsonb,
  '["A detailed compatibility PDF (both charts side by side)","Honest, balanced verdict — not just a score","Remedies for any doshas found","Follow-up clarification over WhatsApp"]'::jsonb,
  '[{"q":"How do I receive my report?","a":"After payment we prepare your reading personally and email a detailed PDF within 2–3 business days. We never send templated or auto-generated reports."},{"q":"What details do I need to provide?","a":"Your full name as on documents, date of birth, exact birth time (from hospital records if possible), and place of birth. The more precise the time, the more precise the reading."},{"q":"Can I ask follow-up questions?","a":"Yes. Every consultation includes one round of follow-up clarification over WhatsApp or email within 14 days of delivery."},{"q":"Is my information kept private?","a":"Always. Your birth details and reading are confidential and never shared, sold, or used in marketing."}]'::jsonb,
  4
),
(
  'gemstone-report',
  'Gemstone Report',
  151,
  'remedies',
  'The exact stone your chart actually needs',
  'The wrong gemstone can hurt more than help. Find the precise stone, weight, metal and finger that your birth chart genuinely supports.',
  '2–3 business days',
  '["Which planet in your chart needs strengthening","Primary gemstone and a budget-friendly substitute","Recommended weight in carats and metal","Finger, day and procedure for wearing it"]'::jsonb,
  '["A 4–6 page gemstone recommendation PDF","Sanctified mantra to energise the stone","Stones to avoid for your chart","Follow-up clarification over WhatsApp"]'::jsonb,
  '[{"q":"How do I receive my report?","a":"After payment we prepare your reading personally and email a detailed PDF within 2–3 business days. We never send templated or auto-generated reports."},{"q":"What details do I need to provide?","a":"Your full name as on documents, date of birth, exact birth time (from hospital records if possible), and place of birth. The more precise the time, the more precise the reading."},{"q":"Can I ask follow-up questions?","a":"Yes. Every consultation includes one round of follow-up clarification over WhatsApp or email within 14 days of delivery."},{"q":"Is my information kept private?","a":"Always. Your birth details and reading are confidential and never shared, sold, or used in marketing."}]'::jsonb,
  5
),
(
  'ask-question',
  'Ask a Question',
  151,
  'specialized',
  'One specific question, one honest answer',
  'Have one focused question? Submit it with your birth details and receive a precise, personalised astrological answer within two days.',
  '1–2 business days',
  '["Any one specific question on career, marriage, health, finance, study, travel or family","Direct yes/no/timing answer wherever the chart allows","Reasoning from your dasha and transit chart","Optional remedy if one is genuinely needed"]'::jsonb,
  '["A focused 2–3 page answer document","Direct response to your specific question","One round of follow-up clarification"]'::jsonb,
  '[{"q":"How do I receive my report?","a":"After payment we prepare your reading personally and email a detailed PDF within 1–2 business days. We never send templated or auto-generated reports."},{"q":"What details do I need to provide?","a":"Your full name as on documents, date of birth, exact birth time (from hospital records if possible), and place of birth. The more precise the time, the more precise the reading."},{"q":"Can I ask follow-up questions?","a":"Yes. Every consultation includes one round of follow-up clarification over WhatsApp or email within 14 days of delivery."},{"q":"Is my information kept private?","a":"Always. Your birth details and reading are confidential and never shared, sold, or used in marketing."}]'::jsonb,
  6
),
(
  'vedic-cards',
  'Vedic Cards Reading',
  151,
  'specialized',
  'Insight into the next six months',
  'An ancient Vedic card reading focused on your present situation and the near future — a quick, intuitive complement to a full Kundli.',
  '1–2 business days',
  '["Your current emotional and situational landscape","Themes likely to unfold over the next six months","What to embrace and what to release","One actionable guidance card per life area"]'::jsonb,
  '["A 3–4 page card-reading PDF","Image of your spread with interpretations","Follow-up clarification over WhatsApp"]'::jsonb,
  '[{"q":"How do I receive my report?","a":"After payment we prepare your reading personally and email a detailed PDF within 1–2 business days. We never send templated or auto-generated reports."},{"q":"What details do I need to provide?","a":"Your full name as on documents, date of birth, exact birth time (from hospital records if possible), and place of birth. The more precise the time, the more precise the reading."},{"q":"Can I ask follow-up questions?","a":"Yes. Every consultation includes one round of follow-up clarification over WhatsApp or email within 14 days of delivery."},{"q":"Is my information kept private?","a":"Always. Your birth details and reading are confidential and never shared, sold, or used in marketing."}]'::jsonb,
  7
),
(
  'nadi-education',
  'Nadi Astrology Education Report',
  151,
  'education',
  'Learn Nadi through your own chart',
  'An accessible introduction to the principles of Nadi Astrology, explained step by step using the planets, houses and patterns in your own birth chart.',
  '3–5 business days',
  '["Foundations of Nadi Astrology and how it differs from Vedic","How to read your own chart at a beginner level","Worked examples drawn from your specific chart","Recommended next steps if you want to study further"]'::jsonb,
  '["A 10–12 page educational PDF tailored to your chart","Diagrams and worked examples","Resource list for further study"]'::jsonb,
  '[{"q":"How do I receive my report?","a":"After payment we prepare your reading personally and email a detailed PDF within 3–5 business days. We never send templated or auto-generated reports."},{"q":"What details do I need to provide?","a":"Your full name as on documents, date of birth, exact birth time (from hospital records if possible), and place of birth. The more precise the time, the more precise the reading."},{"q":"Can I ask follow-up questions?","a":"Yes. Every consultation includes one round of follow-up clarification over WhatsApp or email within 14 days of delivery."},{"q":"Is my information kept private?","a":"Always. Your birth details and reading are confidential and never shared, sold, or used in marketing."}]'::jsonb,
  8
),
(
  'nadi-remedies',
  'Nadi Astrology Remedies',
  151,
  'remedies',
  'Targeted remedies for stubborn blocks',
  'If a specific area of life keeps stalling — work, marriage, money, health — these are the Nadi remedies precisely matched to the planetary pattern blocking you.',
  '2–3 business days',
  '["Which planet/house pattern is creating the block","Mantras, donations and ritual remedies suited to your chart","Simple daily practices you can actually sustain","Timing for performing each remedy"]'::jsonb,
  '["A 5–7 page remedy PDF tailored to your concern","Step-by-step instructions for each remedy","Follow-up clarification over WhatsApp"]'::jsonb,
  '[{"q":"How do I receive my report?","a":"After payment we prepare your reading personally and email a detailed PDF within 2–3 business days. We never send templated or auto-generated reports."},{"q":"What details do I need to provide?","a":"Your full name as on documents, date of birth, exact birth time (from hospital records if possible), and place of birth. The more precise the time, the more precise the reading."},{"q":"Can I ask follow-up questions?","a":"Yes. Every consultation includes one round of follow-up clarification over WhatsApp or email within 14 days of delivery."},{"q":"Is my information kept private?","a":"Always. Your birth details and reading are confidential and never shared, sold, or used in marketing."}]'::jsonb,
  9
);

-- ─── BLOG POSTS ─────────────────────────────────────────────

INSERT INTO public.blog_posts (slug, title, category, excerpt, body, read_time, published, published_at) VALUES
(
  'understanding-your-kundli',
  'Understanding Your Kundli: A Beginner''s Complete Guide',
  'Kundli',
  'Your Kundli is a cosmic snapshot of the sky at the moment you were born. Every house, planet, and sign placement tells a chapter of your life story — here''s how to start reading it.',
  E'A Kundli, or Janma Kundli, is a chart of the sky at the precise moment of your birth. It is drawn for a specific time and place because the planets shift roughly one degree every four minutes — even twins born ten minutes apart can have meaningfully different charts.\n\nThe chart is divided into twelve houses, each representing a domain of life: self, wealth, communication, home, creativity, health, partnerships, transformation, beliefs, career, networks and release. The planets sitting in those houses describe how that area of your life tends to unfold.\n\nThe first thing a good astrologer looks at is the Lagna or rising sign. This is the house that was on the eastern horizon at the time of your birth and it sets the entire orientation of your chart. From the Lagna you then read planet placements, aspects between planets, and the running dasha — the planetary period currently active in your life.\n\nReading a Kundli is not about predicting a fixed future. It is closer to reading a weather pattern: you can see which seasons are likely to bring rain, which years are likely to be steady, and how to prepare for either. The chart describes tendencies, timings and themes — your choices still shape how they actually play out.\n\nIf you are just starting out, focus on three things first: your rising sign, the placement of the Moon (which describes your emotional life), and the current Maha Dasha. Those three together already explain a surprising amount of how the last few years of your life have felt.',
  6,
  true,
  '2025-05-20T00:00:00Z'
),
(
  'numerology-life-path-number',
  'Your Life Path Number and What It Reveals',
  'Numerology',
  'Every person carries one number, derived from their birth date, that quietly shapes the broad themes of their life. Here is how to calculate yours and what it actually means.',
  E'Your Life Path Number is calculated by adding every digit of your full date of birth and reducing the total to a single digit. For example, 14 August 1992 becomes 1+4+8+1+9+9+2 = 34, then 3+4 = 7. The Life Path Number is 7.\n\nEach number from 1 to 9 has a recognisable character. 1 is initiation and independence. 2 is partnership and patience. 3 is expression and creativity. 4 is structure and persistence. 5 is movement and adaptability. 6 is care and responsibility. 7 is depth and analysis. 8 is power and material achievement. 9 is compassion and completion.\n\nMaster numbers — 11, 22 and 33 — are not reduced further. They carry a heightened intensity of 2, 4 and 6 respectively, and usually come with both higher potential and a heavier load to carry.\n\nWhere numerology is most useful is in noticing the friction in your life. A 4 trying to live like a 5 will feel constantly destabilised. A 7 forced into a fast, social profession will feel drained. Knowing your number does not change your circumstances, but it changes how you choose your environment.',
  5,
  true,
  '2025-05-14T00:00:00Z'
),
(
  'vedic-remedies-career-growth',
  '5 Powerful Vedic Remedies for Career Growth',
  'Remedies',
  'Vedic astrology offers practical remedies to ease planetary blocks on your career. These five are the most effective and the easiest to sustain.',
  E'1. Strengthen the Sun. The Sun governs your authority and visibility at work. Offering water to the rising Sun every morning, taking a moment to face east, is a deceptively simple practice that has worked for centuries.\n\n2. Respect Saturn. Saturn rules discipline, structure and the slow grind of career-building. Avoiding shortcuts, doing your work cleanly even when no one is watching, and donating black sesame or iron on Saturdays are traditional ways to keep Saturn favourable.\n\n3. Chant the Gayatri Mantra. Eleven repetitions every morning, ideally before sunrise, clears mental fog and sharpens decision-making — qualities your career compounds on.\n\n4. Keep Wednesday clean. Mercury governs communication, contracts and skill. On Wednesdays, eat lightly, avoid major arguments, and review your work carefully. Small Wednesday-day discipline goes a long way.\n\n5. Donate where it counts. Once a month, donate food, books or money to a cause that genuinely improves someone''s livelihood. Career karma is a direct beneficiary of livelihood-related charity.\n\nThese are not magic. They are patterns of behaviour that, when held steadily for six to twelve months, gently shift how planetary energies express through your work life.',
  4,
  true,
  '2025-05-08T00:00:00Z'
),
(
  'nadi-astrology-explained',
  'What is Nadi Astrology? Ancient Science Explained',
  'Nadi',
  'Nadi Astrology is one of the most precise branches of Indian astrology, rooted in palm leaf manuscripts from Tamil Nadu. Here is what makes it different and why it works.',
  E'Nadi Astrology is believed to have been authored by ancient seers — Agastya, Bhrigu, Kaushika and others — who recorded the lives of millions of individuals on palm leaves, indexed by thumbprint. A genuine Nadi reading involves locating your specific palm leaf, which contains the broad outline of your past, present and future.\n\nCompared with standard Vedic astrology, Nadi readings are unusually specific. They name parents, siblings, partners, professions and timing of major events. The system that supports this precision is structured around planetary positions read through Nadi amsa — finer divisions of each zodiac sign than most other branches use.\n\nModern Nadi practice, especially outside Tamil Nadu, often refers to a derived form: applying Nadi principles to a standard birth chart. This is what most online Nadi readings actually are, including the educational reports offered here. They are not the original palm-leaf reading, but they do bring Nadi-style precision to a regular Kundli.\n\nIf you are evaluating a Nadi astrologer, the marker of quality is specificity without theatrics. Vague spiritual language is easy. Naming the year a relationship will solidify, or the kind of work you will end up in, is hard. Look for the latter.',
  7,
  true,
  '2025-04-30T00:00:00Z'
),
(
  'marriage-timing-astrology',
  'How Astrology Predicts the Right Time to Marry',
  'Relationship',
  'The seventh house, Venus and Jupiter together describe when marriage is likely to happen. Reading them well takes nuance — here is how it works.',
  E'Marriage timing in Vedic astrology rests primarily on the seventh house (partnership), Venus (love and harmony for men, marriage indicator for both), and Jupiter (commitment and expansion, marriage indicator for women).\n\nThe current dasha is the next layer. A favourable seventh-house lord period, especially combined with a Venus or Jupiter sub-period, often coincides with marriage discussions becoming serious.\n\nThen comes transit. The transit of Jupiter through your seventh house, or its aspect on your seventh-house lord, is one of the most reliable triggers for marriage in the next 12 to 18 months.\n\nWhat good astrologers avoid is a single fixed date. Marriage is the joint outcome of two charts, family dynamics, and personal choice. What a chart can honestly offer is a small set of windows — usually two or three across a few years — when the conditions are most supportive.',
  5,
  true,
  '2025-04-22T00:00:00Z'
),
(
  'gemstones-birth-chart',
  'The Right Gemstone for Your Birth Chart',
  'Remedies',
  'Not every gemstone is right for every person. Wearing the wrong stone can drain you. Here is how to know which gemstone your chart actually calls for.',
  E'Gemstones in Vedic astrology work by amplifying the energy of the planet they are associated with — ruby for the Sun, pearl for the Moon, red coral for Mars, emerald for Mercury, yellow sapphire for Jupiter, diamond for Venus, blue sapphire for Saturn.\n\nAmplification cuts both ways. Strengthening a planet that is already creating trouble in your chart can intensify the problem. This is why a chart-specific recommendation matters more than buying the gemstone of your zodiac sign.\n\nThe right stone is usually for a planet that is well-placed but weak, or for the lord of a house you want to support. A trained astrologer reads the strength of each planet, the houses they rule for you specifically, and the current dasha before recommending anything.\n\nIf you are unsure, the safest starting point is a chart reading first, then a gemstone recommendation. Buying a stone before knowing your chart is the most common — and most expensive — mistake people make with Vedic remedies.',
  4,
  true,
  '2025-04-15T00:00:00Z'
);

-- ─── TESTIMONIALS ───────────────────────────────────────────

INSERT INTO public.testimonials (name, location, rating, review, approved, sort_order) VALUES
('Gauresh', 'Bengaluru', 5, 'I took a consultation last year for a career switch I had been dreading. Sudhansu ji''s reading was specific — the right window, the right kind of role, even the friction I''d face in month two. All of it played out exactly. I send everyone in my family to him now.', true, 1),
('Viny', 'Pune', 5, 'He picked up things about my past that no one in my life knew. That''s when I stopped doubting and started listening. Six months in, the things he said would settle have settled. Quietly, calmly, exactly as he said.', true, 2),
('Nandu Dixit', 'Indore', 5, 'What I appreciate is how grounded he is. No fear, no big promises, no expensive stones to buy. Just clear reasoning and small, doable remedies. My work life turned around within four months of following his guidance.', true, 3),
('Animesh', 'Delhi NCR', 5, 'Honest and balanced. He told me what was working in my chart and what was not, without sugar-coating either. I left the session feeling clearer, not anxious. That''s rare with astrologers in my experience.', true, 4),
('Adhiti Desai', 'Mumbai', 5, 'I came in with a marriage decision and walked away with much more — a real understanding of my own chart. Three years later I still go back to his report. The accuracy and the warmth are both real.', true, 5);

-- ─── SITE SETTINGS ──────────────────────────────────────────

INSERT INTO public.site_settings (key, value) VALUES
('whatsapp_number', '"919717691644"'),
('admin_email', '"Erssuman18@gmail.com"'),
('support_email', '"Erssuman18@gmail.com"'),
('payu_mode', '"test"'),
('social_links', '{"whatsapp": "https://wa.me/919717691644", "email": "mailto:Erssuman18@gmail.com"}'),
('footer_text', '"© Astrosuman. All rights reserved."'),
('seo_defaults', '{"title": "Astrosuman — Nadi Astrologer, Numerologist & Vedic Card Reader", "description": "Personalised Nadi Astrology, Numerology and Vedic Card readings by Sudhansu Suman."}'),
('site_name', '"Astrosuman"');
