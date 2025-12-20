"use client";

import React, { useState } from "react";

import { ListingSingle } from "@/actions/listing-actions";

import { MapModal } from "./MapModal";
import { MiniMap } from "./Minimap";

type SingleMapProps = {
  listing: Pick<ListingSingle, "location">;
};


const SingleMap = ({ listing }: SingleMapProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <MiniMap
        lat={listing.location.lat}
        lng={listing.location.lng}
        onClick={() => setOpen(true)}
      />

      <MapModal
        open={open}
        onOpenChange={setOpen}
        lat={listing.location.lat}
        lng={listing.location.lng}
      />
    </div>
  );
};

export default SingleMap;
