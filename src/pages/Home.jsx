import React from 'react'
import { Link } from 'react-router-dom'
import { FaQrcode, FaHistory } from 'react-icons/fa'
import Header from '../../src/components/Scanner/Layout/Header'
import Footer from '../../src/components/Scanner/Layout/Footer'
import Card from '../../src/components/UI/Card'

/**
 * Home page component
 * @returns {JSX.Element} Home page
 */
const Home = () => {
  return (
    <div className="container">
      <Header title="QR Scanner App" />
      
      <div style={{ textAlign: 'center', padding: '1rem 0 2rem' }}>
        <img 
          src="/logo.png" 
          alt="QR Scanner App" 
          style={{ 
            maxWidth: '120px', 
            marginBottom: '1.5rem' 
          }}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = 'https://via.placeholder.com/120'
          }}
        />
        
        <p style={{ color: '#718096', marginBottom: '2rem' }}>
          Quickly scan QR codes and barcodes with your device's camera
        </p>
        
        <Card>
          <Link 
            to="/scan" 
            style={{
              display: 'block',
              backgroundColor: '#4299e1',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              fontWeight: 500,
              marginBottom: '1rem',
              textAlign: 'center'
            }}
          >
            <FaQrcode style={{ marginRight: '0.5rem' }} />
            Start Scanning
          </Link>
          
          <Link 
            to="/results" 
            style={{
              display: 'block',
              backgroundColor: 'transparent',
              color: '#4299e1',
              padding: '0.75rem',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              fontWeight: 500,
              border: '1px solid #4299e1',
              textAlign: 'center'
            }}
          >
            <FaHistory style={{ marginRight: '0.5rem' }} />
            View Scan History
          </Link>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}

export default Home