import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Header component for app pages
 * @param {Object} props - Component props
 * @param {string} props.title - Header title
 * @param {React.ReactNode} props.rightElement - Element to display on the right
 * @returns {JSX.Element} Header component
 */
const Header = ({ title, rightElement }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  
  const handleBack = () => {
    navigate(-1)
  }
  
  return (
    <header className="page-header">
      {!isHomePage && (
        <button 
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            color: '#4a5568'
          }}
        >
          &larr
        </button>
      )}
      
      <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
        {title || 'QR Scanner'}
      </h1>
      
      {rightElement ? (
        rightElement
      ) : (
        <div style={{ width: '24px' }}></div> // Spacer for alignment
      )}
    </header>
  )
}

export default Header