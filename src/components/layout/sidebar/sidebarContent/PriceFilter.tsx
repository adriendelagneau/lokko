/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import * as Slider from "@radix-ui/react-slider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MIN = 0;
const MAX = 150;

export const PriceRangeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMin = Number(searchParams.get("priceMin")) || MIN;
  const initialMax = Number(searchParams.get("priceMax")) || MAX;

  const [value, setValue] = useState<[number, number]>([
    initialMin,
    initialMax,
  ]);

  // Sync URL → state (back / forward)
  useEffect(() => {
    setValue([initialMin, initialMax]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const commitToUrl = ([min, max]: [number, number]) => {
    const params = new URLSearchParams(searchParams.toString());

    min > MIN ? params.set("priceMin", String(min)) : params.delete("priceMin");
    max < MAX ? params.set("priceMax", String(max)) : params.delete("priceMax");

    params.delete("page");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="my-6 space-y-4 border shadow-xl p-4 rounded-lg">
      <div className="medium">
        Prix : {value[0]} € – {value[1]} €
      </div>

      <Slider.Root
        min={MIN}
        max={MAX}
        step={5}
        value={value}
        onValueChange={(v) => setValue(v as [number, number])}
        onValueCommit={(v) => commitToUrl(v as [number, number])}
        className="relative flex w-full touch-none items-center select-none"
      >
        <Slider.Track className="bg-muted relative h-2 w-full grow rounded-full">
          <Slider.Range className="bg-primary absolute h-full rounded-full" />
        </Slider.Track>

        <Slider.Thumb className="bg-background block h-4 w-4 rounded-full border shadow" />
        <Slider.Thumb className="bg-background block h-4 w-4 rounded-full border shadow" />
      </Slider.Root>
    </div>
  );
};
