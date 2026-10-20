const nodemailer = require('nodemailer');

const gmailUser = process.env.GMAIL;
const gmailPass = process.env.APP_PASSWORD;

let transporter = null;

if (gmailUser && gmailPass) {
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  } catch (err) {
    console.warn('[Mailer Init Warning]:', err.message);
  }
}

/**
 * Send an email notification safely
 */
const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    console.log(`[Mock Email Sent]: To: ${to} | Subject: ${subject}`);
    return { success: true, mocked: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"GoEasy Travels" <${gmailUser}>`,
      to,
      subject,
      text: text || '',
      html,
    });
    console.log(`[Email Sent Successfully]: MessageId: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`[Email Send Notice]: Could not send to ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * HTML Email Template for Vehicle Owner on new booking request
 */
const sendOwnerBookingAlert = async ({ ownerEmail, ownerName, bookingDetails }) => {
  const { bookingId, customerName, customerPhone, vehicleName, pickupCity, dropCity, pickupDate, dropDate, estimatedPrice } = bookingDetails;
  
  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">GoEasy Travels</h1>
        <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Vehicle Rental & Travels Alert</p>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">New Booking Alert! 🚗</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Hello <strong>${ownerName}</strong>,<br/>
          A customer has requested a vehicle booking for your fleet. Please review the details below:
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Booking Reference:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #0f172a; text-align: right;">${bookingId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Vehicle:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #2563eb; text-align: right;">${vehicleName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Route:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #0f172a; text-align: right;">${pickupCity} → ${dropCity}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Duration:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #0f172a; text-align: right;">${pickupDate} to ${dropDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Customer:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #0f172a; text-align: right;">${customerName} (${customerPhone})</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Estimated Rate:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #16a34a; text-align: right;">₹${estimatedPrice}</td>
            </tr>
          </table>
        </div>

        <p style="color: #475569; font-size: 14px;">
          Please log in to your <strong>GoEasy Vehicle Owner Dashboard</strong> to allocate a vehicle, confirm the booking, or contact the customer directly via WhatsApp or phone call.
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="http://localhost:5173/owner/dashboard" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">
            Open Owner Dashboard
          </a>
        </div>
      </div>
      <div style="background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        &copy; 2026 GoEasy Travels India. Seamless Vehicle Rentals.
      </div>
    </div>
  `;

  return sendEmail({
    to: ownerEmail,
    subject: `[GoEasy Booking Alert] New Reservation Request - ${bookingId}`,
    html,
    text: `New Booking Request for ${vehicleName} from ${customerName} (${customerPhone}). Route: ${pickupCity} to ${dropCity}. Please check your dashboard.`,
  });
};

/**
 * HTML Email Template for User booking status updates
 */
const sendUserBookingStatusUpdate = async ({ userEmail, userName, bookingDetails }) => {
  const { bookingId, vehicleName, status, ownerName, ownerPhone, pickupCity, dropCity } = bookingDetails;

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
      <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 28px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700;">GoEasy Travels</h1>
        <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Booking Status Update</p>
      </div>
      <div style="padding: 28px 24px;">
        <p style="color: #475569; font-size: 15px;">
          Hello <strong>${userName}</strong>,<br/>
          Your booking status for reservation <strong>#${bookingId}</strong> has been updated to:
        </p>
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 14px; text-align: center; font-weight: 700; color: #047857; font-size: 18px; margin: 16px 0;">
          ${status.toUpperCase()}
        </div>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          <strong>Vehicle:</strong> ${vehicleName}<br/>
          <strong>Route:</strong> ${pickupCity} → ${dropCity}<br/>
          ${ownerName ? `<strong>Operator / Owner:</strong> ${ownerName} (${ownerPhone})<br/>` : ''}
        </p>
        <div style="text-align: center; margin-top: 24px;">
          <a href="http://localhost:5173/user/dashboard" style="background: #059669; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">
            Track Booking in Dashboard
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject: `[GoEasy Status Update] Booking #${bookingId}: ${status}`,
    html,
    text: `Your booking #${bookingId} for ${vehicleName} is now ${status}. Track in your dashboard.`,
  });
};

module.exports = {
  sendEmail,
  sendOwnerBookingAlert,
  sendUserBookingStatusUpdate,
};
