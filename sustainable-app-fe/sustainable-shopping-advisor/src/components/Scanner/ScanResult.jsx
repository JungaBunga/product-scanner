import React from 'react'
import {
  Box,
  Text,
  HStack,
  Badge,
  IconButton,
  useToast,
  useClipboard,
  VStack
} from '@chakra-ui/react'
import { FaCopy, FaExternalLinkAlt } from 'react-icons/fa'
import { formatTimestamp, isUrl } from '../../services/scannerService'

/**
 * Component to display a single scan result
 * @param {Object} props - Component props
 * @param {Object} props.data - Scan result data
 * @param {boolean} props.isLatest - Whether this is the latest scan
 * @param {string} props.bgColor - Background color override
 * @returns {JSX.Element} Scan result component
 */
const ScanResult = ({ data, isLatest = false, bgColor }) => {
  const toast = useToast()
  const { hasCopied, onCopy } = useClipboard(data.code)
  
  // Check if the scanned content is a URL
  const isUrlContent = isUrl(data.code)
  
  // Handle copy to clipboard with toast feedback
  const handleCopy = () => {
    onCopy()
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    })
  }
  
  return (
    <Box 
      p={4} 
      borderWidth="1px" 
      borderRadius="md" 
      borderColor={isLatest ? "blue.200" : "gray.200"}
      bg={bgColor || (isLatest ? "blue.50" : "white")}
      mb={3}
      position="relative"
    >
      {isLatest && (
        <Badge 
          position="absolute" 
          top="-10px" 
          right="10px" 
          colorScheme="blue"
          fontSize="xs"
        >
          Latest Scan
        </Badge>
      )}
      
      <VStack align="start" spacing={2}>
        <Text fontWeight="bold" fontSize="lg" wordBreak="break-all">
          {data.code}
        </Text>
        
        <HStack spacing={2}>
          <Badge colorScheme="purple">{data.format}</Badge>
          {data.timestamp && (
            <Text fontSize="sm" color="gray.500">
              {formatTimestamp(data.timestamp)}
            </Text>
          )}
        </HStack>
        
        <HStack spacing={2} mt={2}>
          <IconButton
            aria-label="Copy to clipboard"
            icon={<FaCopy />}
            size="sm"
            onClick={handleCopy}
          />
          
          {isUrlContent && (
            <IconButton
              aria-label="Open URL"
              icon={<FaExternalLinkAlt />}
              size="sm"
              onClick={() => window.open(data.code, '_blank')}
            />
          )}
        </HStack>
      </VStack>
    </Box>
  )
}

export default ScanResult