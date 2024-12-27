const emailTemplate = (userEmail: string, resetLink: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: #4CAF50;
      color: #ffffff;
      text-align: center;
      padding: 20px 10px;
      font-size: 1.5em;
    }
    .content {
      padding: 20px;
    }
    .button-container {
      text-align: center;
      margin: 20px 0;
    }
    .button {
      background: #4CAF50;
      padding: 10px 20px;
      text-decoration: none;
      color: #ffffff;
      font-size: 1em;
      border-radius: 4px;
    }
    .footer {
      background: #f1f1f1;
      color: #555;
      text-align: center;
      font-size: 0.9em;
      padding: 10px 15px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PH University</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${userEmail}</strong>,</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <div class="button-container">
        <a href="${resetLink}" class="button">Reset Password</a>
      </div>
      <p>If you didn’t request this, you can safely ignore this email.</p>
      <p>Thanks,<br>PH University Team</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} PH University. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
}

export default emailTemplate
