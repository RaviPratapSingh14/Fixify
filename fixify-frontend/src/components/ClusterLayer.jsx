import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";

export default function ClusterLayer({ issues }) {
  const map = useMap();

  useEffect(() => {
    if (!issues || issues.length === 0) return;

    const clusterGroup = L.markerClusterGroup();

    issues.forEach(issue => {
      if (!issue.latitude || !issue.longitude) return;

      const marker = L.marker([issue.latitude, issue.longitude]);
      marker.bindPopup(`
        <strong>${issue.title}</strong><br/>
        ${issue.description}
      `);

      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [issues, map]);

  return null;
}
