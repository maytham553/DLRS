import { Box, Container } from '@chakra-ui/react'
import { ReactNode } from 'react'
import Navigation from './Navigation'

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <Box
            minHeight="100vh"
            backgroundImage="linear-gradient(to bottom, rgba(247, 250, 252, 0.8) 0%, rgba(255, 255, 255, 1) 100%)"
        >
            <Navigation />
            <Container
                maxW="container.xl"
                px={{ base: 4, md: 6 }}
                py={{ base: 6, md: 10 }}
            >
                {children}
            </Container>
        </Box>
    )
} 