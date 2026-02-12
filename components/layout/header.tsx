"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeaderProps {
    variant?: "default" | "dashboard";
    title?: string;
    description?: string;
    showBackButton?: boolean;
    backHref?: string;
    className?: string;
}

export function Header({
    variant = "default",
    title,
    description,
    showBackButton = false,
    backHref = "/",
    className,
}: HeaderProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlHeader = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down & past threshold
                setIsVisible(false);
            } else {
                // Scrolling up or at top
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", controlHeader);
        return () => window.removeEventListener("scroll", controlHeader);
    }, [lastScrollY]);

    // VARIANT: DASHBOARD (Header Aplikasi)
    if (variant === "dashboard") {
        return (
            <header
                className={cn(
                    "sticky top-0 z-50 w-full shadow-lg transition-transform duration-300",
                    "bg-linear-to-r from-primary via-primary to-primary/95",
                    "border-b border-white/10",
                    isVisible ? "translate-y-0" : "-translate-y-full",
                    className,
                )}
            >
                {/* Decoration Pattern (Optional Overlay) */}
                <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-10 pointer-events-none" />

                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex h-16 md:h-20 items-center justify-between gap-4">
                        {/* LEFT: Navigation & Title */}
                        <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0">
                            {showBackButton && (
                                <Link
                                    href={backHref}
                                    className="group relative flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-105 active:scale-95 border border-white/10 backdrop-blur-sm"
                                    title="Kembali"
                                >
                                    <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                                </Link>
                            )}

                            <div className="flex flex-col justify-center min-w-0">
                                <h1 className="text-base md:text-xl font-bold text-white leading-tight truncate tracking-tight">
                                    {title || "Dashboard"}
                                </h1>
                                {description && (
                                    <p className="text-white/80 text-xs md:text-sm font-medium leading-tight truncate hidden sm:block">
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Branding Logos */}
                        <div className="flex items-center gap-3 shrink-0">
                            {/* Logo Container with Glass Effect */}
                            <div className="flex items-center gap-3 md:gap-4 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-black/10 backdrop-blur-sm border border-white/5">
                                <Image
                                    src="/assets/Alfamart-Emblem.png"
                                    alt="Alfamart"
                                    width={120}
                                    height={120}
                                    className="h-6 w-auto md:h-8 object-contain drop-shadow-md"
                                    priority
                                />

                                <div className="h-4 md:h-5 w-px bg-white/20 rounded-full" />

                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/assets/Building-Logo.png"
                                        alt="SPARTA Logo"
                                        width={60}
                                        height={60}
                                        className="h-6 w-auto md:h-8 object-contain drop-shadow-md"
                                        priority
                                    />
                                    <div className="flex flex-col items-end leading-none text-white">
                                        <span className="font-bold text-sm tracking-wider">
                                            SPARTA
                                        </span>
                                        <span className="text-[10px] opacity-80 font-light">
                                            Maintenance
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    // VARIANT: DEFAULT (Landing / Login / Hero)
    return (
        <header
            className={cn(
                "relative w-full overflow-hidden shadow-xl transition-transform duration-300",
                "bg-linear-to-br from-primary via-primary to-[#9e1b29]",
                isVisible ? "translate-y-0" : "-translate-y-full",
                className,
            )}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 py-6 md:py-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
                    {/* Main Brand */}
                    <div className="bg-white p-3 md:p-4 rounded-2xl shadow-lg animate-in fade-in zoom-in duration-500">
                        <Image
                            src="/assets/logoalfamart.png"
                            alt="Alfamart Logo"
                            width={300}
                            height={100}
                            quality={100}
                            className="h-8 md:h-12 w-auto object-contain"
                            priority
                        />
                    </div>

                    {/* Divider (Desktop Only) */}
                    <div className="hidden md:block h-12 w-0.5 bg-white/20 rounded-full" />

                    {/* System Name */}
                    <div className="flex items-center gap-3 text-white">
                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20">
                            <Building2 className="h-6 w-6 md:h-8 md:w-8" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-xl md:text-3xl font-bold tracking-tight drop-shadow-md">
                                SPARTA
                            </h2>
                            <p className="text-xs md:text-sm font-medium text-white/90 tracking-wide uppercase">
                                System Maintenance Store
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10" />
        </header>
    );
}
