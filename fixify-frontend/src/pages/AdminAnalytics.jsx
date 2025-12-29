// src/pages/AdminAnalytics.jsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import FixifyNavbar from "../components/Navbar";
import API from "../services/api";

export default function AdminAnalytics() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/issues");
        setIssues(res.data);
      } catch (err) {
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  // GROUPING
  const statusCounts = issues.reduce((a, i) => {
    a[i.status] = (a[i.status] || 0) + 1;
    return a;
  }, {});

  const categoryCounts = issues.reduce((a, i) => {
    a[i.category] = (a[i.category] || 0) + 1;
    return a;
  }, {});

  const cityCounts = issues.reduce((a, i) => {
    const city = i.address?.split(",")[0]?.trim() || "Unknown";
    a[city] = (a[city] || 0) + 1;
    return a;
  }, {});

  const monthlyCounts = issues.reduce((a, i) => {
    const date = new Date(i.createdAt);
    const m = date.toLocaleString("default", { month: "short" });
    a[m] = (a[m] || 0) + 1;
    return a;
  }, {});

  // CHART DATA
  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "By Status",
        data: Object.values(statusCounts),
        backgroundColor: ["#0d6efd", "#ffc107", "#198754"],
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "By Category",
        data: Object.values(categoryCounts),
        backgroundColor: [
          "#4e79a7",
          "#f28e2b",
          "#e15759",
          "#76b7b2",
          "#59a14f",
          "#edc948",
          "#b07aa1",
        ],
      },
    ],
  };

  const cityData = {
    labels: Object.keys(cityCounts),
    datasets: [
      {
        label: "Issues by City",
        data: Object.values(cityCounts),
        backgroundColor: "#0d6efd",
      },
    ],
  };

  const trendData = {
    labels: Object.keys(monthlyCounts),
    datasets: [
      {
        label: "Monthly Trend",
        data: Object.values(monthlyCounts),
        borderColor: "#6610f2",
        tension: 0.25,
      },
    ],
  };

  return (
    <>
      <FixifyNavbar />

      <Container className="py-4">
        <h2 className="fw-bold text-primary mb-4">📊 Admin Analytics</h2>

        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
            <p className="text-muted">Loading...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Row className="g-4">
            <Col md={6}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Status Distribution</Card.Title>
                  <Pie data={statusData} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Category Distribution</Card.Title>
                  <Bar data={categoryData} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={12}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Issues by City</Card.Title>
                  <Bar data={cityData} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={12}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Monthly Issue Trend</Card.Title>
                  <Line data={trendData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}
