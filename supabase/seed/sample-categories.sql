-- sample-categories.sql
-- Default grocery categories (mirrors packages/shared DEFAULT_CATEGORIES).

insert into public.categories (name, slug, icon, sort_order) values
  ('Fruits & Vegetables', 'fruits-vegetables', 'Apple', 1),
  ('Meat & Seafood',      'meat-seafood',      'Fish', 2),
  ('Dairy & Eggs',        'dairy-eggs',        'Egg', 3),
  ('Bakery',              'bakery',            'Croissant', 4),
  ('Beverages',           'beverages',         'CupSoda', 5),
  ('Snacks',              'snacks',            'Cookie', 6),
  ('Pantry & Staples',    'pantry',            'Wheat', 7),
  ('Frozen Foods',        'frozen',            'Snowflake', 8),
  ('Household',           'household',         'SprayCan', 9),
  ('Personal Care',       'personal-care',     'Sparkles', 10),
  ('Baby Care',           'baby',              'Baby', 11),
  ('Pet Supplies',        'pets',              'PawPrint', 12)
on conflict (slug) do nothing;
