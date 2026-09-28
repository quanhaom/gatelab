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

const CARTO_API_KEY =
  process.env.NEXT_PUBLIC_CARTO_API_KEY;

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

  const tileUrl =
    CARTO_API_KEY
      ? `https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`
      : "";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {!CARTO_API_KEY && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform:
              "translateX(-50%)",
            zIndex: 1000,
            padding:
              "8px 12px",
            borderRadius: 6,
            background:
              "#fff3cd",
            border:
              "1px solid #ffe69c",
            color:
              "#664d03",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Thiếu
          NEXT_PUBLIC_CARTO_API_KEY
        </div>
      )}

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
        {CARTO_API_KEY && (
          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url={
              tileUrl
            }
          />
        )}

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
                key={
                  lab.id
                }
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
                  click:
                    () =>
                      onSelect(
                        lab.id
                      ),
                }}
              >
                <Popup>
                  <div
                    style={{
                      minWidth:
                        220,
                      lineHeight:
                        1.5,
                    }}
                  >
                    <div
                      style={{
                        fontWeight:
                          700,
                        fontSize:
                          14,
                        color:
                          "#10203a",
                      }}
                    >
                      {
                        lab.name
                      }
                    </div>

                    <div
                      style={{
                        marginTop:
                          6,
                        color:
                          "#607086",
                        fontSize:
                          12,
                      }}
                    >
                      {
                        lab.address
                      }
                    </div>

                    <div
                      style={{
                        marginTop:
                          10,
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
                        marginTop:
                          4,
                      }}
                    >
                      <strong>
                        Tỉnh /
                        vùng:
                      </strong>{" "}
                      {
                        lab.province
                      }
                    </div>

                    <div
                      style={{
                        marginTop:
                          4,
                      }}
                    >
                      <strong>
                        Tải hiện
                        tại:
                      </strong>{" "}
                      {
                        lab.load
                      }
                      %
                    </div>

                    <div
                      style={{
                        marginTop:
                          4,
                      }}
                    >
                      <strong>
                        Chờ dự
                        kiến:
                      </strong>{" "}
                      {
                        lab.waitDays
                      }{" "}
                      ngày
                    </div>

                    <div
                      style={{
                        marginTop:
                          4,
                      }}
                    >
                      <strong>
                        Trạng
                        thái:
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
    </div>
  );
}