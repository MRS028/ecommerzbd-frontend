/**
 * Dummy image uploader — returns a placeholder URL.
 * Used as a temporary substitute for Cloudinary while backend is being set up.
 *
 * 🔁 To switch to real Cloudinary later:
 *   Replace `dummyUploadImage` calls in product.admin.service.ts
 *   with the real `uploadToCloudinary`.
 */

// Curated Unsplash images so the UI looks realistic
const DUMMY_IMAGES = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
];

/**
 * Simulates an upload by waiting a bit and returning a random placeholder URL.
 * Signature matches Cloudinary upload so it can be swapped without other changes.
 */
export async function dummyUploadImage(
  file?: File,
  options?: {
    folder?: string;
    onProgress?: (pct: number) => void;
    signal?: AbortSignal;
  }
): Promise<string> {
  // Simulate realistic progress
  for (let pct = 0; pct <= 100; pct += 20) {
    if (options?.signal?.aborted) {
      throw new Error('Upload cancelled');
    }
    options?.onProgress?.(pct);
    await new Promise((r) => setTimeout(r, 80));
  }

  // Pick a random Unsplash image
  const url = DUMMY_IMAGES[Math.floor(Math.random() * DUMMY_IMAGES.length)];

  // Add cache-buster so duplicate URLs still render in lists
  const uniqueUrl = `${url}&dummy=${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  return uniqueUrl;
}