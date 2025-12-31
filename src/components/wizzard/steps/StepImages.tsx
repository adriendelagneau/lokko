"use client";

import { Upload, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ListingDraft } from "@/lib/schemas/listing.schema";

type StepImagesProps = {
  onNext: () => void;
  onPrev: () => void;
};

type ImageState = {
  url?: string;
  file?: File;
  uploading: boolean;
  error?: string;
};

export default function StepImages({ onNext, onPrev }: StepImagesProps) {
  const { watch, setValue, trigger, formState, clearErrors } =
    useFormContext<ListingDraft>();
  const images = watch("images") ?? [];

  const [imagesState, setImagesState] = useState<ImageState[]>(
    images.map((url) => ({ url, uploading: false }))
  );

  // Auto-clear errors when valid
  useEffect(() => {
    if (formState.errors.images && imagesState.every((i) => i.url)) {
      clearErrors("images");
    }
  }, [imagesState, formState.errors.images, clearErrors]);

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
      prev.filter((i) => i.url !== url && i.file !== file)
    );
  };

  // Sync with RHF
  useEffect(() => {
    setValue(
      "images",
      imagesState.filter((i) => i.url).map((i) => i.url!)
    );
  }, [imagesState, setValue]);

  const handleNext = async () => {
    const valid = await trigger("images");
    if (valid) onNext();
  };

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

      {formState.errors.images && (
        <p className="text-destructive text-sm">
          {formState.errors.images.message}
        </p>
      )}

      {/* Preview */}
      {imagesState.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {imagesState.map((img) => {
            const key = img.url || img.file?.name;

            return (
              <div key={key} className="relative aspect-square">
                {img.url ? (
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="rounded-md object-cover"
                  />
                ) : img.file ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={URL.createObjectURL(img.file)}
                    alt=""
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : null}

                {img.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-sm text-white">
                    Upload...
                  </div>
                )}

                {img.error && (
                  <p className="text-destructive absolute bottom-1 left-1 text-xs">
                    {img.error}
                  </p>
                )}

                <button
                  type="button"
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

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onPrev}>
          Retour
        </Button>
        <Button
          onClick={handleNext}
          disabled={
            isUploading || imagesState.filter((i) => i.url).length === 0
          }
        >
          {isUploading ? "Upload en cours..." : "Continuer"}
        </Button>
      </div>
    </div>
  );
}
