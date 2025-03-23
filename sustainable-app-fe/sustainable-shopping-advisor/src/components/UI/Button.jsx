import React from 'react'
import { Button as ChakraButton } from '@chakra-ui/react'

/**
 * Custom button component
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (solid, outline, ghost, link)
 * @param {string} props.size - Button size (xs, sm, md, lg)
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.isFullWidth - Whether button should take full width
 * @param {string} props.colorScheme - Button color scheme
 * @returns {JSX.Element} Button component
 */
const Button = ({ 
  variant = 'solid', 
  size = 'md', 
  children, 
  onClick, 
  isFullWidth = false, 
  colorScheme = 'brand',
  ...rest 
}) => {
  return (
    <ChakraButton
      variant={variant}
      size={size}
      onClick={onClick}
      width={isFullWidth ? 'full' : 'auto'}
      colorScheme={colorScheme}
      borderRadius="md"
      fontWeight="medium"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'md',
      }}
      _active={{
        transform: 'translateY(0)',
        boxShadow: 'sm',
      }}
      {...rest}
    >
      {children}
    </ChakraButton>
  )
}

export default Button