import { useRef, useState } from 'react';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';
import { validateImageFile } from '@/shared/lib/cloudinary';
import { productAdminService } from '../product/services/product.admin.service';

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  folder?: string;
}

interface UploadingItem {
  id: string;
  fileName: string;
  progress: number;
}

export function ImageUploader({
  value,
  onChange,
  max = 5,
  folder = 'spark-collection/products',
}: Props) {
  const [uploading, setUploading] = useState<UploadingItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remaining = max - value.length - uploading.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${max} images allowed`);
      return;
    }

    const list = Array.from(files).slice(0, remaining);

    // Validate all files up front
    const valid: File[] = [];
    for (const f of list) {
      const check = validateImageFile(f);
      if (check.ok) {
        valid.push(f);
      } else {
        toast.error(`${f.name}: ${check.reason}`);
      }
    }

    if (valid.length === 0) {
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    // Add placeholders with progress tracking
    const placeholders: UploadingItem[] = valid.map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      fileName: f.name,
      progress: 0,
    }));
    setUploading((prev) => [...prev, ...placeholders]);

    const uploadedUrls: string[] = [];

    // Upload one by one with progress updates
    for (let i = 0; i < valid.length; i++) {
      const file = valid[i];
      const placeholderId = placeholders[i].id;

      try {
        // ✅ FIX: pass options object with onProgress callback
        const url = await productAdminService.uploadImage(file, {
          folder,
          onProgress: (pct) => {
            setUploading((prev) =>
              prev.map((u) =>
                u.id === placeholderId ? { ...u, progress: pct } : u
              )
            );
          },
        });
        uploadedUrls.push(url);
      } catch (err: any) {
        toast.error(`${file.name}: ${err?.message || 'Upload failed'}`);
      } finally {
        setUploading((prev) => prev.filter((u) => u.id !== placeholderId));
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...value, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    }

    if (inputRef.current) inputRef.current.value = '';
  };

  const removeImage = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {/* Existing images */}
        {value.map((url) => (
          <div
            key={url}
            className="relative w-24 h-24 rounded-lg overflow-hidden border bg-muted group"
          >
            <img src={url} alt="upload" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Uploading placeholders with progress */}
        {uploading.map((item) => (
          <div
            key={item.id}
            className="relative w-24 h-24 rounded-lg border bg-muted overflow-hidden flex flex-col items-center justify-center p-1"
          >
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-[10px] text-muted-foreground mt-1 truncate w-full text-center">
              {item.progress}%
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-border">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}

        {/* Add button */}
        {value.length + uploading.length < max && (
          <button
            type="button"
            disabled={uploading.length > 0}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center',
              'text-muted-foreground hover:border-primary hover:text-primary transition',
              uploading.length > 0 && 'opacity-50 cursor-wait'
            )}
          >
            {uploading.length > 0 ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span className="text-xs mt-1">Upload</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {value.length}/{max} images — JPG, PNG, WebP, max 5MB each
      </p>
    </div>
  );
}