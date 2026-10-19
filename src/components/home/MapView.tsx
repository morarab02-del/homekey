import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Map as MapIcon } from "lucide-react";
import {
  MapContainer as LeafletMapContainer,
  Marker as LeafletMarker,
  Popup as LeafletPopup,
  TileLayer as LeafletTileLayer,
  ZoomControl as LeafletZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui";
import { formatBaths, formatBeds, formatNumber, propertyUrl } from "@/lib/formatting";
import { priceLabel } from "@/lib/filtering";
import type { Property } from "@/types/property";

/* `@types/leaflet` is not installed and Leaflet 1.9 ships no bundled types, so the
   react-leaflet components are narrowed to the exact props this map uses. */
interface MapContainerProps {
  center: [number, number];
  zoom: number;
  scrollWheelZoom?: boolean;
  className?: string;
  children?: ReactNode;
}
interface TileLayerProps {
  url: string;
  attribution?: string;
}
interface ZoomControlProps {
  position?: string;
}
interface MarkerProps {
  position: [number, number];
  icon: PricePin;
  children?: ReactNode;
}
interface PopupProps {
  children?: ReactNode;
}

/** Shape Leaflet's `L.divIcon()` returns — everything `Marker` touches. */
interface PricePin {
  createIcon: (oldIcon?: HTMLElement | null) => HTMLElement;
  createShadow: () => null;
  options: {
    className: string;
    html: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
    popupAnchor: [number, number];
  };
}

const MapContainer = LeafletMapContainer as unknown as ComponentType<MapContainerProps>;
const TileLayer = LeafletTileLayer as unknown as ComponentType<TileLayerProps>;
const ZoomControl = LeafletZoomControl as unknown as ComponentType<ZoomControlProps>;
const Marker = LeafletMarker as unknown as ComponentType<MarkerProps>;
const Popup = LeafletPopup as unknown as ComponentType<PopupProps>;

const TEXAS_CENTER: [number, number] = [31.0, -98.5];

/** Price pill pin matching prototype: bg-ink-primary text-surface-main rounded-full px-3 py-2 shadow-md */
function createPricePin(label: string, property: Property): PricePin {
  const accessibleLabel = `${property.title}, ${priceLabel(property)}, ${property.address.neighborhood}, ${property.address.city}`;

  const html =
    `<span style="position:absolute;left:0;top:0;transform:translate(-50%,calc(-100% - 9px));` +
    "display:inline-flex;align-items:center;padding:5px 12px;border-radius:999px;background:#1A1612;color:#FDFBF7;font:700 11px/1.2 system-ui,-apple-system,'Segoe UI',sans-serif;" +
    'white-space:nowrap;pointer-events:auto;box-shadow:0 6px 16px rgba(26,22,18,.35)">' +
    `<span>${label}</span>` +
    '<i style="position:absolute;left:50%;bottom:-5px;width:9px;height:9px;transform:translateX(-50%) rotate(45deg);' +
    'background:#1A1612;border-right:1px solid rgba(170,124,49,.35);border-bottom:1px solid rgba(170,124,49,.35)"></i>' +
    "</span>";

  return {
    options: {
      className: "hk-price-pin",
      html,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      popupAnchor: [0, -46],
    },
    createIcon: (oldIcon) => {
      const div = oldIcon && oldIcon.tagName === "DIV" ? oldIcon : document.createElement("div");
      div.className = "hk-price-pin";
      div.innerHTML = html;
      // Accessibility: make the pin focusable and provide accessible name
      div.setAttribute("role", "button");
      div.setAttribute("tabIndex", "0");
      div.setAttribute("aria-label", accessibleLabel);
      div.setAttribute("aria-haspopup", "dialog");
      // Keyboard activation: Enter/Space opens popup
      div.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          div.click();
        }
      });
      // Visible focus indicator
      div.addEventListener("focus", () => {
        div.style.outline = "2px solid #A77C31";
        div.style.outlineOffset = "2px";
      });
      div.addEventListener("blur", () => {
        div.style.outline = "";
        div.style.outlineOffset = "";
      });
      return div;
    },
    createShadow: () => null,
  };
}

export function MapView({ items }: { items: Property[] }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [open, setOpen] = useState(false);
  const expanded = !isMobile || open;

  const pins = useMemo(
    () => new Map(items.map((property) => [property.id, createPricePin(priceLabel(property), property)])),
    [items],
  );

  return (
    <section className="border-t border-sand-border">
      <div className="shell section">
        <SectionHeading
          title="Explore the map"
          subtitle={`${items.length} ${items.length === 1 ? "home" : "homes"} pinned across Texas — tap a price tag for the details.`}
          action={
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="md:hidden"
              aria-expanded={expanded}
              onClick={() => setOpen((value) => !value)}
            >
              <MapIcon className="h-4 w-4" aria-hidden="true" />
              {expanded ? "Hide map" : "Show map"}
            </Button>
          }
        />

        {expanded ? (
          <div className="relative z-0 h-96 w-full overflow-hidden rounded-2xl border border-sand-border bg-surface-subtle">
            <MapContainer
              center={TEXAS_CENTER}
              zoom={6}
              scrollWheelZoom={false}
              className="h-96 w-full rounded-2xl"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ZoomControl position="topright" />

              {items.map((property) => {
                const icon = pins.get(property.id) ?? createPricePin(priceLabel(property), property);
                return (
                  <Marker
                    key={property.id}
                    position={[property.location.lat, property.location.lng]}
                    icon={icon}
                  >
                    <Popup>
                      <div className="w-56 p-0.5">
                        <p className="text-sm font-bold leading-snug text-ink-primary">
                          {property.title}
                        </p>
                        <p className="mt-1 text-sm font-bold text-brand-700 dark:text-brand-300">
                          {priceLabel(property)}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">
                          {formatBeds(property.bedrooms)} · {formatBaths(property.bathrooms)} ·{" "}
                          {formatNumber(property.sqft)} sqft
                        </p>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {property.address.city}, {property.address.state}
                        </p>
                        <Link
                          to={propertyUrl(property.id)}
                          className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline dark:text-brand-300"
                        >
                          View property
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-sand-border p-6 text-center text-sm text-ink-muted">
            Tap "Show map" to see where every home sits.
          </p>
        )}
      </div>
    </section>
  );
}