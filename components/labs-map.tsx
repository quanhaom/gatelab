"use client";

import { useEffect } from "react";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import type { LatLngTuple } from "leaflet";

import type { LabRecord } from "@/lib/data";

const VIETNAM_CENTER: LatLngTuple = [
  16.2,
  106.0,
];

function MapFocus({
  selectedLab,
}: {
  selectedLab?: LabRecord;
}) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [map]);

  useEffect(() => {
    if (!selectedLab) {
      return;
    }

    const position: LatLngTuple = [
      selectedLab.lat,
      selectedLab.lng,
    ];

    map.flyTo(
      position,
      Math.max(map.getZoom(), 7),
      {
        duration: 0.6,
      }
    );
  }, [map, selectedLab]);

  return null;
}

function markerColor(load: number) {
  if (load >= 85) {
    return "#ef1b1b";
  }

  if (load >= 50) {
    return "#f1c528";
  }

  return "#46b85f";
}

export default function LabsMap({
  labs,
  selectedLabId,
  onSelect,
}: {
  labs: LabRecord[];
  selectedLabId?: number;
  onSelect: (id: number) => void;
}) {
  const selectedLab =
    labs.find(
      (lab) =>
        lab.id === selectedLabId
    ) ?? labs[0];

  return (
    <MapContainer
      center={VIETNAM_CENTER}
      zoom={6}
      minZoom={5}
      maxZoom={12}
      zoomControl={true}
      scrollWheelZoom={true}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <TileLayer
        attribution="Tiles © Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
      />

      <MapFocus
        selectedLab={selectedLab}
      />

      {labs.map((lab) => {
        const position: LatLngTuple = [
          lab.lat,
          lab.lng,
        ];

        const isSelected =
          selectedLabId === lab.id;

        return (
          <CircleMarker
            key={lab.id}
            center={position}
            radius={
              isSelected
                ? 9
                : 7
            }
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor:
                markerColor(
                  lab.load
                ),
              fillOpacity: 1,
            }}
            eventHandlers={{
              click: () =>
                onSelect(
                  lab.id
                ),
            }}
          >
            <Popup>
              <div
                style={{
                  minWidth: 220,
                  lineHeight: 1.5,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#10203a",
                  }}
                >
                  {lab.name}
                </div>

                <div
                  style={{
                    marginTop: 6,
                    color: "#607086",
                    fontSize: 12,
                  }}
                >
                  {lab.address}
                </div>

                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  <strong>
                    Chỉ tiêu:
                  </strong>{" "}
                  {lab.tests.join(
                    " + "
                  )}
                </div>

                <div
                  style={{
                    marginTop: 4,
                  }}
                >
                  <strong>
                    Tỉnh / vùng:
                  </strong>{" "}
                  {lab.province}
                </div>

                <div
                  style={{
                    marginTop: 4,
                  }}
                >
                  <strong>
                    Tải hiện tại:
                  </strong>{" "}
                  {lab.load}%
                </div>

                <div
                  style={{
                    marginTop: 4,
                  }}
                >
                  <strong>
                    Chờ dự kiến:
                  </strong>{" "}
                  {lab.waitDays} ngày
                </div>

                <div
                  style={{
                    marginTop: 4,
                  }}
                >
                  <strong>
                    Trạng thái:
                  </strong>{" "}
                  {lab.status}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}