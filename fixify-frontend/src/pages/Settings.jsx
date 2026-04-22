import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import Layout from "../components/Layout";
import API from "../services/api";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setAlert({
        type: "warning",
        msg: "New password and confirm password must match.",
      });
      return;
    }

    try {
      setSaving(true);
      await API.put("/users/me/password", {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setAlert({ type: "success", msg: "Password updated successfully." });
    } catch (err) {
      console.error(err);
      setAlert({
        type: "danger",
        msg: err?.response?.data?.message || "Failed to update password.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <Card className="user-page-card settings-card p-0 overflow-hidden">
        <div className="user-page-hero settings-hero">
          <div>
            <h3 className="mb-1">Settings</h3>
            <p className="mb-0">Secure your account with a password update.</p>
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

          <div className="settings-form-shell">
            <h5 className="mb-3">Change Password</h5>

            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                className="user-input"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                className="user-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                className="user-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button
              className="action-btn"
              onClick={handlePasswordUpdate}
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>
      </Card>
    </Layout>
  );
}
