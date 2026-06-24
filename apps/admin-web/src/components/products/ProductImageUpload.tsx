"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { productImageUrl } from "@/lib/product-image";
import { Button } from "@/components/ui/button";

const BUCKET = "product-images";

/** Unique id with a fallback for environments where crypto.randomUUID is missing. */
function randomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

interface ProductImageUploadProps {
  /** Current image URL ("" if none). */
  value: string;
  onChange: (url: string) => void;
  /** Used for the AI-generated preview when no image is set. */
  productName: string;
}

export function ProductImageUpload({ value, onChange, productName }: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${randomId()}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Image uploaded");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(
        msg.toLowerCase().includes("bucket")
          ? "Storage bucket 'product-images' not found — create it in Supabase first."
          : msg,
      );
    } finally {
      setUploading(false);
    }
  }

  const previewSrc = productImageUrl(value ? [value] : [], productName || "product", 240);

  return (
    <div className="flex items-start gap-4">
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewSrc} alt="preview" className="h-full w-full object-cover" />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      <div className="flex-1 space-y-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="mr-2 h-4 w-4" />
          )}
          {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </Button>
        <p className="text-xs text-muted-foreground">
          PNG or JPG, up to 5 MB. If left empty, an AI image is generated from the product name.
        </p>
      </div>
    </div>
  );
}
