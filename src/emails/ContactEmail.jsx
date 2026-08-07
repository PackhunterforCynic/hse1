import React from 'react';

const ContactEmail = ({ name, email, phone, service, message }) => {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#1a1a1a', padding: '20px' }}>
      <h1 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '24px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>
        New Contact Request
      </h1>
      <div style={{ marginTop: '20px', lineHeight: '1.6' }}>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone:</strong> {phone || 'Not provided'}</p>
        <p><strong>Service:</strong> {service || 'Not specified'}</p>
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message}</p>
        </div>
      </div>
      <p style={{ marginTop: '40px', fontSize: '12px', color: '#666' }}>
        Sent from Havilah Website Contact Form
      </p>
    </div>
  );
};

export default ContactEmail;
