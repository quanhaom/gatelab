'use client';

import type {
  LatLngExpression,
} from "leaflet";
import { useEffect } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import type { LabRecord } from '@/lib/data';


const VIETNAM_CENTER: LatLngExpression = [
  16.2,
  106.0,
];

function MapFocus({ selectedLab }: { selectedLab?: LabRecord }) {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 50);
  }, [map]);

  useEffect(() => {
    if (!selectedLab) return;
    map.flyTo([selectedLab.lat, selectedLab.lng], Math.max(map.getZoom(), 7), {
      duration: 0.6,
    });
  }, [map, selectedLab]);

  return null;
}

function markerColor(load: number) {
  if (load >= 85) return '#ef1b1b';
  if (load >= 50) return '#f1c528';
  return '#46b85f';
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
  const selectedLab = labs.find((lab) => lab.id === selectedLabId) ?? labs[0];

  return (
    <MapContainer
      center={VIETNAM_CENTER}
      zoom={5.6}
      minZoom={5}
      maxZoom={12}
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      <MapFocus selectedLab={selectedLab} />

      {labs.map((lab) => (
        <CircleMarker
          key={lab.id}
          center={[lab.lat, lab.lng]}
          radius={selectedLabId === lab.id ? 9 : 7}
          pathOptions={{
            color: '#ffffff',
            weight: 2,
            fillColor: markerColor(lab.load),
            fillOpacity: 1,
          }}
          eventHandlers={{
            click: () => onSelect(lab.id),
          }}
        >
          <Popup>
            <div style={{ minWidth: 200 }}>
              <strong>{lab.name}</strong>
              <div>{lab.province}</div>
              <div>Chỉ tiêu: {lab.tests.join(' + ')}</div>
              <div>Tải: {lab.load}%</div>
              <div>Chờ: {lab.waitDays} ngày</div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
