import React from 'react'
import {
  Box,
  Button,
  Flex,
  Text,
  HStack,
  FormControl,
  FormLabel,
  Select,
  Icon,
  useToast
} from '@chakra-ui/react'
import { FaLightbulb, FaCamera } from 'react-icons/fa'
import useScanner from '../../hooks/useScanner'

/**
 * Scanner view component for handling camera and scanning
 * @param {Object} props - Component props
 * @param {Function} props.onDetected - Callback when code is detected
 * @returns {JSX.Element} Scanner component
 */
const ScannerView = ({ onDetected }) => {
  const toast = useToast()
  
  // Initialize scanner hook
  const {
    scannerRef,
    isScanning,
    cameras,
    selectedCamera,
    setSelectedCamera,
    torchOn,
    toggleScanner,
    toggleTorch
  } = useScanner({
    onDetected: (result) => {
      // Stop scanner when code is detected
      if (isScanning) {
        toggleScanner()
      }
      
      // Call the provided callback
      if (onDetected) {
        onDetected(result)
      }
    }
  })

  // Handle torch toggle with toast feedback
  const handleTorchToggle = () => {
    try {
      toggleTorch()
    } catch (error) {
      toast({
        title: "Torch Error",
        description: "Could not toggle flashlight. Your device may not support this feature.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Box 
        className="scanner-container"
        ref={scannerRef}
        position="relative"
        borderRadius="md"
        overflow="hidden"
        boxShadow="md"
        h="350px"
        bg="gray.100"
      >
        {!isScanning && (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            h="100%"
            p={4}
          >
            <Icon as={FaCamera} boxSize={12} color="gray.400" mb={4} />
            <Text fontSize="lg" textAlign="center" color="gray.500">
              Click "Start Camera" to begin scanning
            </Text>
          </Flex>
        )}
      </Box>
      
      <HStack spacing={4} mt={4}>
        <Button 
          colorScheme={isScanning ? "red" : "green"} 
          w="full"
          onClick={toggleScanner}
        >
          {isScanning ? "Stop Camera" : "Start Camera"}
        </Button>
        
        {isScanning && (
          <Button 
            leftIcon={<FaLightbulb />} 
            colorScheme={torchOn ? "yellow" : "gray"}
            onClick={handleTorchToggle}
          >
            {torchOn ? "Torch On" : "Torch Off"}
          </Button>
        )}
      </HStack>
      
      {cameras.length > 1 && (
        <FormControl mt={4}>
          <FormLabel>Camera</FormLabel>
          <Select 
            value={selectedCamera || ''} 
            onChange={(e) => setSelectedCamera(e.target.value)}
          >
            {cameras.map((camera, index) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                Camera {index + 1} {camera.label ? `(${camera.label})` : ''}
              </option>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  )
}

export default ScannerView