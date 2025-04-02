import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function Home() {
    return (
        <Layout>
            <div>
                <h2>DLRS - Digital License Registration System</h2>
                <span>
                    Welcome to the Digital License Registration System Home
                    page.
                </span>
            </div>

            <Link to={"/idp"}>
                <Button variant={"destructive"}>IDP</Button>
            </Link>
        </Layout>
    );
}
