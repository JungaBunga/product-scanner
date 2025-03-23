import React from 'react'

/**
 * Button component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant (primary, secondary, outline, danger)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {Object} props.style - Additional styles
 * @returns {JSX.Element} Button component
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  fullWidth = false,
  icon,
  type = 'button',
  disabled = false,
  style = {},
  ...rest
}) => {
  // Base styles
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.25rem',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s',
    border: 'none',
    width: fullWidth ? '100%' : undefined,
    ...style
  }
  
  // Size styles
  const sizeStyles = {
    sm: { fontSize: '0.875rem', padding: '0.375rem 0.75rem' },
    md: { fontSize: '1rem', padding: '0.5rem 1rem' },
    lg: { fontSize: '1.125rem', padding: '0.625rem 1.25rem' }
  }
  
  // Variant styles
  const variantStyles = {
    primary: { 
      backgroundColor: '#4299e1', 
      color: 'white',
      border: 'none'
    },
    secondary: { 
      backgroundColor: '#a0aec0', 
      color: 'white',
      border: 'none'
    },
    outline: { 
      backgroundColor: 'transparent',
      color: '#4299e1',
      border: '1px solid #4299e1'
    },
    danger: { 
      backgroundColor: '#e53e3e',
      color: 'white',
      border: 'none'
    }
  }
  
  // Combine styles
  const combinedStyle = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant]
  }
  
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      style={combinedStyle}
      disabled={disabled}
      {...rest}
    >
      {icon && (
        <span style={{ marginRight: children ? '0.5rem' : 0 }}>
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}

export default Button