/**
 * Direct Cloudinary unsigned upload.
 * No backend endpoint required.
 */

const cloudinaryEnv = import.meta.env as {
  VITE_CLOUDINARY_CLOUD_NAME?: string;
  VITE_CLOUDINARY_UPLOAD_PRESET?: string;
};
const CLOUD_NAME = cloudinaryEnv.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = cloudinaryEnv.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

export interface UploadOptions {
  folder?: string;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

export function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    return Promise.reject(
      new Error(
        'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env'
      )
    );
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', UPLOAD_PRESET);
  if (options.folder) form.append('folder', options.folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    if (options.onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          options.onProgress!(pct);
        }
      };
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
          resolve({
            url: data.secure_url,
            publicId: data.public_id,
            width: data.width,
            height: data.height,
            format: data.format,
            bytes: data.bytes,
          });
        } else {
          reject(
            new Error(
              data?.error?.message || `Upload failed (HTTP ${xhr.status})`
            )
          );
        }
      } catch {
        reject(new Error('Invalid response from Cloudinary'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.ontimeout = () => reject(new Error('Upload timed out'));

    if (options.signal) {
      options.signal.addEventListener('abort', () => {
        xhr.abort();
        reject(new Error('Upload cancelled'));
      });
    }

    xhr.send(form);
  });
}

export function validateImageFile(
  file: File,
  maxSizeMB = 5
): { ok: true } | { ok: false; reason: string } {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowed.includes(file.type)) {
    return { ok: false, reason: `Unsupported type: ${file.type}` };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { ok: false, reason: `File too large (max ${maxSizeMB}MB)` };
  }
  return { ok: true };
}