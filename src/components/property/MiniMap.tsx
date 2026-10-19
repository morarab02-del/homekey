import { useEffect, useRef, useState } from "react";
import { ExternalLink, Navigation, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Property } from "@/types/property";
import { priceLabel } from "@/lib/filtering";

/* Real Google Maps URLs for a property's geocoded coordinates. */
export function googleMapsEmbedUrl(p: Property, zoom = 15): string {
  return `https://www.google.com/maps?q=${p.location.lat},${p.location.lng}&z=${zoom}&output=embed`;
}

export function googleMapsLink(p: Property): string {
  return `https://www.google.com/maps/search/?api=1&query=${p.location.lat},${p.location.lng}`;
}

export function directionsLink(p: Property): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${p.location.lat},${p.location.lng}`;
}

/** A price-labelled pin that does not rely on Leaflet's default marker images. */
function priceIcon(label: string) {
  return L.divIcon({
    className: "hk-map-pin",
    html: `<span class="hk-map-pin__label" style="display:inline-flex;align-items:center;padding:5px 10px;border:1px solid rgba(170,124,49,.35);border-radius:999px;background:#1A1612;color:#FDFBF7;font:700 12px/1.2 system-ui,-apple-system,'Segoe UI',sans-serif;white-space:nowrap;box-shadow:0 6px 16px rgba(26,22,18,.35)"><span>${label}</span><i style="position:absolute;left:50%;bottom:-5px;width:9px;height:9px;transform:translateX(-50%) rotate(45deg);background:#1A1612;border-right:1px solid rgba(170,124,49,.35);border-bottom:1px solid rgba(170,124,49,.35)"></i></span>`,
    iconSize: [62, 28],
    iconAnchor: [31, 14],
  });
}

/** Interactive fallback map (OpenStreetMap, no key) shown if the Google embed is blocked. */
function OsmFallback({ property, height }: { property: Property; height: number }) {
  return (
    <MapContainer
      center={[property.location.lat, property.location.lng]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height, width: "100%" }}
      attributionControl
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
        position={[property.location.lat, property.location.lng]}
        icon={priceIcon(priceLabel(property))}
      >
        <Popup>
          <strong>{property.title}</strong>
          <br />
          {property.address.street}
          <br />
          {property.address.city}, {property.address.state} {property.address.zip}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

/**
 * Map for a single listing.
 *
 * Primary: a real Google Map embedded from google.com/maps centred on the
 * listing's geocoded coordinates. If that embed is blocked (offline, strict
 * network policy, or a browser that refuses it), we automatically fall back to
 * an interactive OpenStreetMap map so the client always gets a working map,
 * plus "Open in Google Maps" and "Get directions" links to the real thing.
 */
export function MiniMap({ property, height = 320 }: { property: Property; height?: number }) {
  const [blocked, setBlocked] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    loaded.current = false;
    setBlocked(false);
    const timer = window.setTimeout(() => {
      if (!loaded.current) setBlocked(true);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [property.id]);

  return (
    <div className="overflow-hidden rounded-xl2 border border-muted-200 dark:border-white/10">
      <div className="flex items-center justify-between gap-3 border-b border-muted-200 bg-white px-4 py-2.5 dark:border-white/10 dark:bg-white/[.04]">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">
            {property.address.street}
          </p>
          <p className="truncate text-xs text-ink-600 dark:text-muted-500">
            {property.address.neighborhood}, {property.address.city},{" "}
            {property.address.state} {property.address.zip}
          </p>
        </div>
        <span className="pill pill-muted shrink-0">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {property.location.lat.toFixed(4)}, {property.location.lng.toFixed(4)}
        </span>
      </div>

      <div className="relative bg-muted-100 dark:bg-white/5">
        {blocked ? (
          <OsmFallback property={property} height={height} />
        ) : (
          <iframe
            title={`Google Map showing ${property.address.street}, ${property.address.city}`}
            src={googleMapsEmbedUrl(property)}
            width="100%"
            height={height}
            style={{ border: 0, display: "block" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            onLoad={() => {
              loaded.current = true;
            }}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-muted-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[.04]">
        <a
          href={googleMapsLink(property)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-md"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Open in Google Maps
        </a>
        <a
          href={directionsLink(property)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-md"
        >
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Get directions
        </a>
      </div>
    </div>
  );
}
