"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lat: number;
  lng: number;
};

export default function MapModal({ open, onOpenChange, lat, lng }: Props) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[80vh] max-w-4xl p-0">
        <DialogTitle className="hidden"></DialogTitle>
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          className="h-full w-full rounded-lg"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]} />
        </MapContainer>
      </DialogContent>
    </Dialog>
  );
}
