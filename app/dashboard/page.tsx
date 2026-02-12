"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    FileText,
    ClipboardCheck,
    ListChecks,
    FolderOpen,
    BarChart3,
    Settings,
    Plus,
    CheckCircle2,
    Clock,
    AlertCircle,
    LogOut,
    Activity,
    Store,
    Calendar,
    ArrowRight,
<<<<<<< Updated upstream
    FileClock,
=======
    ClipboardClock,
>>>>>>> Stashed changes
} from "lucide-react";
import Link from "next/link";

const ROLE_USER: "MS" | "COS" | "COORDINATOR" | "ADMIN" | "MANAGER" = "COORDINATOR";

export default function DashboardPage() {
    const getMenuByRole = () => {
        switch (ROLE_USER) {
            case "MS":
                return {
                    menus: [
                        {
                            title: "Buat Laporan Baru",
                            description:
                                "Laporkan kerusakan atau maintenance yang diperlukan",
                            icon: Plus,
                            href: "/reports/create",
                            variant: "default" as const,
                        },
                        {
                            title: "Laporan Saya",
                            description:
                                "Lihat semua laporan yang sudah dibuat",
                            icon: FileText,
                            href: "/reports/my-reports",
                            variant: "outline" as const,
                        },
                        {
                            title: "Riwayat",
                            description: "Riwayat laporan yang sudah selesai",
                            icon: FileClock,
                            href: "/reports/history",
                            variant: "outline" as const,
                        },
                    ],
                };

            case "COS":
                return {
                    menus: [
                        {
                            title: "Laporan Toko",
                            description:
                                "Lihat laporan maintenance di toko Anda",
                            icon: FileText,
                            href: "/reports/store",
                            variant: "default" as const,
                        },
                        {
                            title: "Verifikasi Lapangan",
                            description: "Cek dan verifikasi hasil perbaikan",
                            icon: CheckCircle2,
                            href: "/verification/field",
                            variant: "outline" as const,
                        },
                        {
                            title: "Menunggu Review",
                            description: "Laporan yang menunggu persetujuan",
                            icon: Clock,
                            href: "/reports/pending",
                            variant: "outline" as const,
                        },
                        {
                            title: "Riwayat Verifikasi",
                            description:
                                "Riwayat verifikasi yang sudah dilakukan",
                            icon: FolderOpen,
                            href: "/verification/history",
                            variant: "outline" as const,
                        },
                    ],
                };

            case "COORDINATOR":
                return {
                    menus: [
                        {
                            title: "Approval Laporan",
                            description: "Persetujuan laporan maintenance",
                            icon: ClipboardCheck,
                            href: "/approval/reports",
                            variant: "default" as const,
                        },
                        {
                            title: "Riwayat Laporan",
                            description: "Riwayat semua laporan maintenance",
                            icon: ClipboardClock,
                            href: "/approval/history",
                            variant: "outline" as const,
                        },
                    ],
                };

            case "ADMIN":
                return {
                    menus: [
                        {
                            title: "Verifikasi Dokumen",
                            description: "Cek nota dan kelengkapan dokumen",
                            icon: ClipboardCheck,
                            href: "/admin/verification",
                            variant: "default" as const,
                        },
                        {
                            title: "Generate SPJ",
                            description: "Buat Surat Pertanggungjawaban",
                            icon: FileText,
                            href: "/admin/spj",
                            variant: "outline" as const,
                        },
                        {
                            title: "Arsip Dokumen",
                            description: "Kelola arsip dan dokumen",
                            icon: FolderOpen,
                            href: "/admin/archive",
                            variant: "outline" as const,
                        },
                        {
                            title: "Pengaturan",
                            description: "Pengaturan sistem dan user",
                            icon: Settings,
                            href: "/admin/settings",
                            variant: "outline" as const,
                        },
                    ],
                };

            case "MANAGER":
                return {
                    menus: [
                        {
                            title: "Approval SPJ",
                            description: "Review dan approve SPJ",
                            icon: CheckCircle2,
                            href: "/manager/approval",
                            variant: "default" as const,
                        },
                        {
                            title: "Dashboard Overview",
                            description: "Overview performance maintenance",
                            icon: BarChart3,
                            href: "/manager/overview",
                            variant: "outline" as const,
                        },
                        {
                            title: "Laporan Keuangan",
                            description: "Laporan biaya maintenance",
                            icon: FileText,
                            href: "/manager/financial",
                            variant: "outline" as const,
                        },
                        {
                            title: "Riwayat Approval",
                            description:
                                "Riwayat approval yang sudah dilakukan",
                            icon: FolderOpen,
                            href: "/manager/history",
                            variant: "outline" as const,
                        },
                    ],
                };

            default:
                return {
                    menus: [],
                };
        }
    };

    const { menus } = getMenuByRole();

    const getRoleName = () => {
        switch (ROLE_USER) {
            case "MS":
                return "Maintenance Support";
            case "COS":
                return "COS / ACOS";
            case "COORDINATOR":
                return "Maintenance Coordinator";
            case "ADMIN":
                return "Admin Building & Maintenance";
            case "MANAGER":
                return "Manager";
            default:
                return "Unknown Role";
        }
    };

    const stats = [
        {
            label: "Total Laporan",
            value: "0",
            icon: FileText,
            color: "text-primary",
        },
        {
            label: "Menunggu approval",
            value: "0",
            icon: Clock,
            color: "text-yellow-600",
        },
        {
            label: "Laporan Selesai",
            value: "0",
            icon: CheckCircle2,
            color: "text-green-600",
        },
        {
            label: "Laporan Ditolak",
            value: "0",
            icon: AlertCircle,
            color: "text-red-600",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-muted/20">
            <Header
                variant="dashboard"
                title="Dashboard"
                showBackButton={false}
                backHref="/"
            />

            <main className="flex-1 container mx-auto px-4 md:px-8 py-8 max-w-7xl space-y-8">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold tracking-tight text-foreground">
                            Selamat Datang, User
                        </h1>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1 flex items-center gap-2">
                            <Store className="h-3 w-3 md:h-4 md:w-4" />
                            NAMA CABANG (T001)
                            <span className="hidden md:inline text-muted-foreground/50">
                                |
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] md:text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                {getRoleName()}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Badge
                            variant="outline"
                            className="flex px-3 py-1.5 gap-2 items-center text-xs font-normal"
                        >
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date().toLocaleDateString("id-ID", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </Badge>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto md:ml-0"
                            asChild
                        >
                            <Link href="/login">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <Card
                            key={i}
                            className="hover:shadow-md transition-shadow gap-2 py-3 md:py-6"
                        >
                            <CardHeader className="flex flex-row items-center px-0 md:px-6 justify-center md:justify-between space-y-0">
                                <CardTitle className="text-xs text-center md:text-left md:text-sm font-medium w-12 md:w-auto">
                                    {stat.label}
                                </CardTitle>
                                <stat.icon
                                    className={`h-4 w-4 ${stat.color} hidden md:block`}
                                />
                            </CardHeader>
                            <CardContent className="md:items-start justify-center items-center gap-1 flex md:flex-col">
                                <div className="text-lg md:text-2xl md:text-left font-bold">
                                    {stat.value}
                                </div>
                                <stat.icon
                                    className={`h-3 w-3 ${stat.color} md:hidden`}
                                />
                                <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                                    Laporan bulan ini
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Menu - 2 Columns on Desktop */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Settings className="h-5 w-5 text-primary" />
                                Menu Utama
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {menus.map((menu, index) => {
                                const Icon = menu.icon;
                                const isDefault = menu.variant === "default";
                                return (
                                    <Link
                                        key={index}
                                        href={menu.href}
                                        className="group block h-full"
                                    >
                                        <Card
                                            className={`
                                            h-full transition-all duration-200
                                            ${
                                                isDefault
                                                    ? "bg-primary text-primary-foreground border-primary shadow-md hover:shadow-lg hover:bg-primary/90"
                                                    : "hover:border-primary/50 hover:shadow-md hover:bg-accent/5"
                                            }
                                        `}
                                        >
                                            <CardContent className="p-5 py-0 flex flex-row items-start gap-4">
                                                <div
                                                    className={`
                                                    p-3 rounded-xl shrink-0 transition-colors
                                                    ${isDefault ? "bg-white/10" : "bg-primary/10 group-hover:bg-primary/20"}
                                                `}
                                                >
                                                    <Icon
                                                        className={`h-6 w-6 ${isDefault ? "text-white" : "text-primary"}`}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3
                                                        className={`font-semibold text:sm md:text-lg ${isDefault ? "text-white" : "text-foreground"}`}
                                                    >
                                                        {menu.title}
                                                    </h3>
                                                    <p
                                                        className={`text-xs md:text-sm leading-relaxed ${isDefault ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                                                    >
                                                        {menu.description}
                                                    </p>
                                                </div>
                                                {isDefault && (
                                                    <ArrowRight className="h-5 w-5 ml-auto self-center text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sidebar / Activity Feed - 1 Column on Desktop */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Aktivitas Terbaru
                            </h2>
                            <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-primary"
                            >
                                Lihat Semua
                            </Button>
                        </div>

                        <Card className="h-fit">
                            <CardContent className="p-0">
                                <div className="p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px]">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                        <Activity className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-medium">
                                            Belum ada aktivitas
                                        </h3>
                                        <p className="text-sm text-muted-foreground max-w-[200px]">
                                            Laporan dan aktivitas terbaru Anda
                                            akan muncul di sini.
                                        </p>
                                    </div>
                                    {ROLE_USER === "MS" && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            asChild
                                        >
                                            <Link href="/reports/create">
                                                Buat Laporan Sekarang
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
