-- sample-products.sql
-- A handful of active products mapped to seeded categories.

insert into public.products (name, slug, description, category_id, price, compare_at_price, unit, stock_quantity, status, is_featured)
select v.name, v.slug, v.description, c.id, v.price, v.compare_at_price, v.unit, v.stock, 'active'::product_status, v.featured
from (values
  ('Fresh Bananas',     'fresh-bananas',     'Sweet, ripe bananas sold per bunch.', 'fruits-vegetables', 1200, 1500, 'bundle', 80,  true),
  ('Red Apples 1kg',    'red-apples-1kg',    'Crisp red apples.',                   'fruits-vegetables', 2500, null, 'kg',     60,  false),
  ('Whole Milk 1L',     'whole-milk-1l',     'Full-cream pasteurized milk.',        'dairy-eggs',        1800, null, 'l',      40,  false),
  ('Crate of Eggs',     'crate-of-eggs',     'Fresh eggs, crate of 30.',            'dairy-eggs',        3200, 3600, 'pack',   25,  true),
  ('Brown Bread Loaf',  'brown-bread-loaf',  'Freshly baked whole-wheat loaf.',     'bakery',            1500, null, 'piece',  30,  true),
  ('Orange Juice 1L',   'orange-juice-1l',   '100% pure orange juice.',             'beverages',         2200, null, 'l',      50,  false)
) as v(name, slug, description, cat_slug, price, compare_at_price, unit, stock, featured)
join public.categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;
