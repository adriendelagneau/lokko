"use client";

import { Heart } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  price: number;
  unit?: string;
  date: string;
  city: string;
  likes?: number;
};

export const ListingInfos = ({
  title,
  price,
  unit,
  date,
  city,
  likes = 0,
}: Props) => {
  return (
    <div className="relative -top-12 mx-auto flex w-full max-w-[95%] flex-col gap-4 rounded-xl bg-white p-4 shadow-md">
      {/* Left: Title + Price */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between ">
          <div className="text-2xl font-semibold capitalize">{title}</div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-red-500" />
            <span>{likes}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xl font-medium">
          <span>{price}</span>
          {unit && <span className="">/ {unit}</span>}
        </div>
      </div>

      {/* Middle: Date + Likes */}
      <div className="text-muted-foreground flex items-center gap-4 ">
        <span>{date}</span>
      </div>

      {/* Right: City / Contact */}
      <div className="">
        <Button variant="secondary" className="text-base">
          {city}
        </Button>
      </div>
    </div>
  );
};
