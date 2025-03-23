import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useScanContext } from '../contexts/ScanContext'
import Header from '../components/Layout/Header'
import ScannerView from '../components/Scanner/ScannerView'
import { processScanResult } from '../services/scannerService'

/**
 * Scanner page component
 * @returns {JSX.Element} Scanner page
 */
const Scanner = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { setScanResult, addToHistory } = useScanContext()

  // Handle successful scan
  const handleScan = (result) => {
    if (!result || !result.code) return

    // Process the scan result
    const processedResult = processScanResult(result)
    
    // Update context
    setScanResult(processedResult)
    addToHistory(processedResult)
    
    // Show success toast
    toast({
      title: "Code detected!",
      description: `${result.format}: ${result.code.substring(0, 20)}${result.code.length > 20 ? '...' : ''}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
    
    // Navigate to results
    navigate('/results')
  }
  
  return (
    <Container maxW="container.md" p={4}>
      <Header title="Scan QR Code" />
      
      <ScannerView onDetected={handleScan} />
      
      <Text fontSize="sm" color="gray.500" textAlign="center" mt={8}>
        Position the QR code within the scanner area.
        Make sure it's well-lit and your camera is focused.
      </Text>
    </Container>
  )
}

export default Scanner