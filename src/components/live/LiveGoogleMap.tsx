import { useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Property } from "@/types/property";
import { Badge } from "../ui/badge";
import { Clock } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { PropertyCard } from "../PropertyCard";

interface LiveGoogleMapProps {
  properties: Property[];
}

const mapStyles = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 31.7917,
  lng: -7.0926,
};

export const LiveGoogleMap = ({ properties }: LiveGoogleMapProps) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const center = properties.length > 0
    ? {
        lat: properties.reduce((sum, p) => sum + p.coordinates.lat, 0) / properties.length,
        lng: properties.reduce((sum, p) => sum + p.coordinates.lng, 0) / properties.length,
      }
    : defaultCenter;

  // Create a custom marker icon using SVG
  const createMarkerIcon = (isLive: boolean) => {
    const color = isLive ? "#ef4444" : "#6b7280"; // Red for live, gray for non-live
    return {
      url: `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
          <circle cx="12" cy="13" r="3"/>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(32, 32),
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[700px]">
      <div className="relative h-full">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={6}
            center={center}
            mapTypeId="hybrid"
          >
            {properties.map((property) => (
              <Marker
                key={property.id}
                position={{
                  lat: property.coordinates.lat,
                  lng: property.coordinates.lng,
                }}
                onClick={() => setSelectedProperty(property)}
                icon={createMarkerIcon(property.isLiveNow || false)}
              />
            ))}

            {selectedProperty && (
              <InfoWindow
                position={{
                  lat: selectedProperty.coordinates.lat,
                  lng: selectedProperty.coordinates.lng,
                }}
                onCloseClick={() => setSelectedProperty(null)}
              >
                <div className="p-2 max-w-[300px]">
                  <div className="relative mb-2">
                    <img
                      src={selectedProperty.images[0]}
                      alt={selectedProperty.title}
                      className="w-full h-[150px] object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 left-2">
                      {!selectedProperty.hasLive ? (
                        <Badge variant="destructive">Vendu</Badge>
                      ) : selectedProperty.isLiveNow ? (
                        <Badge variant="destructive" className="bg-red-500">
                          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-white animate-pulse" />
                          Live en cours
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                          <Clock className="mr-1 h-4 w-4" />
                          {new Date(selectedProperty.liveDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-base mb-1">{selectedProperty.title}</h3>
                  <p className="text-primary font-bold">
                    {selectedProperty.price.toLocaleString()} DH
                  </p>
                  <p className="text-sm text-gray-500">{selectedProperty.location}</p>
                  <div className="flex gap-2 text-sm text-gray-500 mt-1">
                    <span>{selectedProperty.surface} m²</span>
                    <span>•</span>
                    <span>{selectedProperty.type}</span>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      <ScrollArea className="h-full bg-white rounded-lg shadow-lg p-4">
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className={`cursor-pointer transition-all ${
                selectedProperty?.id === property.id
                  ? "ring-2 ring-primary rounded-lg"
                  : ""
              }`}
              onClick={() => setSelectedProperty(property)}
            >
              <PropertyCard {...property} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};