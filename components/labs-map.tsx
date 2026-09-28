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
      Math.max(
        map.getZoom(),
        7
      ),
      {
        duration: 0.6,
      }
    );
  }, [
    map,
    selectedLab,
  ]);

  return null;
}

function markerColor(
  load: number
) {
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
  onSelect: (
    id: number
  ) => void;
}) {
  const selectedLab =
    labs.find(
      (lab) =>
        lab.id === selectedLabId
    ) ??
    labs[0];

  return (
    <MapContainer
      center={
        VIETNAM_CENTER
      }
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
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
      />

      <MapFocus
        selectedLab={
          selectedLab
        }
      />

      {labs.map(
        (lab) => {
          const position: LatLngTuple =
            [
              lab.lat,
              lab.lng,
            ];

          const isSelected =
            selectedLabId ===
            lab.id;

          return (
            <CircleMarker
              key={lab.id}
              center={
                position
              }
              radius={
                isSelected
                  ? 9
                  : 7
              }
              pathOptions={{
                color:
                  "#ffffff",
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
                    minWidth: 210,
                  }}
                >
                  <strong>
                    {
                      lab.name
                    }
                  </strong>

                  <div
                    style={{
                      marginTop: 6,
                      color:
                        "#5f6f82",
                    }}
                  >
                    {
                      lab.address
                    }
                  </div>

                  <div
                    style={{
                      marginTop: 9,
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
                      marginTop: 5,
                    }}
                  >
                    <strong>
                      Tỉnh / vùng:
                    </strong>{" "}
                    {
                      lab.province
                    }
                  </div>

                  <div
                    style={{
                      marginTop: 5,
                    }}
                  >
                    <strong>
                      Tải hiện tại:
                    </strong>{" "}
                    {lab.load}%
                  </div>

                  <div
                    style={{
                      marginTop: 5,
                    }}
                  >
                    <strong>
                      Chờ dự kiến:
                    </strong>{" "}
                    {
                      lab.waitDays
                    }{" "}
                    ngày
                  </div>

                  <div
                    style={{
                      marginTop: 5,
                    }}
                  >
                    <strong>
                      Trạng thái:
                    </strong>{" "}
                    {
                      lab.status
                    }
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        }
      )}
    </MapContainer>
  );
}