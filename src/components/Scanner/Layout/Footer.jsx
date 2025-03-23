import React from 'react'

/**
 * Footer component
 * @returns {JSX.Element} Footer component
 */
const Footer = () => {
  return (
    <footer style={{ 
      marginTop: '2rem',
      padding: '1rem',
      textAlign: 'center',
      borderTop: '1px solid #e2e8f0',
      color: '#718096',
      fontSize: '0.875rem'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <p style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} Sustainable Shopping Advisor. All rights reserved.
          </p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem',
            marginTop: '0.5rem'
          }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer