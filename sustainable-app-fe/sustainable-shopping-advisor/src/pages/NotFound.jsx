import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react'
import Header from '../components/Layout/Header'

/**
 * 404 Not Found page
 * @returns {JSX.Element} Not Found page
 */
const NotFound = () => {
  return (
    <Container maxW="container.md" p={4}>
      <Header title="Page Not Found" />
      
      <VStack spacing={8} py={12} textAlign="center">
        <Heading as="h1" size="4xl" color="gray.400">
          404
        </Heading>
        
        <Text fontSize="xl">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        
        <Link to="/">
          <Button colorScheme="blue" size="lg">
            Return Home
          </Button>
        </Link>
      </VStack>
    </Container>
  )
}

export default NotFound