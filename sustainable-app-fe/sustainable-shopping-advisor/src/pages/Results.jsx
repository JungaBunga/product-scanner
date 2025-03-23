import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import { useScanContext } from '../contexts/ScanContext'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import ScanResult from '../components/Scanner/ScanResult'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'

/**
 * Results page component
 * @returns {JSX.Element} Results page
 */
const Results = () => {
  const navigate = useNavigate()
  const { scanResult, scanHistory, clearScanResult, clearScanHistory } = useScanContext()
  const [activeTab, setActiveTab] = useState(0)
  
  // Handle when no scan results
  if (!scanResult && scanHistory.length === 0) {
    return (
      <div className="container">
        <Header title="Scan Results" />
        
        <Card>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <p style={{ marginBottom: '1rem' }}>No scan results yet</p>
            <Button 
              onClick={() => navigate('/scan')} 
              variant="primary"
            >
              Start Scanning
            </Button>
          </div>
        </Card>
        
        <Footer />
      </div>
    )
  }
  
  return (
    <div className="container">
      <Header title="Scan Results" />
      
      <div 
        style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '1rem'
        }}
      >
        <div 
          style={{
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            borderBottom: activeTab === 0 ? '2px solid #4299e1' : '2px solid transparent',
            color: activeTab === 0 ? '#4299e1' : 'inherit'
          }}
          onClick={() => setActiveTab(0)}
        >
          Latest Scan
        </div>
        <div 
          style={{
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            borderBottom: activeTab === 1 ? '2px solid #4299e1' : '2px solid transparent',
            color: activeTab === 1 ? '#4299e1' : 'inherit'
          }}
          onClick={() => setActiveTab(1)}
        >
          History
        </div>
      </div>
      
      <div 
        style={{
          display: activeTab === 0 ? 'block' : 'none'
        }}
      >
        {scanResult ? (
          <>
            <ScanResult result={scanResult} isLatest={true} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <Button
                onClick={() => navigate('/scan')}
                variant="primary"
              >
                Scan Again
              </Button>
              
              <Button
                onClick={clearScanResult}
                variant="outline"
                icon={<FaTrash />}
              >
                Clear Result
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <div style={{ textAlign: 'center' }}>
              <p>No recent scan found</p>
            </div>
          </Card>
        )}
      </div>
      
      <div 
        style={{
          display: activeTab === 1 ? 'block' : 'none'
        }}
      >
        {scanHistory.length > 0 ? (
          <>
            {scanHistory.map((item, index) => (
              <ScanResult 
                key={item.id || index} 
                result={item.data} 
                isLatest={index === 0}
              />
            ))}
            
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Button
                onClick={clearScanHistory}
                variant="outline"
                icon={<FaTrash />}
              >
                Clear History
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <div style={{ textAlign: 'center' }}>
              <p>No scan history found</p>
            </div>
          </Card>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

export default Results