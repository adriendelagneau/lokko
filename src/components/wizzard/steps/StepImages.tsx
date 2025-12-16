"use client";

import { Upload, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useListingWizard } from "@/lib/store/listingWizard.store";

type ImageState = {
  url?: string; // uploaded URL
  file?: File; // local file
  uploading: boolean;
  error?: string;
};

export default function StepImages() {
  const { data, update, next, prev, errors } = useListingWizard();

  const [imagesState, setImagesState] = useState<ImageState[]>(
    (data.images ?? []).map((url) => ({ url, uploading: false }))
  );

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const newImages: ImageState[] = Array.from(files).map((file) => ({
      file,
      uploading: true,
    }));

    setImagesState((prev) => [...prev, ...newImages]);

    newImages.forEach(async (img) => {
      try {
        const formData = new FormData();
        formData.append("file", img.file!);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        setImagesState((prev) =>
          prev.map((i) =>
            i.file === img.file ? { url: data.url, uploading: false } : i
          )
        );
      } catch (err) {
        console.error(err);
        setImagesState((prev) =>
          prev.map((i) =>
            i.file === img.file
              ? { ...i, uploading: false, error: "Upload failed" }
              : i
          )
        );
      }
    });
  };

  const removeImage = (url?: string, file?: File) => {
    setImagesState((prev) =>
      prev.filter((img) => img.url !== url && img.file !== file)
    );
  };

  // Update the store whenever imagesState changes
  useEffect(() => {
    update({
      images: imagesState.filter((i) => i.url).map((i) => i.url!),
    });
  }, [imagesState, update]);

  const isUploading = imagesState.some((i) => i.uploading);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Ajoutez des photos</h2>

      {/* Upload */}
      <label className="hover:bg-muted flex cursor-pointer items-center justify-center rounded-lg border border-dashed p-6 text-sm">
        <Upload className="mr-2 h-4 w-4" />
        Ajouter des images
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {errors.images && (
        <p className="text-destructive text-sm">{errors.images[0]}</p>
      )}

      {/* Preview */}
      {imagesState.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {imagesState.map((img) => {
            const key = img.url || img.file?.name;

            return (
              <div key={key} className="relative aspect-square">
                {/* Uploaded image */}
                {img.url && (
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="rounded-md object-cover"
                  />
                )}

                {/* Local file preview */}
                {!img.url && img.file && (
                  <img
                    src={URL.createObjectURL(img.file)}
                    alt=""
                    className="h-full w-full rounded-md object-cover"
                  />
                )}

                {/* Upload overlay */}
                {img.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-sm text-white">
                    Upload...
                  </div>
                )}

                {/* Error message */}
                {img.error && (
                  <p className="text-destructive absolute bottom-1 left-1 text-xs">
                    {img.error}
                  </p>
                )}

                {/* Remove button */}
                <button
                  onClick={() => removeImage(img.url, img.file)}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={prev}>
          Retour
        </Button>
        <Button
          onClick={next}
          disabled={isUploading || imagesState.length === 0}
        >
          {isUploading ? "Upload en cours..." : "Continuer"}
        </Button>
      </div>
    </div>
  );
}
