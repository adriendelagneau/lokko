"use client";

import * as Slider from "@radix-ui/react-slider";
import { useEffect, useState } from "react";
import { useSearchState } from "@/hooks/use-search-state";

const MIN = 0;
const MAX = 150;

export const PriceRangeFilter = () => {
  const { queryObj, updateSearch } = useSearchState();

  const initialMin = Number(queryObj.priceMin) || MIN;
  const initialMax = Number(queryObj.priceMax) || MAX;

  const [value, setValue] = useState<[number, number]>([
    initialMin,
    initialMax,
  ]);

  // Sync state with URL changes (back/forward navigation)
  useEffect(() => {
    setValue([initialMin, initialMax]);
  }, [initialMin, initialMax]);

  const handleCommit = ([min, max]: [number, number]) => {
    updateSearch({
      priceMin: min > MIN ? min : null,
      priceMax: max < MAX ? max : null,
    });
  };

  return (
    <div className="my-6 space-y-4 rounded-lg border p-4 shadow-xl">
      <div className="font-medium">
        Prix : {value[0]} € – {value[1]} €
      </div>

      <Slider.Root
        min={MIN}
        max={MAX}
        step={5}
        value={value}
        onValueChange={(v) => setValue(v as [number, number])}
        onValueCommit={(v) => handleCommit(v as [number, number])}
        className="relative flex w-full select-none items-center touch-none"
      >
        <Slider.Track className="bg-muted relative h-2 w-full grow rounded-full">
          <Slider.Range className="bg-primary absolute h-full rounded-full" />
        </Slider.Track>

        <Slider.Thumb 
          className="bg-background block h-4 w-4 rounded-full border shadow focus:outline-none focus:ring-2 focus:ring-primary" 
          aria-label="Prix minimum"
        />
        <Slider.Thumb 
          className="bg-background block h-4 w-4 rounded-full border shadow focus:outline-none focus:ring-2 focus:ring-primary" 
          aria-label="Prix maximum"
        />
      </Slider.Root>
    </div>
  );
};
