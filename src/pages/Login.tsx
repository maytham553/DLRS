import { Box, Heading, Text, Input, Button, Flex } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { toaster } from "../components/ui/toaster"

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            alert('Please enter both email and password')
            return
        }

        setIsSubmitting(true)

        try {
            const x = await login(email, password)
            toaster.create({
                description: "Login successful",
                type: "success",
            })
            navigate('/')
        } catch (error: any) {
            // Error handling is done in the AuthContext
            alert(error?.message || 'An error occurred during login')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Layout>
            <Flex
                direction={{ base: "column", md: "row" }}
                overflow="hidden"
                bg="white"
                rounded="xl"
                shadow="lg"
                maxW="1000px"
                mx="auto"
                mt={{ base: 4, md: 8 }}
            >
                {/* Image side */}
                <Box
                    display={{ base: "none", md: "block" }}
                    w={{ md: "50%" }}
                    bgGradient="linear(to-br, brand.500, brand.600)"
                    color="gray.900"
                    p={12}
                    position="relative"
                    overflow="hidden"
                >
                    <Box position="relative" zIndex="2">
                        <Heading size="2xl" mb={6}>Digital License Registration System</Heading>
                        <Text fontSize="lg">
                            Manage and issue International Driving Permits with ease.
                        </Text>
                    </Box>

                    <Box
                        position="absolute"
                        bottom="-20%"
                        right="-10%"
                        h="80%"
                        w="80%"
                        bg="gray.800"
                        opacity="0.1"
                        borderRadius="full"
                    />
                    <Box
                        position="absolute"
                        top="-10%"
                        left="-10%"
                        h="40%"
                        w="40%"
                        bg="gray.800"
                        opacity="0.1"
                        borderRadius="full"
                    />
                </Box>

                {/* Form side */}
                <Box
                    w={{ base: "100%", md: "50%" }}
                    p={{ base: 8, lg: 12 }}
                >
                    <Box mb={8} textAlign="center">
                        <Heading size="lg" mb={2} color="gray.800">Welcome back</Heading>
                        <Text color="gray.600">Sign in to your account</Text>
                    </Box>

                    <form onSubmit={handleLogin}>
                        <Flex direction="column" gap={6}>
                            <Box>
                                <Text mb={2} fontWeight="medium" color="gray.700">Email</Text>
                                <Input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    size="lg"
                                    borderRadius="md"
                                    borderColor="gray.100"
                                    _focus={{ borderColor: "blue.500" }}
                                    bg="gray.50"
                                    _hover={{ bg: "gray.100" }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    color="gray.900"
                                    autoComplete="off"
                                />
                            </Box>

                            <Box>
                                <Text mb={2} fontWeight="medium" color="gray.700">Password</Text>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    size="lg"
                                    borderRadius="md"
                                    borderColor="gray.300"
                                    _focus={{ borderColor: "blue.500" }}
                                    bg="gray.50"
                                    _hover={{ bg: "gray.100" }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    color="gray.900"
                                    autoComplete="off"
                                />
                            </Box>


                            <Button
                                bg="blue.500"
                                color="white"
                                size="lg"
                                _hover={{
                                    bgGradient: "linear(to-r, brand.600, brand.700)",
                                    boxShadow: "0 4px 10px rgba(49, 130, 206, 0.3)"
                                }}
                                borderRadius="md"
                                boxShadow="0 4px 10px rgba(49, 130, 206, 0.2)"
                                _active={{ boxShadow: "none" }}
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </Flex>
                    </form>

                </Box>
            </Flex>
        </Layout>
    )
} 