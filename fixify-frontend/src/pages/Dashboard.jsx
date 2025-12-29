import { useEffect, useState } from "react";
import {
  Container,
  Button,
  Modal,
  Form,
  Alert,
  Image,
  Row,
  Col,
} from "react-bootstrap";

import API from "../services/api";

// Leaflet
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Components
import Layout from "../components/Layout";
import StatsBar from "../components/StatsBar";
import FloatingReportButton from "../components/FloatingReportButton";

// ===============================
// 📍 FIXED MARKER ICON (NO DRIFT)
// ===============================
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER = [22.9734, 78.6569];

// ===============================
// 🖱 MAP CLICK HANDLER
// ===============================
function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    },
  });
  return null;
}

// ===============================
// 🎯 CONTROLLED RECENTER
// ===============================
function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 16, { animate: true });
    }
  }, [position, map]);

  return null;
}

export default function Dashboard() {
  const username = localStorage.getItem("username") || "Anonymous";

  const [issues, setIssues] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [markerPos, setMarkerPos] = useState(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    category: "General",
    priority: "Medium",
    createdBy: username,
  });

  // ===============================
  // 📥 LOAD ISSUES
  // ===============================
  const loadIssues = async () => {
    try {
      const res = await API.get("/issues");
      setIssues(res.data);
    } catch {
      setAlert({ type: "danger", msg: "Failed to load issues" });
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  // ===============================
  // 📡 AUTO GPS
  // ===============================
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleLocationPick({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {},
      { enableHighAccuracy: true }
    );
  }, []);

  // ===============================
  // 🌍 REVERSE GEOCODING
  // ===============================
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      return data.display_name || "";
    } catch {
      return "";
    }
  };

  // ===============================
  // 📍 LOCATION PICK
  // ===============================
  const handleLocationPick = async ({ lat, lng }) => {
    setMarkerPos([lat, lng]);

    const address = await reverseGeocode(lat, lng);

    setForm((f) => ({
      ...f,
      latitude: lat,
      longitude: lng,
      address,
    }));

    setShowModal(true);
  };

  // ===============================
  // 🖼 IMAGE
  // ===============================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ===============================
  // 🚀 SUBMIT ISSUE
  // ===============================
  const submitIssue = async () => {
    if (!form.latitude || !form.longitude) {
      return setAlert({ type: "warning", msg: "Select location on map" });
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append(
        "issue",
        new Blob([JSON.stringify(form)], { type: "application/json" })
      );
      if (image) formData.append("image", image);

      await API.post("/issues", formData);

      setAlert({ type: "success", msg: "✅ Issue reported successfully" });
      setShowModal(false);
      setMarkerPos(null);
      setImage(null);
      setPreview(null);

      setForm({
        title: "",
        description: "",
        address: "",
        latitude: "",
        longitude: "",
        category: "General",
        priority: "Medium",
        createdBy: username,
      });

      loadIssues();
    } catch {
      setAlert({ type: "danger", msg: "❌ Failed to report issue" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container fluid className="py-3">
        <StatsBar
          stats={{
            total: issues.length,
            newToday: issues.filter((i) => i.status === "NEW").length,
            inProgress: issues.filter((i) => i.status === "IN_PROGRESS").length,
            resolved: issues.filter((i) => i.status === "FIXED").length,
          }}
        />

        {alert && (
          <Alert
            variant={alert.type}
            dismissible
            onClose={() => setAlert(null)}
          >
            {alert.msg}
          </Alert>
        )}

        <MapContainer
          center={DEFAULT_CENTER}
          zoom={5}
          style={{ height: "70vh", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <ClickHandler onPick={handleLocationPick} />
          <RecenterMap position={markerPos} />

          {markerPos && (
            <Marker
              position={markerPos}
              icon={markerIcon}
              draggable
              eventHandlers={{
                dragend: (e) =>
                  handleLocationPick(e.target.getLatLng()),
              }}
            >
              <Popup>📍 Drag to fine-tune location</Popup>
            </Marker>
          )}

          {issues.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={markerIcon}
            >
              <Popup>
                <strong>{issue.title}</strong>
                <br />
                {issue.category}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Container>

      <FloatingReportButton
        onClick={() =>
          setAlert({ type: "info", msg: "Click map to report issue" })
        }
      />

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>📝 Report an Issue</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Issue Title *</Form.Label>
            <Form.Control
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </Form.Group>

          <Row className="mb-2">
            <Col>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option>General</option>
                  <option>Pothole</option>
                  <option>Garbage</option>
                  <option>Street Light</option>
                  <option>Water Leakage</option>
                  <option>Electricity</option>
                  <option>Sewage</option>
                  <option>Road Damage</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-2">
            <Form.Label>Detected Address</Form.Label>
            <Form.Control value={form.address} disabled />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Nearby Landmark</Form.Label>
            <Form.Control
              value={form.landmark || ""}
              onChange={(e) =>
                setForm({ ...form, landmark: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              value={form.contact || ""}
              onChange={(e) =>
                setForm({ ...form, contact: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          </Form.Group>

          {preview && (
            <div className="text-center mb-3">
              <Image src={preview} thumbnail style={{ maxHeight: 220 }} />
            </div>
          )}

          <Form.Check
            type="checkbox"
            label="Report anonymously"
            className="mb-3"
            checked={form.anonymous}
            onChange={(e) =>
              setForm({ ...form, anonymous: e.target.checked })
            }
          />

          <Button
            className="w-100"
            variant="primary"
            onClick={submitIssue}
            disabled={loading}
          >
            {loading ? "Submitting..." : "🚀 Submit Issue"}
          </Button>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}
