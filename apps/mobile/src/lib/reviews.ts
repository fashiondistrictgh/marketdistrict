// Placeholder reviews + ratings derived deterministically from a product id,
// so the product page looks complete before a real `reviews` table exists.
// Swap for a Supabase query when reviews are added to the backend.

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const NAMES = ["Ama M.", "Kofi B.", "Akosua O.", "Yaw D.", "Esi A.", "Kwesi N."];
const COMMENTS = [
  "Fresh and exactly as described. Will order again!",
  "Great quality and fast delivery.",
  "Good value for the price.",
  "Packaging was neat and everything arrived in good condition.",
  "Tasty and fresh — my family loved it.",
  "Solid product, no complaints.",
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Average rating between 4.0 and 5.0, stable per product. */
export function productRating(productId: string): number {
  const r = 4 + (hash(productId) % 11) / 10; // 4.0 – 5.0
  return Math.round(r * 10) / 10;
}

export function productReviewCount(productId: string): number {
  return 8 + (hash(productId) % 180);
}

export function productReviews(productId: string, count = 3): Review[] {
  const base = hash(productId);
  return Array.from({ length: count }, (_, i) => {
    const n = base + i * 7;
    return {
      id: `${productId}-r${i}`,
      name: NAMES[n % NAMES.length],
      rating: 4 + ((n >> 2) % 2), // 4 or 5
      comment: COMMENTS[n % COMMENTS.length],
      date: ["2 days ago", "1 week ago", "3 weeks ago", "Last month"][n % 4],
    };
  });
}
