import { Box, Flex, Text, HStack, Button, useDisclosure } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Simple hamburger menu icon component
const HamburgerIcon = () => (
    <Box>
        <Box as="span" display="block" w="20px" h="2px" bg="currentColor" mb="4px" />
        <Box as="span" display="block" w="20px" h="2px" bg="currentColor" mb="4px" />
        <Box as="span" display="block" w="20px" h="2px" bg="currentColor" />
    </Box>
)

export default function Navigation() {
    const { open, onOpen, onClose } = useDisclosure()
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false)

    // Handle scroll effect for the navigation bar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Determine if a link is active
    const isActive = (path: string) => location.pathname === path

    // Navigation links
    const links = [
        { name: 'Home', path: '/' },
        // { name: 'Dashboard', path: '/dashboard' },
        // { name: 'Login', path: '/login' }
    ]

    // Styled navigation link
    const NavLink = ({ name, path }: { name: string, path: string }) => (
        <Link to={path}>
            <Box
                px={4}
                py={2}
                rounded="full"
                fontWeight="medium"
                position="relative"
                color={isActive(path) ? "brand.500" : "gray.600"}
                bg={isActive(path) ? "brand.50" : "transparent"}
                _hover={{
                    bg: "gray.50",
                    color: "brand.500",
                }}
                transition="all 0.2s"
            >
                {name}
            </Box>
        </Link>
    )

    return (
        <Box
            as="nav"
            position="sticky"
            top="0"
            zIndex="1000"
            bg={scrolled ? "rgba(255, 255, 255, 0.95)" : "transparent"}
            boxShadow={scrolled ? "0 2px 10px rgba(0,0,0,0.05)" : "none"}
            transition="all 0.3s ease"
            backdropFilter={scrolled ? "blur(10px)" : "none"}
        >
            <Flex
                maxW="container.xl"
                mx="auto"
                px={{ base: 4, md: 6 }}
                py={4}
                align="center"
                justify="space-between"
            >
                {/* Logo */}
                <Link to="/">
                    <Flex align="center">
                        <Box
                            w="40px"
                            h="40px"
                            bg="brand.500"
                            boxShadow="0 4px 10px rgba(49, 130, 206, 0.3)"
                            rounded="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            color="white"
                            fontWeight="bold"
                            fontSize="lg"
                            mr={3}
                        >
                            DL
                        </Box>
                        <Text
                            fontWeight="bold"
                            fontSize={{ base: "xl", md: "2xl" }}
                            bgGradient="linear(to-r, brand.500, accent.500)"
                            bgClip="text"
                            letterSpacing="tight"
                        >
                            DLRS
                        </Text>
                    </Flex>
                </Link>

                {/* Desktop Navigation */}
                <HStack gap={3} display={{ base: "none", md: "flex" }}>
                    {links.map((link) => (
                        <NavLink key={link.path} name={link.name} path={link.path} />
                    ))}
                </HStack>

                {/* Mobile Navigation Button */}
                <Button
                    aria-label="Menu"
                    variant="ghost"
                    display={{ base: "flex", md: "none" }}
                    onClick={onOpen}
                    p={2}
                    rounded="full"
                    color="gray.600"
                >
                    <HamburgerIcon />
                </Button>
            </Flex>

            {/* Mobile Navigation Menu */}
            {open && (
                <Box
                    position="fixed"
                    top="0"
                    right="0"
                    w="270px"
                    h="100vh"
                    bg="white"
                    boxShadow="0 0 20px rgba(0,0,0,0.1)"
                    zIndex="1100"
                    p={6}
                    borderLeftRadius="2xl"
                >
                    <Flex justify="space-between" mb={8} align="center">
                        <Text fontWeight="bold" fontSize="xl" color="brand.500">Menu</Text>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            size="sm"
                            rounded="full"
                            p={2}
                            minW="auto"
                            height="auto"
                        >
                            <Box as="span" display="flex" alignItems="center" justifyContent="center" w="24px" h="24px">×</Box>
                        </Button>
                    </Flex>

                    <Flex direction="column" gap={3}>
                        {links.map((link) => (
                            <Link key={link.path} to={link.path} onClick={onClose}>
                                <Flex
                                    px={4}
                                    py={3}
                                    rounded="lg"
                                    align="center"
                                    fontWeight="medium"
                                    bg={isActive(link.path) ? "brand.50" : "transparent"}
                                    color={isActive(link.path) ? "brand.500" : "gray.700"}
                                    _hover={{
                                        bg: "gray.50",
                                        color: "brand.500",
                                    }}
                                >
                                    {link.name}
                                </Flex>
                            </Link>
                        ))}
                    </Flex>
                </Box>
            )}
        </Box>
    )
} 