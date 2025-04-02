import { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1 pt-16">
                {children}
            </main>
        </div>
    );
}
