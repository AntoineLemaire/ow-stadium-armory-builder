import { TextField, useTheme } from "@mui/material";
import React, { useState } from "react";
import zxcvbn from "zxcvbn";

const strengthLabels = ["Weak", "Weak", "OK", "OK", "Strong"];
const strengthColors = ["#ff4d4d", "#ff4d4d", "#ffcc00", "#ffcc00", "#00cc44"];

function PasswordStrengthBar({
  password,
  setPassword,
}: {
  password: string;
  setPassword: (pwd: string) => void;
}) {
  const theme = useTheme();
  const [feedback, setFeedback] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);

    const result = zxcvbn(pwd);

    // Set feedback messages (combine suggestions and warnings)
    const messages = [];
    if (result.feedback.warning) messages.push(result.feedback.warning);

    setFeedback(messages);
  };

  const score = zxcvbn(password).score;
  const label = strengthLabels[score];
  const color = strengthColors[score];

  // Example password requirements to display
  const requirements = [
    { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
    {
      label: "Contains uppercase letter",
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    { label: "Contains number", test: (pw: string) => /\d/.test(pw) },
    {
      label: "Contains special character",
      test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    },
  ];

  return (
    <>
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={handleChange}
        size="small"
        required
      />

      {/* Strength Bar */}
      <div
        style={{
          height: 10,
          backgroundColor: "#ddd",
          borderRadius: 5,
          marginTop: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${((score + 1) / 5) * 100}%`,
            height: "100%",
            backgroundColor: color,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Strength Label */}
      <div style={{ marginTop: 4, fontWeight: "bold", color }}>{label}</div>

      {/* Password Requirements */}
      <ul style={{ paddingLeft: 20 }}>
        {requirements.map(({ label, test }) => (
          <li
            key={label}
            style={{
              color: test(password) ? "green" : "red",
              fontWeight: test(password) ? "bold" : "normal",
            }}
          >
            {label}
          </li>
        ))}
      </ul>

      {/* zxcvbn Feedback */}
      {feedback.length > 0 && (
        <div style={{ marginTop: 1, color: theme.palette.text.secondary }}>
          <strong>Warnings:</strong>
          <ul>
            {feedback.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default PasswordStrengthBar;
