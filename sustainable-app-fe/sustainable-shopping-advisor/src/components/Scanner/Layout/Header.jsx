import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Flex,
  Heading,
  Button,
  IconButton,
  Image
} from '@chakra-ui/react'
import { FaArrowLeft, FaHome } from 'react-icons/fa'

/**
 * Header component with navigation
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Header component
 */
const Header = ({ title }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <Flex 
      as="header" 
      justify="space-between" 
      align="center" 
      py={4} 
      mb={6}
    >
      {!isHomePage ? (
        <IconButton
          aria-label="Go back"
          icon={<FaArrowLeft />}
          variant="ghost"
          onClick={() => navigate(-1)}
        />
      ) : (
        <Box w="40px" /> // Spacer for alignment
      )}

      {isHomePage ? (
        <Flex align="center">
          <Image 
            src="/logo.png" 
            alt="App Logo" 
            boxSize="30px" 
            mr={2}
            fallbackSrc="https://via.placeholder.com/30"
          />
          <Heading as="h1" size="lg">
            {title || 'QR Scanner'}
          </Heading>
        </Flex>
      ) : (
        <Heading as="h1" size="lg">
          {title || 'QR Scanner'}
        </Heading>
      )}

      {!isHomePage ? (
        <IconButton
          aria-label="Go home"
          icon={<FaHome />}
          variant="ghost"
          onClick={() => navigate('/')}
        />
      ) : (
        <Box w="40px" /> // Spacer for alignment
      )}
    </Flex>
  )
}

export default Header