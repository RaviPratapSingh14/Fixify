// src/components/MapWithClusters.jsx
import React from "react";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

export default function MapWithClusters({ issues, icons }) {
  return (
    <MarkerClusterGroup chunkedLoading>
      {issues.map((i) => (
        <Marker
          key={i.id}
          position={[i.latitude, i.longitude]}
          icon={
            new L.Icon({
              iconUrl: icons[i.category] || icons.General,
              iconSize: [32, 32],
            })
          }
        >
          <Popup>
            <strong>{i.title}</strong>
            <br />
            {i.description}
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}
