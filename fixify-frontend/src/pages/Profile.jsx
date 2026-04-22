import { useEffect, useState } from "react";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import Layout from "../components/Layout";
import API from "../services/api";

const formatDate = (value) =>
  value ? new Date(value).toLocaleString() : "N/A";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users/me");
      setProfile(res.data);
      setEmail(res.data.email || "");
    } catch (err) {
      console.error(err);
      setAlert({ type: "danger", msg: "Failed to load profile." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const saveProfile = async () => {
    try {
      setSaving(true);
      await API.put("/users/me", { email });
      setAlert({ type: "success", msg: "Profile updated successfully." });
      loadProfile();
    } catch (err) {
      console.error(err);
      setAlert({ type: "danger", msg: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <Card className="user-page-card profile-card p-0 overflow-hidden">
        <div className="user-page-hero profile-hero">
          <div className="user-avatar">
            {(profile?.username || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="mb-1">Profile</h3>
            <p className="mb-0">Manage your account details.</p>
          </div>
        </div>

        <div className="p-3 p-md-4">
          {alert && (
            <Alert
              variant={alert.type}
              dismissible
              onClose={() => setAlert(null)}
            >
              {alert.msg}
            </Alert>
          )}

          {loading ? (
            <div className="py-4 text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <div className="profile-meta-grid mb-3">
                <div className="meta-pill">
                  <span>Username</span>
                  <strong>{profile?.username}</strong>
                </div>
                <div className="meta-pill">
                  <span>Role</span>
                  <strong>{profile?.role}</strong>
                </div>
                <div className="meta-pill">
                  <span>Joined</span>
                  <strong>{formatDate(profile?.createdAt)}</strong>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="user-input"
                />
              </Form.Group>

              <Button
                className="action-btn"
                onClick={saveProfile}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </>
          )}
        </div>
      </Card>
    </Layout>
  );
}
