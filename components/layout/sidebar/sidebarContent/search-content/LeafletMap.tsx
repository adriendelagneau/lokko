"use client";

import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  center: { lat: number; lng: number };
  radius: number; // km
}

// Fix des icônes par défaut Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Hook pour recentrer et zoomer automatiquement selon le rayon
const FitBoundsCircle = ({
  center,
  radius,
}: {
  center: { lat: number; lng: number };
  radius: number;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const point = L.latLng(center.lat, center.lng);

    // Crée un rectangle correspondant au rayon
    const bounds = point.toBounds(radius * 1000); // rayon en mètres

    // Zoom maximal pour que le rectangle tienne dans 80% de la map
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mapSize = map.getSize();
    const zoom = map.getBoundsZoom(bounds, false); // false = pas de padding
    const adjustedZoom = zoom - 0.8; // ajustement pour ~80% de la map

    map.setView([center.lat, center.lng], adjustedZoom);
  }, [center, radius, map]);

  return null;
};

const LeafletMap = ({ center, radius }: LeafletMapProps) => {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[center.lat, center.lng]} />
      <Circle
        center={[center.lat, center.lng]}
        radius={radius * 1000}
        pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.2 }}
      />
      <FitBoundsCircle center={center} radius={radius} />
    </MapContainer>
  );
};

export default LeafletMap;
