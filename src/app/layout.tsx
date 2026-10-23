import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jakarta",
});

export const metadata = {
    title: "GHRCOE Studion - Student Management system",
    description: "Professional all-in-one student management system for GHRCOE.",
};


import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="dark">
            <body className={`${jakarta.variable} font-sans antialiased min-h-screen bg-[#070b14]`}>
                <AuthProvider>
                    {children}
                </AuthProvider>
                <Toaster position="top-right" />
            </body>
        </html>
    );
}
