// Generates an AI product image URL from the product name using Pollinations
// (free, no API key — image is generated from the text prompt in the URL).
// Used as a fallback when a product has no uploaded image yet.

export function aiProductImage(name: string, size = 400): string {
  const prompt = encodeURIComponent(
    `professional product photo of ${name}, grocery item, clean white background, studio lighting`,
  );
  // `nologo=true` removes the watermark; seed keeps the image stable per name.
  const seed = Math.abs(hashCode(name)) % 100000;
  return `https://image.pollinations.ai/prompt/${prompt}?width=${size}&height=${size}&nologo=true&seed=${seed}`;
}

/** Returns the product's own image if it has one, else an AI-generated fallback. */
export function productImageUrl(
  imageUrls: string[],
  name: string,
  size = 400,
): string {
  return imageUrls[0] || aiProductImage(name, size);
}

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}
