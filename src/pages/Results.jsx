import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScanContext } from '../contexts/ScanContext';
import { fetchProductByBarcode, generateSustainabilityAnalysis } from '../services/scannerService';
import Header from '../components/Scanner/Layout/Header';
import Footer from '../components/Scanner/Layout/Footer';

/**
 * Results page displaying product information and sustainability analysis
 * @returns {JSX.Element} Results page component
 */
const Results = () => {
  const navigate = useNavigate();
  const { 
    scanResult, 
    productData, setProductData, 
    sustainabilityData, setSustainabilityData 
  } = useScanContext();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  // Fetch product data on mount if scanResult exists
  useEffect(() => {
    const fetchData = async () => {
      if (!scanResult || !scanResult.barcode) {
        setError('No scan result found. Please scan a product first.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching data for barcode:', scanResult.barcode);
        
        // Fetch product data
        const result = await fetchProductByBarcode(scanResult.barcode);
        console.log('Product data received:', result);
        
        if (result.success && result.product) {
          console.log('Setting product data:', result.product);
          setProductData(result.product);
          
          // Generate sustainability analysis
          const analysis = generateSustainabilityAnalysis(result.product);
          console.log('Sustainability analysis:', analysis);
          setSustainabilityData(analysis);
          setError(null);
        } else {
          console.error('Product not found:', result.error);
          setError(result.error || 'Product not found');
          setProductData(null);
          setSustainabilityData(null);
        }
      } catch (err) {
        console.error('Error in fetching product data:', err);
        setError(`Failed to fetch product information: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scanResult, setProductData, setSustainabilityData]);

  // Handle scan again button
  const handleScanAgain = () => {
    navigate('/scan'); // Make sure this matches your route path
  };

  // Handle go home button
  const handleGoHome = () => {
    navigate('/');
  };

  // Toggle show more product details
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="results-page container">
      <Header title="Product Results" />

      <div className="results-content" style={{ padding: '0 1rem' }}>
        {loading ? (
          <div className="loading" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div 
              style={{ 
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3498db',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 2s linear infinite',
                margin: '0 auto',
                marginBottom: '1rem'
              }}
            />
            <p>Loading product information...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg) }
                100% { transform: rotate(360deg) }
              }
            `}</style>
          </div>
        ) : error ? (
          <div className="error-container" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
            <h3 style={{ marginBottom: '1rem' }}>Product Not Found</h3>
            <p style={{ marginBottom: '2rem', color: '#718096' }}>{error}</p>
            <button 
              onClick={handleScanAgain}
              style={{
                backgroundColor: '#4299e1',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                marginRight: '0.5rem'
              }}
            >
              Scan Again
            </button>
          </div>
        ) : (
          <>
            {productData && (
              <div className="product-info" style={{ marginBottom: '2rem' }}>
                <div className="product-header" style={{ display: 'flex', marginBottom: '1rem' }}>
                  <div className="product-image" style={{ marginRight: '1rem', flexShrink: 0 }}>
                    {productData.image ? (
                      <img 
                        src={productData.image} 
                        alt={productData.name} 
                        style={{ 
                          width: '100px', 
                          height: '100px',
                          objectFit: 'contain',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.25rem',
                          backgroundColor: 'white'
                        }}
                      />
                    ) : (
                      <div 
                        style={{ 
                          width: '100px', 
                          height: '100px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f7fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.25rem',
                          color: '#a0aec0'
                        }}
                      >
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="product-details" style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{productData.name}</h2>
                    <p style={{ color: '#718096', marginBottom: '0.25rem' }}>
                      <strong>Brand:</strong> {productData.brand}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#a0aec0' }}>
                      <strong>Barcode:</strong> {scanResult?.barcode}
                    </p>
                    {productData.categories && (
                      <p style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
                        <strong>Categories:</strong> {productData.categories}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="product-details-section">
                  <h3 style={{ 
                    fontSize: '1rem', 
                    marginBottom: '0.5rem',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    Ingredients
                  </h3>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#4a5568', 
                    marginBottom: '1rem',
                    lineHeight: '1.5'
                  }}>
                    {productData.ingredients || 'No ingredients information available'}
                  </p>
                </div>
                
                {/* Expandable additional details */}
                <div style={{ marginBottom: '1rem' }}>
                  <button
                    onClick={toggleShowMore}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#4299e1',
                      border: 'none',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      padding: '0.25rem 0',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ marginRight: '0.25rem' }}>
                      {showMore ? '▼' : '►'}
                    </span>
                    {showMore ? 'Hide details' : 'Show more product details'}
                  </button>
                  
                  {showMore && (
                    <div 
                      style={{ 
                        backgroundColor: '#f7fafc',
                        borderRadius: '0.25rem',
                        padding: '1rem',
                        marginTop: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      {productData.nutritionGrade && (
                        <p style={{ marginBottom: '0.5rem' }}>
                          <strong>Nutrition Grade:</strong> {productData.nutritionGrade.toUpperCase()}
                        </p>
                      )}
                      
                      {productData.packaging && (
                        <p style={{ marginBottom: '0.5rem' }}>
                          <strong>Packaging:</strong> {productData.packaging}
                        </p>
                      )}
                      
                      {productData.origin_country && (
                        <p style={{ marginBottom: '0.5rem' }}>
                          <strong>Country of Origin:</strong> {productData.origin_country}
                        </p>
                      )}
                      
                      <p style={{ marginBottom: '0.5rem' }}>
                        <strong>Data Source:</strong> {productData.dataSource || 'Open Food Facts'}
                      </p>
                      
                      <p>
                        <a 
                          href={`https://world.openfoodfacts.org/product/${scanResult.barcode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#4299e1',
                            textDecoration: 'none'
                          }}
                        >
                          View full details in Open Food Facts →
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {sustainabilityData && (
              <div 
                className="sustainability-info"
                style={{ 
                  backgroundColor: '#f7fafc',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '2rem',
                  border: '1px solid #e2e8f0'
                }}
              >
                <h3 style={{ 
                  marginBottom: '1rem',
                  fontSize: '1.25rem',
                  color: '#2d3748',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '0.5rem'
                }}>
                  Sustainability Assessment
                </h3>
                
                <div 
                  className="score-container"
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}
                >
                  <div 
                    className="score-circle"
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      backgroundColor: getScoreColor(sustainabilityData.score),
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      marginRight: '1.5rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {sustainabilityData.score}
                  </div>
                  <div className="score-details">
                    <p style={{ 
                      fontWeight: 'bold', 
                      marginBottom: '0.25rem',
                      fontSize: '1.25rem',
                      color: getScoreColor(sustainabilityData.score)
                    }}>
                      {sustainabilityData.rating}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#4a5568' }}>
                      Sustainability score out of 10
                    </p>
                  </div>
                </div>
                
                <div 
                  style={{ 
                    backgroundColor: '#fff', 
                    padding: '1rem', 
                    borderRadius: '0.25rem',
                    marginBottom: '1rem',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <p style={{ 
                    marginBottom: '1rem',
                    lineHeight: '1.5',
                    color: '#4a5568'
                  }}>
                    {sustainabilityData.analysis}
                  </p>
                </div>
                
                <div className="factors">
                  <h4 style={{ 
                    fontSize: '1rem', 
                    marginBottom: '0.75rem',
                    color: '#2d3748'
                  }}>
                    Sustainability Factors
                  </h4>
                  <ul style={{ 
                    paddingLeft: '1.5rem', 
                    fontSize: '0.9rem',
                    color: '#4a5568'
                  }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      {sustainabilityData.factors?.organic 
                        ? '✅ Organic certified' 
                        : '❌ Not organic certified'}
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      {sustainabilityData.factors?.fairTrade 
                        ? '✅ Fair trade certified' 
                        : '❌ No fair trade certification'}
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      {sustainabilityData.factors?.localOrigin 
                        ? '✅ Locally produced' 
                        : '❌ Not locally produced'}
                    </li>
                    {sustainabilityData.factors?.recyclablePackaging !== undefined && (
                      <li style={{ marginBottom: '0.5rem' }}>
                        {sustainabilityData.factors.recyclablePackaging 
                          ? '✅ Recyclable packaging' 
                          : '❌ Non-recyclable packaging'}
                      </li>
                    )}
                    {sustainabilityData.factors?.singleUsePackaging !== undefined && (
                      <li>
                        {!sustainabilityData.factors.singleUsePackaging 
                          ? '✅ Avoids single-use plastic' 
                          : '❌ Contains single-use plastic'}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
            
            <div 
              className="action-buttons"
              style={{ 
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '2rem'
              }}
            >
              <button 
                onClick={handleScanAgain}
                style={{
                  backgroundColor: '#4299e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>📷</span>
                Scan Another Product
              </button>
              <button 
                onClick={handleGoHome}
                style={{
                  backgroundColor: '#e2e8f0',
                  color: '#4a5568',
                  border: 'none',
                  borderRadius: '0.25rem',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Home
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

/**
 * Get color based on sustainability score
 * @param {number} score - Score from 0-10
 * @returns {string} Color code
 */
const getScoreColor = (score) => {
  const numScore = parseFloat(score);
  
  if (numScore >= 8) return '#48bb78'; // Green
  if (numScore >= 6) return '#4299e1'; // Blue
  if (numScore >= 4) return '#ed8936'; // Orange
  return '#e53e3e'; // Red
};

export default Results;