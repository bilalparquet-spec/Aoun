"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { HELP_TYPE_LABELS, URGENCY_LABELS, MAP_COLORS } from "@/lib/constants";

export type MapData = {
  helpRequests: Array<{ id: string; helpType: string; urgency: string; description: string; approxLat: number; approxLng: number; isDemo: boolean; wilaya: { nameAr: string } }>;
  collectionPoints: Array<{ id: string; name: string; address: string; lat: number; lng: number; isDemo: boolean; wilaya: { nameAr: string } }>;
  storagePoints: Array<{ id: string; name: string; address: string; lat: number; lng: number; isDemo: boolean; wilaya: { nameAr: string } }>;
  distributionPoints: Array<{ id: string; name: string; address: string; lat: number; lng: number; isDemo: boolean; wilaya: { nameAr: string } }>;
  organizations: Array<{ id: string; name: string; lat: number | null; lng: number | null; isDemo: boolean; wilaya: { nameAr: string } }>;
};

function divIcon(color: string, emoji: string) {
  return L.divIcon({
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)"><span style="transform:rotate(45deg);font-size:13px;">${emoji}</span></div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

function ClusterLayer({ data, visible }: { data: MapData; visible: Record<string, boolean> }) {
  const map = useMap();
  const groupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    const group = L.markerClusterGroup({ maxClusterRadius: 50 });
    groupRef.current = group;
    map.addLayer(group);
    return () => {
      map.removeLayer(group);
    };
  }, [map]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    group.clearLayers();

    if (visible.helpRequest) {
      data.helpRequests.forEach((r) => {
        const t = HELP_TYPE_LABELS[r.helpType];
        const u = URGENCY_LABELS[r.urgency];
        const marker = L.marker([r.approxLat, r.approxLng], {
          icon: divIcon(MAP_COLORS.helpRequest, t?.emoji ?? "🆘"),
        }).bindPopup(
          `<div style="font-family:inherit;direction:rtl;text-align:right;min-width:180px">
            <strong>${u?.emoji ?? ""} طلب مساعدة ${r.isDemo ? "(DEMO)" : ""}</strong><br/>
            ${t?.label ?? r.helpType} — ${r.wilaya.nameAr}<br/>
            <span style="font-size:12px;color:#666">${r.description.slice(0, 100)}</span>
          </div>`
        );
        group.addLayer(marker);
      });
    }
    if (visible.collectionPoint) {
      data.collectionPoints.forEach((p) => {
        const marker = L.marker([p.lat, p.lng], { icon: divIcon(MAP_COLORS.collectionPoint, "📦") }).bindPopup(
          `<div style="direction:rtl;text-align:right;min-width:180px"><strong>🟢 ${p.name} ${p.isDemo ? "(DEMO)" : ""}</strong><br/>${p.address}<br/><span style="font-size:12px;color:#666">${p.wilaya.nameAr}</span></div>`
        );
        group.addLayer(marker);
      });
    }
    if (visible.storagePoint) {
      data.storagePoints.forEach((p) => {
        const marker = L.marker([p.lat, p.lng], { icon: divIcon(MAP_COLORS.storagePoint, "🚚") }).bindPopup(
          `<div style="direction:rtl;text-align:right;min-width:180px"><strong>🔵 ${p.name} ${p.isDemo ? "(DEMO)" : ""}</strong><br/>${p.address}<br/><span style="font-size:12px;color:#666">${p.wilaya.nameAr}</span></div>`
        );
        group.addLayer(marker);
      });
    }
    if (visible.distributionPoint) {
      data.distributionPoints.forEach((p) => {
        const marker = L.marker([p.lat, p.lng], { icon: divIcon(MAP_COLORS.distributionPoint, "📍") }).bindPopup(
          `<div style="direction:rtl;text-align:right;min-width:180px"><strong>🟡 ${p.name} ${p.isDemo ? "(DEMO)" : ""}</strong><br/>${p.address}<br/><span style="font-size:12px;color:#666">${p.wilaya.nameAr}</span></div>`
        );
        group.addLayer(marker);
      });
    }
    if (visible.volunteerOrg) {
      data.organizations.forEach((o) => {
        if (o.lat == null || o.lng == null) return;
        const marker = L.marker([o.lat, o.lng], { icon: divIcon(MAP_COLORS.volunteerOrg, "🏢") }).bindPopup(
          `<div style="direction:rtl;text-align:right;min-width:180px"><strong>🟣 ${o.name} ${o.isDemo ? "(DEMO)" : ""}</strong><br/><span style="font-size:12px;color:#666">${o.wilaya.nameAr}</span></div>`
        );
        group.addLayer(marker);
      });
    }
  }, [data, visible]);

  return null;
}

export function InteractiveMap({ data, visible }: { data: MapData; visible: Record<string, boolean> }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="h-full w-full animate-pulse bg-border/40 rounded-2xl" />;

  return (
    <MapContainer center={[28.0339, 1.6596]} zoom={5} className="h-full w-full rounded-2xl" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClusterLayer data={data} visible={visible} />
    </MapContainer>
  );
}
