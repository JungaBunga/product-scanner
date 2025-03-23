import React from 'react'
import {
  Box,
  Container,
  Text,
  Flex,
  Link,
  useColorModeValue
} from '@chakra-ui/react'

/**
 * Footer component
 * @returns {JSX.Element} Footer component
 */
const Footer = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  
  return (
    <Box as="footer" bg={bgColor} py={4} mt={8}>
      <Container maxW="container.md">
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          justify="space-between" 
          align="center"
        >
          <Text fontSize="sm" color={textColor}>
            &copy {new Date().getFullYear()} QR Scanner App. All rights reserved.
          </Text>
          
          <Flex mt={{ base: 2, md: 0 }}>
            <Link href="#" mx={2} fontSize="sm" color={textColor}>
              Privacy Policy
            </Link>
            <Link href="#" mx={2} fontSize="sm" color={textColor}>
              Terms of Service
            </Link>
            <Link href="#" mx={2} fontSize="sm" color={textColor}>
              Contact
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}

export default Footer