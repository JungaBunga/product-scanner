import React from 'react'

/**
 * Card component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.footer - Card footer content
 * @param {string} props.className - Additional class names
 * @param {Object} props.style - Additional styles
 * @returns {JSX.Element} Card component
 */
const Card = ({ 
  children, 
  title, 
  footer,
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '1rem',
        ...style
      }}
      {...rest}
    >
      {title && (
        <div 
          className="card-header"
          style={{
            padding: '1rem',
            borderBottom: '1px solid #e2e8f0',
            fontWeight: 600
          }}
        >
          {title}
        </div>
      )}
      
      <div 
        className="card-body"
        style={{
          padding: '1rem'
        }}
      >
        {children}
      </div>
      
      {footer && (
        <div 
          className="card-footer"
          style={{
            padding: '1rem',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f7fafc'
          }}
        >
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card