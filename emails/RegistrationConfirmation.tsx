import React from "react";

interface RegistrationConfirmationEmailProps {
  attendeeName: string;
  workshopName: string;
  registrationNumber: string;
  date: string;
  time: string;
  location: string;
  amount: string;
  to?: string;
}

export default function RegistrationConfirmationEmail({
  attendeeName,
  workshopName,
  registrationNumber,
  date,
  time,
  location,
  amount,
}: RegistrationConfirmationEmailProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "600px",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#2563eb",
          color: "#ffffff",
          padding: "30px 20px",
          textAlign: "center",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <h1 style={{ margin: "0 0 10px 0", fontSize: "28px" }}>
          Registration Confirmed! 🎉
        </h1>
        <p style={{ margin: "0", fontSize: "16px" }}>
          Your workshop registration has been successfully processed
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "0 0 8px 8px",
        }}
      >
        {/* Greeting */}
        <p style={{ fontSize: "16px", color: "#333333", marginBottom: "20px" }}>
          Hello <strong>{attendeeName}</strong>,
        </p>

        <p style={{ fontSize: "15px", color: "#555555", lineHeight: "1.6" }}>
          Thank you for registering for our workshop! Your payment has been
          successfully received. We're excited to have you join us.
        </p>

        {/* Event Details Card */}
        <div
          style={{
            backgroundColor: "#f3f4f6",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "20px",
            margin: "30px 0",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1f2937",
              marginTop: "0",
              marginBottom: "15px",
            }}
          >
            {workshopName}
          </h2>

          <div style={{ fontSize: "14px", color: "#4b5563", lineHeight: "2" }}>
            <p style={{ margin: "0" }}>
              <strong>📅 Date:</strong> {date}
            </p>
            <p style={{ margin: "0" }}>
              <strong>🕐 Time:</strong> {time}
            </p>
            <p style={{ margin: "0" }}>
              <strong>📍 Location:</strong> {location}
            </p>
            <p style={{ margin: "0" }}>
              <strong>💰 Amount Paid:</strong> {amount}
            </p>
            <p style={{ margin: "0" }}>
              <strong>🎫 Registration ID:</strong> {registrationNumber}
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div
          style={{
            backgroundColor: "#f0f9ff",
            border: "1px solid #bfdbfe",
            borderRadius: "8px",
            padding: "15px",
            margin: "20px 0",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#0c4a6e",
              margin: "0 0 10px 0",
            }}
          >
            📌 Important Information
          </h3>
          <ul
            style={{
              fontSize: "14px",
              color: "#0c4a6e",
              paddingLeft: "20px",
              margin: "0",
            }}
          >
            <li>Please save your registration ID for future reference</li>
            <li>
              Arrive 15 minutes early on the day of the workshop
            </li>
            <li>
              Bring a valid ID and your confirmation email with you
            </li>
            <li>
              For any questions, please contact us at support@workshop.dev
            </li>
          </ul>
        </div>

        {/* Closing */}
        <p style={{ fontSize: "15px", color: "#555555", lineHeight: "1.6" }}>
          We look forward to seeing you at the workshop. If you have any
          questions or need to make any changes to your registration, please
          don't hesitate to reach out.
        </p>

        <p style={{ fontSize: "15px", color: "#555555", lineHeight: "1.6" }}>
          Best regards,
          <br />
          <strong>The Workshop Team</strong>
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "20px",
          textAlign: "center",
          fontSize: "12px",
          color: "#6b7280",
          borderRadius: "0 0 8px 8px",
        }}
      >
        <p style={{ margin: "0 0 5px 0" }}>
          © 2024 Workshop Registration Platform. All rights reserved.
        </p>
        <p style={{ margin: "0" }}>
          This is an automated email. Please do not reply directly to this message.
        </p>
      </div>
    </div>
  );
}
