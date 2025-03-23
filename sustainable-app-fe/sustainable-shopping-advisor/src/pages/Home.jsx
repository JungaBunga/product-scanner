import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  useColorModeValue,
} from '@chakra-ui/react'
import { FaQrcode, FaHistory } from 'react-icons/fa'
import Header from '../components/Layout/Header'

/**
 * Home page component
 * @returns {JSX.Element} Home page
 */
const Home = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.800')
  const cardBgColor = useColorModeValue('white', 'gray.700')

  return (
    <Box bg={bgColor} minH="100vh" py={4}>
      <Container maxW="container.md">
        <Header title="QR Scanner App" />
        
        <VStack spacing={8} align="center">
          <Image 
            src="/logo.png" 
            alt="App Logo" 
            boxSize="120px"
            fallbackSrc="https://via.placeholder.com/120"
          />
          
          <Text fontSize="xl" textAlign="center" color="gray.500">
            Quickly scan QR codes and barcodes with your device's camera
          </Text>
          
          <Box 
            w="full" 
            bg={cardBgColor} 
            p={8} 
            borderRadius="lg" 
            boxShadow="md"
          >
            <VStack spacing={4} align="stretch">
              <Link to="/scan">
                <Button 
                  leftIcon={<FaQrcode />} 
                  colorScheme="brand" 
                  size="lg" 
                  h="60px"
                  w="full"
                >
                  Start Scanning
                </Button>
              </Link>
              
              <Link to="/results">
                <Button 
                  leftIcon={<FaHistory />} 
                  variant="outline" 
                  size="lg"
                  h="60px" 
                  w="full"
                >
                  View Scan History
                </Button>
              </Link>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default Home