"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

import { ListingSingle } from "@/actions/listing-actions";
import { initLeafletIcons } from "@/lib/leaflet";

const MiniMap = dynamic(() => import("./Minimap"), { ssr: false });
const MapModal = dynamic(() => import("./MapModal"), { ssr: false });

type SingleMapProps = {
  listing: Pick<ListingSingle, "location">;
};

const SingleMap = ({ listing }: SingleMapProps) => {
  const [open, setOpen] = useState(false);
   useEffect(() => {
    initLeafletIcons();
   }, []);
  
  return (
    <div className="relative z-10 my-12">
      <h2 className="mb-3 text-xl font-semibold">
        Localisation : {listing.location.city}
      </h2>
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
