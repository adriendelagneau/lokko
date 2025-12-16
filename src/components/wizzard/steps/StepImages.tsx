"use client";

import { Upload, Trash2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useListingWizard } from "@/lib/store/listingWizard.store";

export default function StepImages() {
  const { data, update, next, prev, errors } = useListingWizard();

  const images = data.images ?? [];

  // 🔧 Simule un upload → remplace par ton API
  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const uploadedUrls = Array.from(files).map(
      (file) => URL.createObjectURL(file) // ⚠️ mock
    );

    update({
      images: [...images, ...uploadedUrls],
    });
  };

  const removeImage = (url: string) => {
    update({
      images: images.filter((img) => img !== url),
    });
  };

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
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((url) => (
            <div key={url} className="relative aspect-square">
              <Image
                src={url}
                alt=""
                fill
                className="rounded-md object-cover"
              />
              <button
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={prev}>
          Retour
        </Button>
        <Button onClick={next}>Continuer</Button>
      </div>
    </div>
  );
}
