// Returns a product's image, or an AI-generated fallback from its name
// (Pollinations — free, no API key). Mirrors the admin app's helper.

export function aiProductImage(name: string, size = 400): string {
  const prompt = encodeURIComponent(
    `professional product photo of ${name}, grocery item, clean white background, studio lighting`,
  );
  const seed = Math.abs(hashCode(name)) % 100000;
  return `https://image.pollinations.ai/prompt/${prompt}?width=${size}&height=${size}&nologo=true&seed=${seed}`;
}

export function productImageUrl(imageUrls: string[], name: string, size = 400): string {
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
