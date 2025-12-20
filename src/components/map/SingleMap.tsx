"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";

import { ListingSingle } from "@/actions/listing-actions";

const MiniMap = dynamic(() => import("./Minimap"), { ssr: false });
const MapModal = dynamic(() => import("./MapModal"), { ssr: false });

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
