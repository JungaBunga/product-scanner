import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Scanner/Layout/Header'
import Footer from '../components/Scanner/Layout/Footer'
import Button from '../components/UI/Button'

/**
 * Not found (404) page component
 * @returns {JSX.Element} Not found page
 */
const NotFound = () => {
  return (
    <div className="container">
      <Header title="Page Not Found" />
      
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '3rem 1rem'
        }}
      >
        <h1 
          style={{
            fontSize: '5rem',
            fontWeight: 'bold',
            color: '#a0aec0',
            margin: '0 0 1rem 0'
          }}
        >
          404
        </h1>
        
        <p 
          style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            color: '#4a5568'
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="lg">
            Return Home
          </Button>
        </Link>
      </div>
      
      <Footer />
    </div>
  )
}

export default NotFound