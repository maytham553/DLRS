import { Box, Button, Heading, Text } from "@chakra-ui/react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <Layout>
            <Box>
                <Heading>DLRS - Digital License Registration System</Heading>
                <Text>
                    Welcome to the Digital License Registration System Home
                    page.
                </Text>
            </Box>

            <Link to={"/idp"}>
                <Button>IDP</Button>
            </Link>
        </Layout>
    );
}
