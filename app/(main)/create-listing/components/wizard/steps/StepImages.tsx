"use client";

import { Upload, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDropzone } from "react-dropzone";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DraggableSyntheticListeners,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";

import { ListingDraft } from "@/validations/listing-schemas";
import { toast } from "sonner";
import cloudinaryUrl from "@/utils/images/updateCloudinaryUrl";

type StepImagesProps = {
  onNext: () => void;
  onPrev: () => void;
};

type ImageState = {
  id: string;
  url?: string;
  file?: File;
  uploading: boolean;
  error?: string;
  index: number;
};

const MAX_IMAGES = 3;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

// ✅ Sortable Item
function SortableImage({
  img,
  children,
}: {
  img: ImageState;
  children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: img.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: transform ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children(listeners)}
    </div>
  );
}

export default function StepImages({ onNext, onPrev }: StepImagesProps) {
  const { watch, setValue, trigger, formState, clearErrors } =
    useFormContext<ListingDraft>();

  const images = watch("images") ?? [];

  const [imagesState, setImagesState] = useState<ImageState[]>(
    images.map((img, i) => ({
      id: crypto.randomUUID(),
      url: typeof img === "string" ? img : img.url,
      uploading: false,
      index: i,
    })),
  );

  const uploadedCount = imagesState.filter((i) => i.url).length;
  const isUploading = imagesState.some((i) => i.uploading);

  const sensors = useSensors(useSensor(PointerSensor));

  // Clear errors when valid
  useEffect(() => {
    if (
      formState.errors.images &&
      uploadedCount === MAX_IMAGES &&
      !isUploading
    ) {
      clearErrors("images");
    }
  }, [uploadedCount, isUploading, formState.errors.images, clearErrors]);

  // Upload handler
  const handleFiles = async (files: File[]) => {
    const remainingSlots = MAX_IMAGES - imagesState.length;
    if (remainingSlots <= 0) return;

    const selectedFiles = files.slice(0, remainingSlots);

    const validFiles: File[] = [];

    selectedFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast(`Chaque image doit faire moins de ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    const newImages: ImageState[] = validFiles.map((file, i) => ({
      id: crypto.randomUUID(),
      file,
      uploading: true,
      index: imagesState.length + i,
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
            i.id === img.id ? { ...i, url: data.url, uploading: false } : i,
          ),
        );
      } catch {
        setImagesState((prev) =>
          prev.map((i) =>
            i.id === img.id
              ? { ...i, uploading: false, error: "Upload échoué" }
              : i,
          ),
        );
      }
    });
  };

  // Dropzone
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop: handleFiles,
      accept: {
        "image/jpeg": [],
        "image/png": [],
        "image/webp": [],
        "image/gif": [],
      },
      maxSize: MAX_FILE_SIZE,
      disabled: imagesState.length >= MAX_IMAGES,
    });

  useEffect(() => {
    fileRejections.forEach(({ file, errors }) => {
      errors.forEach((e) => {
        if (e.code === "file-too-large") {
          toast(`${file.name} est trop volumineux`);
        }
        if (e.code === "file-invalid-type") {
          toast(`${file.name} format invalide`);
        }
      });
    });
  }, [fileRejections]);

  // Drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setImagesState((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);

      const reordered = arrayMove(prev, oldIndex, newIndex);

      return reordered.map((item, idx) => ({
        ...item,
        index: idx,
      }));
    });
  };

  // Remove
  const removeImage = (id: string) => {
    setImagesState((prev) =>
      prev.filter((i) => i.id !== id).map((i, idx) => ({ ...i, index: idx })),
    );
  };

  // Sync with RHF
  useEffect(() => {
    setValue(
      "images",
      imagesState
        .filter((i) => i.url)
        .sort((a, b) => a.index - b.index)
        .map((i, idx) => ({
          url: i.url!,
          index: idx,
        })),
      { shouldDirty: true },
    );
  }, [imagesState, setValue]);

  const handleNext = async () => {
    const valid = await trigger("images", { shouldFocus: true });
    if (valid) onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Ajoutez {MAX_IMAGES} photos (max {MAX_FILE_SIZE_MB}MB chacune)
      </h2>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        aria-label="Upload images"
        className={`relative flex h-42 cursor-pointer items-center justify-center rounded-lg border border-dashed p-6 text-sm transition ${imagesState.length >= MAX_IMAGES ? "cursor-not-allowed opacity-50" : ""} ${isDragActive ? "bg-muted scale-[1.02]" : "hover:bg-muted"} `}
      >
        <input {...getInputProps()} />

        <Upload className="mr-2 h-4 w-4" />

        {isDragActive
          ? "Déposez les images ici..."
          : `Glissez-déposez ou cliquez (${uploadedCount}/${MAX_IMAGES})`}

        {isDragActive && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 text-white">
            Drop here
          </div>
        )}
      </div>

      {formState.errors.images && (
        <p className="text-destructive text-sm">
          {formState.errors.images.message}
        </p>
      )}

      {/* Grid + Drag */}
      {imagesState.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={imagesState.map((i) => i.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 gap-3">
              {imagesState
                .sort((a, b) => a.index - b.index)
                .map((img) => (
                  <SortableImage key={img.id} img={img}>
                    {(listeners) => (
                      <div className="group relative aspect-3/4">
                        {/* Drag handle */}
                        <div
                          {...listeners}
                          className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
                        />

                        {img.url ? (
                          <Image
                            src={cloudinaryUrl(img.url, {
                              width: 170,
                              height: 227,
                              quality: 80,
                            })}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="rounded-md object-cover"
                          />
                        ) : (
                          <div className="bg-muted absolute inset-0 flex items-center justify-center rounded-md">
                            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                          </div>
                        )}

                        {img.error && (
                          <p className="text-destructive absolute bottom-1 left-1 text-xs">
                            {img.error}
                          </p>
                        )}

                        {/* Remove */}
                        <button
                          type="button"
                          aria-label="Remove image"
                          onClick={() => removeImage(img.id)}
                          className="absolute top-1 right-1 z-20 rounded-full bg-black/60 p-1 text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </SortableImage>
                ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onPrev}>
          Retour
        </Button>
        <Button
          onClick={handleNext}
          disabled={isUploading || uploadedCount !== MAX_IMAGES}
        >
          {isUploading ? "Upload en cours..." : "Continuer"}
        </Button>
      </div>
    </div>
  );
}
