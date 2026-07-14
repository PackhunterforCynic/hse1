import React from 'react';

const AutoReply = ({ name }) => {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#1a1a1a', padding: '20px' }}>
      <h1 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '20px', marginBottom: '20px' }}>
        Thank you for contacting Havilah
      </h1>
      <div style={{ lineHeight: '1.6' }}>
        <p>Hi {name},</p>
        <p>We've received your enquiry.</p>
        <p>Thank you for reaching out to us. Our team will get back to you within 24 hours.</p>
        <br />
        <p>Regards,</p>
        <p><strong>Havilah Team</strong></p>
      </div>
    </div>
  );
};

export default AutoReply;
