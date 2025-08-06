import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      color: 'var(--text-secondary)',
      padding: '16px 24px',
      textAlign: 'center',
      fontSize: '14px',
      borderTop: '1px solid var(--border-color)',
      marginTop: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div>
          © {currentYear} Finovia. All rights reserved.
        </div>
        <div style={{
          display: 'flex',
          gap: '20px',
          fontSize: '12px'
        }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact Support</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 