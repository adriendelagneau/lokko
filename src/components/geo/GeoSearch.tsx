"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { getListings, GetListingsParams } from "@/actions/listing-actions";


interface UserCoords {
  lat: number;
  lng: number;
}

// Import Leaflet Map uniquement côté client
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

const GeoSearch = () => {
  const [isGeoLocated, setIsGeoLocated] = useState(false);
  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [city, setCity] = useState("");
  const [radius, setRadius] = useState(10); // km
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGeoLocate = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setIsGeoLocated(true);

        // ✅ Appel server action pour tester le filtrage par geo/rayon
        setLoading(true);
        try {
          const params: GetListingsParams = {
            page: 1,
            pageSize: 10,
            geoLat: latitude,
            geoLng: longitude,
            geoRadiusKm: radius,
          } as any; // si tu n’as pas encore ajouté geoLat/geoLng/geoRadiusKm dans le type
          
          const result = await getListings(params);
          setListings(result.listings);
          console.log("Listings trouvés:", result.listings);
        } catch (err) {
          console.error("Erreur fetch listings:", err);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Erreur géolocalisation:", error);
        alert("Impossible de récupérer votre position.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
      {/* Ville input */}
      <div>
        <Label htmlFor="city">Votre ville</Label>
        <Input
          id="city"
          placeholder="Ex: Paris"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      {/* Géolocalisation */}
      <div>
        <Button onClick={handleGeoLocate} disabled={loading}>
          {loading ? "Chargement..." : "Me géolocaliser"}
        </Button>
        {isGeoLocated && userCoords && (
          <div className="mt-2 text-sm text-gray-700">
            Position détectée : {userCoords.lat.toFixed(5)},{" "}
            {userCoords.lng.toFixed(5)}
          </div>
        )}
      </div>

      {/* Rayon */}
      {isGeoLocated && (
        <div>
          <Label htmlFor="radius">
            Rayon autour de votre position (km): {radius}
          </Label>
          <Slider
            id="radius"
            value={[radius]}
            onValueChange={(val) => setRadius(val[0])}
            max={100}
            step={1}
          />
        </div>
      )}

      {/* Mini map */}
      {isGeoLocated && userCoords && (
        <div className="mt-4 h-64 w-full overflow-hidden rounded-lg">
          <LeafletMap center={userCoords} radius={radius} />
        </div>
      )}

      {/* Listings test */}
      <div className="mt-4">
        <h3 className="font-semibold">Listings trouvés :</h3>
        {listings.length === 0 ? (
          <p>Aucun listing trouvé</p>
        ) : (
          <ul className="space-y-1">
            {listings.map((l) => (
              <li key={l.id}>
                {l.title} — {l.location.city}, {l.location.department}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GeoSearch;
