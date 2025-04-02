import { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div>
            <Navigation />
            <div>
                {children}
            </div>
        </div>
    );
}
