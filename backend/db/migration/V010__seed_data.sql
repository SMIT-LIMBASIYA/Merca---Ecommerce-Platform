-- ============================================================================
-- V010: Development Seed Data
-- ============================================================================
-- Creates realistic test data to verify all major flows
-- Deterministic IDs are used for tables where records are referenced later in this script.
-- ============================================================================

-- ──────── USERS ────────

INSERT INTO users (id, email, password_hash, role, status, email_verified, phone, phone_verified) OVERRIDING SYSTEM VALUE VALUES
    (1, 'alice@example.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER', 'ACTIVE', TRUE,  '+91-9876543210', TRUE),
    (2, 'bob@example.com',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER', 'ACTIVE', TRUE,  '+91-9876543211', TRUE),
    (3, 'priya@example.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER', 'ACTIVE', FALSE, '+91-9876543212', FALSE),
    (4, 'electroworld@example.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SELLER',   'ACTIVE', TRUE,  '+91-9800000001', TRUE),
    (5, 'techdeals@example.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SELLER',   'ACTIVE', TRUE,  '+91-9800000002', TRUE),
    (6, 'gadgetzone@example.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SELLER',   'ACTIVE', TRUE,  '+91-9800000003', TRUE),
    (7, 'admin@merca.in',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN',    'ACTIVE', TRUE,  NULL, FALSE);

ALTER TABLE users ALTER COLUMN id RESTART WITH 100;

INSERT INTO customers (user_id, first_name, last_name, display_name, date_of_birth, gender) VALUES
    (1, 'Alice', 'Johnson',  'Alice J.',  '1995-03-15', 'FEMALE'),
    (2, 'Bob',   'Williams', 'Bob W.',    '1990-07-22', 'MALE'),
    (3, 'Priya', 'Sharma',   'Priya S.',  '1998-11-01', 'FEMALE');

INSERT INTO sellers (user_id, company_name, display_name, slug, business_type, tax_id, gst_number, business_email, business_phone, description, address_line1, city, state, postal_code, country, commission_rate, is_verified, verified_at, status) VALUES
    (4, 'ElectroWorld Pvt. Ltd.',  'ElectroWorld',  'electroworld',  'COMPANY',     'AABCE1234F', '29ABCDE1234F1Z5', 'support@electroworld.in', '+91-8000000001', 'Premium electronics retailer since 2010. Authorized dealer for Apple, Samsung, and Sony.', '123 Electronics Hub, Koramangala', 'Bangalore', 'Karnataka',   '560034', 'IND', 8.50,  TRUE, now() - interval '1 year', 'ACTIVE'),
    (5, 'TechDeals India',         'TechDeals',     'techdeals',     'COMPANY',     'AABCD5678G', '29FGHIJ5678K2Z6', 'info@techdeals.in',       '+91-8000000002', 'Best deals on tech products. Fast shipping across India.',                                   '45 Tech Park, Whitefield',         'Bangalore', 'Karnataka',   '560066', 'IND', 10.00, TRUE, now() - interval '6 months', 'ACTIVE'),
    (6, 'GadgetZone',              'GadgetZone',    'gadgetzone',    'INDIVIDUAL',  'AABCG9012H', '29KLMNO9012L3Z7', 'hello@gadgetzone.in',     '+91-8000000003', 'Your one-stop shop for gadgets and accessories.',                                           '78 Commercial Street',             'Mumbai',    'Maharashtra', '400001', 'IND', 12.00, TRUE, now() - interval '3 months', 'ACTIVE');

INSERT INTO seller_bank_accounts (id, seller_id, account_holder_name, bank_name, account_number_masked, account_number_hash, ifsc_code, branch_name, account_type, is_primary, is_verified) OVERRIDING SYSTEM VALUE VALUES
    (1, 4, 'ElectroWorld Pvt Ltd', 'HDFC Bank', 'XXXX4321', 'hash_ew_4321', 'HDFC0001234', 'Koramangala Branch', 'CURRENT', TRUE, TRUE),
    (2, 5, 'TechDeals India',      'ICICI Bank','XXXX8765', 'hash_td_8765', 'ICIC0005678', 'Whitefield Branch',  'CURRENT', TRUE, TRUE),
    (3, 6, 'GadgetZone',           'SBI',       'XXXX2109', 'hash_gz_2109', 'SBIN0009012', 'Commercial St Branch','SAVINGS',TRUE, TRUE);

ALTER TABLE seller_bank_accounts ALTER COLUMN id RESTART WITH 100;

-- ──────── CATEGORIES ────────

INSERT INTO categories (id, parent_id, name, slug, description, display_order, level, is_active) OVERRIDING SYSTEM VALUE VALUES
    (1, NULL, 'Electronics',     'electronics',     'Electronic devices and gadgets',           1, 0, TRUE),
    (2, NULL, 'Accessories',     'accessories',     'Phone and laptop accessories',             2, 0, TRUE),
    (3, NULL, 'Home & Kitchen',  'home-kitchen',    'Home appliances and kitchen essentials',   3, 0, TRUE),
    (4, 1,    'Smartphones',     'smartphones',     'Latest smartphones from top brands',       1, 1, TRUE),
    (5, 1,    'Laptops',         'laptops',         'Laptops for work, gaming, and everyday use',2, 1, TRUE),
    (6, 1,    'Tablets',         'tablets',         'Tablets and e-readers',                    3, 1, TRUE),
    (7, 2,    'Phone Cases',     'phone-cases',     'Protective cases for smartphones',         1, 1, TRUE),
    (8, 2,    'Chargers',        'chargers',        'Fast chargers and wireless chargers',      2, 1, TRUE),
    (9, 2,    'Headphones',      'headphones',      'Wired and wireless headphones',            3, 1, TRUE),
    (10, 4,   'Android Phones',  'android-phones',  'Android smartphones',                      1, 2, TRUE),
    (11, 4,   'iPhones',         'iphones',         'Apple iPhones',                             2, 2, TRUE);

ALTER TABLE categories ALTER COLUMN id RESTART WITH 100;

-- ──────── PRODUCTS ────────

INSERT INTO products (id, title, slug, description, short_description, brand, manufacturer, model_number, country_of_origin, weight_grams, length_mm, width_mm, height_mm, warranty_months, is_featured, specifications, tags, meta_title, meta_description, status) OVERRIDING SYSTEM VALUE VALUES
    (1, 'iPhone 17 Pro',
     'iphone-17-pro',
     'The most advanced iPhone ever. Featuring the A19 Pro chip, 48MP main camera with 5x optical zoom, titanium design, and USB-C.',
     'Latest flagship with A19 Pro chip and titanium design',
     'Apple', 'Apple Inc.', 'A3101', 'IND', 187, 147, 71, 8, 12, TRUE,
     '{"Processor": "A19 Pro", "RAM": "8GB", "Storage": "256GB"}',
     ARRAY['5g', 'flagship', 'apple', 'titanium', 'usb-c', 'pro'],
     'iPhone 17 Pro - Buy at Best Price | Mini Amazon',
     'Buy iPhone 17 Pro with A19 Pro chip.',
     'ACTIVE'),

    (2, 'Samsung Galaxy S25 Ultra',
     'samsung-galaxy-s25-ultra',
     'Samsung ultimate flagship with Snapdragon 8 Elite, 200MP camera, S Pen.',
     'Samsung flagship with 200MP camera and S Pen',
     'Samsung', 'Samsung Electronics', 'SM-S938B', 'KOR', 218, 163, 78, 9, 12, TRUE,
     '{"Processor": "Snapdragon 8 Elite", "RAM": "12GB", "Storage": "256GB"}',
     ARRAY['5g', 'flagship', 'samsung', 's-pen', 'android'],
     'Samsung Galaxy S25 Ultra - Best Deals | Mini Amazon',
     'Buy Samsung Galaxy S25 Ultra. 200MP camera.',
     'ACTIVE'),

    (3, 'MacBook Air M4',
     'macbook-air-m4',
     'Supercharged by M4 chip. Stunningly thin design, Liquid Retina display.',
     'Ultra-thin laptop with M4 chip and 18hr battery',
     'Apple', 'Apple Inc.', 'MXK23HN/A', 'IND', 1240, 304, 215, 11, 12, TRUE,
     '{"Processor": "Apple M4", "RAM": "16GB", "Storage": "256GB SSD"}',
     ARRAY['laptop', 'apple', 'ultrabook', 'm4', 'macbook'],
     'MacBook Air M4 - Best Price | Mini Amazon',
     'Buy MacBook Air M4 with 18-hour battery.',
     'ACTIVE'),

    (4, 'USB-C Fast Charger 65W',
     'usb-c-fast-charger-65w',
     'Anker Nano II 65W USB-C charger with GaN II technology.',
     'Ultra-compact 65W GaN charger for laptops and phones',
     'Anker', 'Anker Innovations', 'A2663', 'CHN', 112, 42, 36, 30, 18, FALSE,
     '{"Wattage": "65W", "Technology": "GaN II"}',
     ARRAY['charger', 'usb-c', 'gan', 'fast-charging', 'pd'],
     'Anker 65W USB-C Charger | Mini Amazon',
     'Anker 65W GaN fast charger.',
     'ACTIVE'),

    (5, 'Premium Silicone Case for iPhone 17',
     'spigen-silicone-case-iphone-17',
     'MagSafe-compatible liquid silicone case with soft microfiber lining.',
     'MagSafe silicone case with microfiber lining',
     'Spigen', 'Spigen Inc.', 'ACS06421', 'KOR', 28, 150, 75, 10, 6, FALSE,
     '{"Material": "Liquid Silicone", "MagSafe": "Yes"}',
     ARRAY['case', 'iphone', 'silicone', 'magsafe', 'spigen'],
     'Spigen Silicone Case iPhone 17 | Mini Amazon',
     'MagSafe-compatible silicone case for iPhone 17.',
     'ACTIVE'),

    (6, 'Sony WH-1000XM6 Headphones',
     'sony-wh-1000xm6',
     'Industry-leading noise cancellation with Auto NC Optimizer.',
     'Premium noise-cancelling wireless headphones',
     'Sony', 'Sony Corporation', 'WH-1000XM6', 'JPN', 250, 195, 170, 78, 12, TRUE,
     '{"Driver": "40mm", "ANC": "Yes - Auto NC Optimizer"}',
     ARRAY['headphones', 'wireless', 'anc', 'sony', 'bluetooth'],
     'Sony WH-1000XM6 Noise Cancelling Headphones | Mini Amazon',
     'Sony WH-1000XM6. Best-in-class noise cancellation.',
     'ACTIVE');

ALTER TABLE products ALTER COLUMN id RESTART WITH 100;

-- Product ↔ Category
INSERT INTO product_categories (product_id, category_id) VALUES
    (1, 1), (1, 4), (1, 11),
    (2, 1), (2, 4), (2, 10),
    (3, 1), (3, 5),
    (4, 2), (4, 8),
    (5, 2), (5, 7),
    (6, 1), (6, 9);

-- Product images
INSERT INTO product_images (id, product_id, image_url, thumbnail_url, alt_text, display_order, is_primary) OVERRIDING SYSTEM VALUE VALUES
    (1, 1, '/images/iphone17pro-front.webp',    '/images/thumb/iphone17pro-front.webp',    'iPhone 17 Pro front view',    0, TRUE),
    (2, 1, '/images/iphone17pro-back.webp',     '/images/thumb/iphone17pro-back.webp',     'iPhone 17 Pro back view',     1, FALSE),
    (3, 1, '/images/iphone17pro-side.webp',     '/images/thumb/iphone17pro-side.webp',     'iPhone 17 Pro side view',     2, FALSE),
    (4, 2, '/images/galaxy-s25-ultra.webp',     '/images/thumb/galaxy-s25-ultra.webp',     'Galaxy S25 Ultra front',      0, TRUE),
    (5, 2, '/images/galaxy-s25-camera.webp',    '/images/thumb/galaxy-s25-camera.webp',    'Galaxy S25 Ultra camera',     1, FALSE),
    (6, 3, '/images/macbook-air-m4.webp',       '/images/thumb/macbook-air-m4.webp',       'MacBook Air M4 open view',    0, TRUE),
    (7, 4, '/images/anker-65w-charger.webp',    '/images/thumb/anker-65w-charger.webp',    'Anker 65W Charger',           0, TRUE),
    (8, 5, '/images/spigen-case-iphone17.webp', '/images/thumb/spigen-case-iphone17.webp', 'Spigen Silicone Case',        0, TRUE),
    (9, 6, '/images/sony-xm6.webp',            '/images/thumb/sony-xm6.webp',             'Sony WH-1000XM6',             0, TRUE);

ALTER TABLE product_images ALTER COLUMN id RESTART WITH 100;

-- ──────── LISTINGS (3 sellers, different prices) ────────

INSERT INTO listings (id, product_id, seller_id, seller_sku, price_cents, mrp_cents, currency, tax_rate, condition, min_order_quantity, max_order_quantity, shipping_fee_cents, free_shipping_threshold_cents, estimated_delivery_days, handling_time_days, is_returnable, return_window_days, is_cod_available, status, activated_at) OVERRIDING SYSTEM VALUE VALUES
    -- iPhone 17 Pro: 3 sellers
    (1, 1, 4, 'EW-IPH17P-256', 13499900, 13999900, 'INR', 18.00, 'NEW', 1, 2, 0,    NULL,    3, 1, TRUE, 7,  TRUE, 'ACTIVE', now()),
    (2, 1, 5, 'TD-IP17PRO',    13199900, 13999900, 'INR', 18.00, 'NEW', 1, 3, 0,    NULL,    4, 1, TRUE, 10, TRUE, 'ACTIVE', now()),
    (3, 1, 6, 'GZ-APL-17P',    13999900, 13999900, 'INR', 18.00, 'NEW', 1, 5, 4900, 10000000, 5, 2, TRUE, 7,  TRUE, 'ACTIVE', now()),
    -- Galaxy S25 Ultra: 2 sellers
    (4, 2, 4, 'EW-GS25U-256',  12499900, 13499900, 'INR', 18.00, 'NEW', 1, 2, 0,    NULL,    3, 1, TRUE, 7,  TRUE, 'ACTIVE', now()),
    (5, 2, 5, 'TD-GS25ULTRA',  12199900, 13499900, 'INR', 18.00, 'NEW', 1, 3, 0,    NULL,    4, 2, TRUE, 10, TRUE, 'ACTIVE', now()),
    -- MacBook Air M4: 1 seller
    (6, 3, 4, 'EW-MBA-M4-256', 11499900, 11999900, 'INR', 18.00, 'NEW', 1, 1, 0,    NULL,    5, 2, TRUE, 7,  FALSE,'ACTIVE', now()),
    -- USB-C Charger: 2 sellers
    (7, 4, 5, 'TD-ANKR65W',    299900,   349900,   'INR', 18.00, 'NEW', 1, 5, 4900, 100000,  3, 1, TRUE, 15, TRUE, 'ACTIVE', now()),
    (8, 4, 6, 'GZ-CHG-65W',    329900,   349900,   'INR', 18.00, 'NEW', 1, 10,0,    NULL,    4, 1, TRUE, 15, TRUE, 'ACTIVE', now()),
    -- iPhone Case: 1 seller
    (9, 5, 6, 'GZ-CASE-IP17',  129900,   149900,   'INR', 18.00, 'NEW', 1, 10,0,    NULL,    3, 1, TRUE, 15, TRUE, 'ACTIVE', now()),
    -- Sony Headphones: 2 sellers
    (10, 6, 4, 'EW-SONY-XM6',   2899900,  3499900,  'INR', 18.00, 'NEW', 1, 3, 0,    NULL,    3, 1, TRUE, 7,  TRUE, 'ACTIVE', now()),
    (11, 6, 5, 'TD-WH1000XM6',  2799900,  3499900,  'INR', 18.00, 'NEW', 1, 5, 0,    NULL,    4, 1, TRUE, 10, TRUE, 'ACTIVE', now());

ALTER TABLE listings ALTER COLUMN id RESTART WITH 100;

-- ──────── INVENTORY ────────

INSERT INTO inventory (listing_id, available_quantity, reserved_quantity, sold_quantity, low_stock_threshold, last_restocked_at) VALUES
    (1,  50,  0,  120, 10, now() - interval '7 days'),
    (2,  25,  0,  80,  5,  now() - interval '3 days'),
    (3,  100, 0,  45,  15, now() - interval '14 days'),
    (4,  30,  0,  95,  5,  now() - interval '5 days'),
    (5,  15,  0,  60,  3,  now() - interval '10 days'),
    (6,  20,  0,  35,  5,  now() - interval '7 days'),
    (7,  200, 0,  500, 20, now() - interval '2 days'),
    (8,  150, 0,  350, 15, now() - interval '5 days'),
    (9,  500, 0,  800, 50, now() - interval '1 day'),
    (10, 40,  0,  75,  5,  now() - interval '7 days'),
    (11, 35,  0,  90,  5,  now() - interval '3 days');

-- ──────── ADDRESSES ────────

INSERT INTO addresses (id, customer_id, label, recipient_name, phone, street_line1, street_line2, landmark, city, state, postal_code, country, address_type, is_default) OVERRIDING SYSTEM VALUE VALUES
    (1, 1, 'Home',   'Alice Johnson',  '+91-9876543210', '42 MG Road',       'Apt 7B',    'Near Forum Mall',     'Bangalore', 'Karnataka',   '560001', 'IND', 'HOME',   TRUE),
    (2, 1, 'Office', 'Alice Johnson',  '+91-9876543210', '100 Brigade Road', 'Floor 12',  'Above Café Coffee',   'Bangalore', 'Karnataka',   '560025', 'IND', 'OFFICE', FALSE),
    (3, 2, 'Home',   'Bob Williams',   '+91-9876543211', '15 Park Street',   NULL,         'Opposite Flurys',    'Kolkata',   'West Bengal', '700016', 'IND', 'HOME',   TRUE),
    (4, 3, 'Home',   'Priya Sharma',   '+91-9876543212', '78 Connaught Place', 'Block B', 'Near Rajiv Chowk Metro','New Delhi','Delhi',      '110001', 'IND', 'HOME',   TRUE);

ALTER TABLE addresses ALTER COLUMN id RESTART WITH 100;

-- ──────── CARTS ────────

INSERT INTO carts (id, customer_id, item_count) OVERRIDING SYSTEM VALUE VALUES 
    (1, 1, 2), (2, 2, 1), (3, 3, 0);

ALTER TABLE carts ALTER COLUMN id RESTART WITH 100;

INSERT INTO cart_items (id, cart_id, listing_id, quantity, price_at_addition, currency) OVERRIDING SYSTEM VALUE VALUES
    (1, 1, 2, 1, 13199900, 'INR'),   -- Alice: TechDeals iPhone ×1
    (2, 1, 8, 2, 329900,   'INR'),   -- Alice: GadgetZone Charger ×2
    (3, 2, 6, 1, 11499900, 'INR');   -- Bob: ElectroWorld MacBook ×1

ALTER TABLE cart_items ALTER COLUMN id RESTART WITH 100;

-- ──────── COMPLETED ORDER (multi-seller) ────────

INSERT INTO orders (
    id, customer_id, order_number, idempotency_key, item_count,
    subtotal_cents, tax_cents, shipping_cents, discount_cents, total_cents, currency,
    notes, ip_address, estimated_delivery_date, delivered_at, status
) OVERRIDING SYSTEM VALUE VALUES (
    1, 1, 'ORD-20260910-000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 3,
    13959700, 2512746, 0, 0, 16472446, 'INR',
    'Please leave at reception if not home', '103.42.56.78',
    '2026-09-13', now() - interval '2 days', 'DELIVERED'
);

ALTER TABLE orders ALTER COLUMN id RESTART WITH 100;

-- Normalized order addresses (frozen snapshot)
INSERT INTO order_addresses (id, order_id, address_type, recipient_name, phone, street_line1, street_line2, landmark, city, state, postal_code, country) OVERRIDING SYSTEM VALUE VALUES
    (1, 1, 'SHIPPING', 'Alice Johnson', '+91-9876543210', '42 MG Road', 'Apt 7B', 'Near Forum Mall', 'Bangalore', 'Karnataka', '560001', 'IND');

ALTER TABLE order_addresses ALTER COLUMN id RESTART WITH 100;

-- Seller order: ElectroWorld (iPhone)
INSERT INTO seller_orders (
    id, order_id, seller_id, seller_order_number,
    subtotal_cents, tax_cents, shipping_fee_cents, total_cents,
    commission_rate, commission_cents, seller_payout_cents, currency, item_count,
    tracking_number, shipping_provider, shipped_at, delivered_at, estimated_delivery_date, status
) OVERRIDING SYSTEM VALUE VALUES (
    1, 1, 4, 'SO-20260910-EW-001',
    13499900, 2429982, 0, 15929882,
    8.50, 1147492, 14782390, 'INR', 1,
    'DELHIVERY-TRK-123456', 'Delhivery', now() - interval '4 days', now() - interval '2 days', '2026-09-13', 'DELIVERED'
);

-- Seller order: GadgetZone (Charger ×2)
INSERT INTO seller_orders (
    id, order_id, seller_id, seller_order_number,
    subtotal_cents, tax_cents, shipping_fee_cents, total_cents,
    commission_rate, commission_cents, seller_payout_cents, currency, item_count,
    tracking_number, shipping_provider, shipped_at, delivered_at, estimated_delivery_date, status
) OVERRIDING SYSTEM VALUE VALUES (
    2, 1, 6, 'SO-20260910-GZ-001',
    659800, 118764, 0, 778564,
    12.00, 79172, 699392, 'INR', 2,
    'BLUEDART-TRK-789012', 'BlueDart', now() - interval '4 days', now() - interval '2 days', '2026-09-14', 'DELIVERED'
);

ALTER TABLE seller_orders ALTER COLUMN id RESTART WITH 100;

-- Order items
INSERT INTO order_items (id, seller_order_id, listing_id, quantity, unit_price_cents, mrp_cents, tax_rate, tax_cents, line_total_cents, currency, product_id, product_title, product_image_url, seller_name, seller_sku, listing_condition, is_returnable, return_window_days) OVERRIDING SYSTEM VALUE VALUES
    (1, 1, 1, 1, 13499900, 13999900, 18.00, 2429982, 15929882, 'INR', 1, 'iPhone 17 Pro', '/images/iphone17pro-front.webp', 'ElectroWorld', 'EW-IPH17P-256', 'NEW', TRUE, 7),
    (2, 2, 8, 2, 329900,   349900,   18.00, 118764,  778564,   'INR', 4, 'USB-C Fast Charger 65W', '/images/anker-65w-charger.webp', 'GadgetZone', 'GZ-CHG-65W', 'NEW', TRUE, 15);

ALTER TABLE order_items ALTER COLUMN id RESTART WITH 100;

-- Payment
INSERT INTO payments (id, order_id, amount_cents, currency, method, status, paid_at) OVERRIDING SYSTEM VALUE VALUES
    (1, 1, 16472446, 'INR', 'UPI', 'SUCCESS', now() - interval '5 days');

ALTER TABLE payments ALTER COLUMN id RESTART WITH 100;

INSERT INTO payment_attempts (id, payment_id, idempotency_key, gateway_name, gateway_reference, gateway_order_id, gateway_status, amount_cents, currency, status, attempt_number, responded_at) OVERRIDING SYSTEM VALUE VALUES
    (1, 1, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'RAZORPAY', 'pay_Abc123XYZ789', 'order_Xyz789Abc', 'captured', 16472446, 'INR', 'SUCCESS', 1, now() - interval '5 days');

ALTER TABLE payment_attempts ALTER COLUMN id RESTART WITH 100;

-- Order status history
INSERT INTO order_status_history (id, order_id, seller_order_id, previous_status, new_status, changed_by_role, reason) OVERRIDING SYSTEM VALUE VALUES
    (1,  1, NULL, NULL,               'PENDING_PAYMENT', 'SYSTEM',   'Order created'),
    (2,  1, NULL, 'PENDING_PAYMENT',  'CONFIRMED',       'SYSTEM',   'Payment received'),
    (3,  1, 1,    'PENDING',          'CONFIRMED',       'SYSTEM',   'Payment confirmed'),
    (4,  1, 2,    'PENDING',          'CONFIRMED',       'SYSTEM',   'Payment confirmed'),
    (5,  1, 1,    'CONFIRMED',        'PROCESSING',      'SELLER',   'Seller began fulfillment'),
    (6,  1, 1,    'PROCESSING',       'SHIPPED',         'SELLER',   'Shipped via Delhivery'),
    (7,  1, 2,    'CONFIRMED',        'PROCESSING',      'SELLER',   'Seller began fulfillment'),
    (8,  1, 2,    'PROCESSING',       'SHIPPED',         'SELLER',   'Shipped via BlueDart'),
    (9,  1, NULL, 'CONFIRMED',        'SHIPPED',         'SYSTEM',   'All seller orders shipped'),
    (10, 1, 1,    'SHIPPED',          'DELIVERED',       'SYSTEM',   'Delivery confirmed'),
    (11, 1, 2,    'SHIPPED',          'DELIVERED',       'SYSTEM',   'Delivery confirmed'),
    (12, 1, NULL, 'SHIPPED',          'DELIVERED',       'SYSTEM',   'All items delivered');

ALTER TABLE order_status_history ALTER COLUMN id RESTART WITH 100;

-- Inventory ledger for this order
INSERT INTO inventory_ledger (id, listing_id, change_type, quantity_change, available_before, available_after, reserved_before, reserved_after, reference_type, reference_id, note) OVERRIDING SYSTEM VALUE VALUES
    (1, 1, 'RESERVE',      -1,  51, 50, 0, 1, 'ORDER_ITEM', 1, 'Reserved for ORD-20260910-000001'),
    (2, 1, 'CONFIRM_SALE',  0,  50, 50, 1, 0, 'ORDER_ITEM', 1, 'Payment confirmed'),
    (3, 8, 'RESERVE',      -2, 152,150, 0, 2, 'ORDER_ITEM', 2, 'Reserved for ORD-20260910-000001'),
    (4, 8, 'CONFIRM_SALE',  0, 150,150, 2, 0, 'ORDER_ITEM', 2, 'Payment confirmed');

ALTER TABLE inventory_ledger ALTER COLUMN id RESTART WITH 100;

-- ──────── REVIEW ────────

INSERT INTO reviews (id, product_id, customer_id, order_item_id, rating, title, body, pros, cons, is_verified_purchase, status) OVERRIDING SYSTEM VALUE VALUES
    (1, 1, 1, 1, 5, 'Absolutely stunning phone!', 'The A19 Pro chip is incredibly fast. Camera quality is phenomenal, especially in low light. Battery lasts all day even with heavy usage. The titanium frame feels premium.', 'Blazing fast performance. Best camera system. Premium build quality. USB-C finally.', 'Expensive. No charger in box.', TRUE, 'APPROVED');

ALTER TABLE reviews ALTER COLUMN id RESTART WITH 100;

-- ──────── WISHLIST ────────

INSERT INTO wishlists (id, customer_id, name, is_default, item_count) OVERRIDING SYSTEM VALUE VALUES
    (1, 1, 'My Wishlist', TRUE, 2),
    (2, 2, 'Tech Wants',  TRUE, 1);

ALTER TABLE wishlists ALTER COLUMN id RESTART WITH 100;

INSERT INTO wishlist_items (id, wishlist_id, product_id, note) OVERRIDING SYSTEM VALUE VALUES
    (1, 1, 2, 'Wait for Diwali sale'),
    (2, 1, 6, NULL),
    (3, 2, 3, 'Need for college');

ALTER TABLE wishlist_items ALTER COLUMN id RESTART WITH 100;

-- ──────── COUPON ────────

INSERT INTO coupons (id, code, title, description, discount_type, discount_value, min_order_cents, max_discount_cents, currency, usage_limit, per_user_limit, applicable_to, first_order_only, starts_at, expires_at, is_active, created_by) OVERRIDING SYSTEM VALUE VALUES
    (1, 'WELCOME500',  'Welcome Discount',  'Get ₹500 off on your first order',         'FIXED_AMOUNT', 50000,  100000,   NULL,     'INR', NULL, 1, 'ALL', TRUE,  now() - interval '30 days', now() + interval '365 days', TRUE, 7),
    (2, 'TECH10',      '10% Off Electronics','10% off on electronics, max ₹2000 discount','PERCENTAGE',   1000,   200000,   200000,  'INR', 5000, 2, 'SPECIFIC_CATEGORIES', FALSE, now() - interval '7 days',  now() + interval '30 days',  TRUE, 7),
    (3, 'FREESHIP',    'Free Shipping',      'Free shipping on orders above ₹999',        'FREE_SHIPPING', 1,     99900,    NULL,     'INR', NULL, 5, 'ALL', FALSE, now() - interval '14 days', now() + interval '60 days',  TRUE, 7);

ALTER TABLE coupons ALTER COLUMN id RESTART WITH 100;
