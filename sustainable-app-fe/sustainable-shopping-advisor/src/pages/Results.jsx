import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Spacer,
  useToast,
  useColorModeValue
} from '@chakra-ui/react'
import { FaTrash } from 'react-icons/fa'
import { useScanContext } from '../contexts/ScanContext'
import Header from '../components/Layout/Header'
import ScanResult from '../components/Scanner/ScanResult'

/**
 * Results page component to display scan results
 * @returns {JSX.Element} Results page
 */
const Results = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { scanResult, scanHistory, clearScanResult } = useScanContext()
  const [activeTab, setActiveTab] = useState(0)
  
  // Handle when no scan results
  if (!scanResult && scanHistory.length === 0) {
    return (
      <Container maxW="container.md" p={4}>
        <Header title="Scan Results" />
        
        <Box 
          p={8} 
          borderWidth="1px" 
          borderRadius="md"
          textAlign="center"
        >
          <Text fontSize="xl" mb={6}>No scan results yet</Text>
          <Button 
            colorScheme="blue" 
            onClick={() => navigate('/scan')}
          >
            Start Scanning
          </Button>
        </Box>
      </Container>
    )
  }
  
  return (
    <Container maxW="container.md" p={4}>
      <Header title="Scan Results" />
      
      <Tabs index={activeTab} onChange={setActiveTab} isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Latest Scan</Tab>
          <Tab>History</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel p={0}>
            {scanResult ? (
              <ScanResult data={scanResult} isLatest={true} />
            ) : (
              <Box textAlign="center" p={4}>
                <Text>No recent scan found</Text>
              </Box>
            )}
            
            <Flex mt={4}>
              <Button
                colorScheme="blue"
                onClick={() => navigate('/scan')}
              >
                Scan Again
              </Button>
              <Spacer />
              {scanResult && (
                <Button
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<FaTrash />}
                  onClick={() => {
                    clearScanResult()
                    toast({
                      title: "Result cleared",
                      status: "info",
                      duration: 2000,
                      isClosable: true,
                    })
                  }}
                >
                  Clear Result
                </Button>
              )}
            </Flex>
          </TabPanel>
          
          <TabPanel p={0}>
            {scanHistory.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {scanHistory.map((item, index) => (
                  <ScanResult 
                    key={item.id} 
                    data={item.data} 
                    isLatest={index === 0}
                  />
                ))}
              </VStack>
            ) : (
              <Box textAlign="center" p={4}>
                <Text>No scan history found</Text>
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  )
}

export default Results