import React from 'react'
import { FaCopy, FaExternalLinkAlt, FaEnvelope, FaPhone } from 'react-icons/fa'
import useClipboard from '../../hooks/useClipboard'
import { formatTimestamp, formatQrFormat } from '../../utils/formatters'
import { isValidUrl, isValidEmail, isValidPhone } from '../../utils/validators'
import Card from '../UI/Card'
import Button from '../UI/Button'

/**
 * Scan result component
 * @param {Object} props - Component props
 * @param {Object} props.result - Scan result data
 * @param {boolean} props.isLatest - Whether this is the latest scan
 * @returns {JSX.Element} Scan result component
 */
const ScanResult = ({ result, isLatest = false }) => {
  const { code, format, timestamp } = result || {}
  
  // Check content type
  const isUrl = isValidUrl(code)
  const isEmail = isValidEmail(code)
  const isPhone = isValidPhone(code)
  
  // Setup clipboard 
  const { hasCopied, copyToClipboard } = useClipboard(code)
  
  if (!result || !code) {
    return null
  }
  
  return (
    <Card 
      className={isLatest ? 'latest-scan' : ''}
      style={{
        borderColor: isLatest ? '#bee3f8' : undefined,
        backgroundColor: isLatest ? '#ebf8ff' : undefined,
        position: 'relative'
      }}
    >
      {isLatest && (
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            right: '10px',
            backgroundColor: '#3182ce',
            color: 'white',
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
          }}
        >
          Latest Scan
        </div>
      )}
      
      <div 
        style={{
          fontWeight: 'bold',
          fontSize: '1rem',
          marginBottom: '0.5rem',
          wordBreak: 'break-all'
        }}
      >
        {code}
      </div>
      
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.5rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <span
          style={{
            backgroundColor: '#805ad5',
            color: 'white',
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
          }}
        >
          {formatQrFormat(format) || 'QR Code'}
        </span>
        
        {timestamp && (
          <span style={{ fontSize: '0.875rem', color: '#718096' }}>
            {formatTimestamp(timestamp)}
          </span>
        )}
      </div>
      
      <div 
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '0.75rem',
          flexWrap: 'wrap'
        }}
      >
        <Button 
          onClick={copyToClipboard} 
          variant="outline"
          size="sm"
          icon={<FaCopy />}
        >
          {hasCopied ? 'Copied!' : 'Copy'}
        </Button>
        
        {isUrl && (
          <Button 
            onClick={() => window.open(code, '_blank')} 
            variant="outline"
            size="sm"
            icon={<FaExternalLinkAlt />}
          >
            Open Link
          </Button>
        )}
        
        {isEmail && (
          <Button 
            onClick={() => window.open(`mailto:${code}`, '_blank')} 
            variant="outline"
            size="sm"
            icon={<FaEnvelope />}
          >
            Send Email
          </Button>
        )}
        
        {isPhone && (
          <Button 
            onClick={() => window.open(`tel:${code}`, '_blank')} 
            variant="outline"
            size="sm"
            icon={<FaPhone />}
          >
            Call
          </Button>
        )}
      </div>
    </Card>
  )
}

export default ScanResult