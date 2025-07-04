import { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
                {children}
            </main>
            <footer className="py-6 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12">
                <div className="w-full flex justify-center my-4">
                    <img src="/logo_gold.png" className="w-40" />
                </div>
                <div className="container mx-auto px-4 text-center text-sm text-slate-600 dark:text-slate-400">
                    <p>*IAA IDG is a private company and is not affiliated with United Nations or any other quasi government organisation</p>
                </div>
                {/* Contact Footer */}
                <div className="container mx-auto px-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-center items-center gap-8 text-sm text-slate-600 dark:text-slate-400">
                        <span>📧 info@iaaidg.com</span>
                        <span>📞 +1 (555) 123-4567</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
