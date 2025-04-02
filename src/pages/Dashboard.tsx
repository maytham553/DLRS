import { Box, Heading, Text, Grid, Button, Flex } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
    const { user } = useAuth()

    return (
        <Layout>
            <Box
                bg="white"
                rounded="xl"
                shadow="lg"
                overflow="hidden"
                mx="auto"
                p={{ base: 6, md: 8 }}
            >
                <Flex direction="column" gap={8}>
                    {/* Header section */}
                    <Box mb={6}>
                        <Heading
                            as="h1"
                            fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                            bgGradient="linear(to-r, brand.500, accent.500)"
                            bgClip="text"
                            mb={4}
                        >
                            Agent Dashboard
                        </Heading>
                        <Text color="gray.600">
                            Welcome {user?.email}! Manage your Digital License Registration System from here.
                        </Text>
                    </Box>

                    {/* Stats Overview */}
                    <Grid
                        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                        gap={6}
                    >
                        <Box bg="brand.50" p={6} rounded="lg" borderLeft="4px solid" borderColor="brand.500">
                            <Text fontSize="sm" color="gray.500">Total Applications</Text>
                            <Heading as="h3" size="lg">0</Heading>
                        </Box>

                        <Box bg="accent.50" p={6} rounded="lg" borderLeft="4px solid" borderColor="accent.500">
                            <Text fontSize="sm" color="gray.500">Pending Review</Text>
                            <Heading as="h3" size="lg">0</Heading>
                        </Box>

                        <Box bg="green.50" p={6} rounded="lg" borderLeft="4px solid" borderColor="green.500">
                            <Text fontSize="sm" color="gray.500">Approved</Text>
                            <Heading as="h3" size="lg">0</Heading>
                        </Box>
                    </Grid>

                    {/* Recent Applications */}
                    <Box mt={4}>
                        <Flex justify="space-between" align="center" mb={4}>
                            <Heading as="h2" size="md">Recent Applications</Heading>
                            <Button
                                size="sm"
                                colorScheme="brand"
                                bgGradient="linear(to-r, brand.500, accent.500)"
                                color="white"
                                _hover={{ bgGradient: "linear(to-r, brand.600, accent.600)" }}
                            >
                                View All
                            </Button>
                        </Flex>

                        {/* Empty state for now */}
                        <Box
                            p={10}
                            bg="gray.50"
                            rounded="md"
                            textAlign="center"
                            border="1px dashed"
                            borderColor="gray.200"
                        >
                            <Text color="gray.500" mb={4}>No applications to display yet</Text>
                            <Button
                                colorScheme="brand"
                                size="md"
                            >
                                Create New Application
                            </Button>
                        </Box>
                    </Box>

                    {/* Quick Actions */}
                    <Box mt={4}>
                        <Heading as="h2" size="md" mb={4}>Quick Actions</Heading>
                        <Flex
                            gap={4}
                            flexWrap="wrap"
                        >
                            <Button
                                size="lg"
                                variant="outline"
                                colorScheme="brand"
                            >
                                <Box as="span" fontSize="xl" mr={2}>🆔</Box>
                                Create New IDP
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                colorScheme="accent"
                            >
                                <Box as="span" fontSize="xl" mr={2}>🔍</Box>
                                Search Records
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                colorScheme="gray"
                            >
                                <Box as="span" fontSize="xl" mr={2}>📋</Box>
                                Generate Reports
                            </Button>
                        </Flex>
                    </Box>
                </Flex>
            </Box>
        </Layout>
    )
} 