import React from 'react'
import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react'

/**
 * Custom card component
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} props.headerProps - Props for the header
 * @param {Object} props.contentProps - Props for the content
 * @param {Object} props.footerProps - Props for the footer
 * @returns {JSX.Element} Card component
 */
const Card = ({ 
  title, 
  children, 
  headerProps = {}, 
  contentProps = {}, 
  footerProps = {},
  footer,
  ...rest 
}) => {
  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      bg={bgColor}
      borderColor={borderColor}
      {...rest}
    >
      {title && (
        <Box p={4} borderBottomWidth="1px" {...headerProps}>
          <Heading size="md">{title}</Heading>
        </Box>
      )}
      
      <Box p={4} {...contentProps}>
        {children}
      </Box>
      
      {footer && (
        <Box 
          p={4} 
          borderTopWidth="1px" 
          borderColor={borderColor}
          {...footerProps}
        >
          {footer}
        </Box>
      )}
    </Box>
  )
}

export default Card