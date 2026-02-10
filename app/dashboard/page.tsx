"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    FileStack,
    TrendingUp,
    CheckCheck,
    AlertTriangle,
} from "lucide-react";
import Link from "next/link";

// 🔧 DEVELOPMENT: Set role user untuk testing
// Role options: "MS" | "COS" | "COORDINATOR" | "ADMIN" | "MANAGER"
const ROLE_USER: "MS" | "COS" | "COORDINATOR" | "ADMIN" | "MANAGER" = "MS";

export default function DashboardPage() {
    // Menu untuk setiap role
    const getMenuByRole = () => {
        switch (ROLE_USER) {
            case "MS": // Maintenance Support
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
                            title: "Upload Penyelesaian",
                            description: "Upload foto dan nota perbaikan",
                            icon: ClipboardCheck,
                            href: "/reports/upload",
                            variant: "outline" as const,
                        },
                        {
                            title: "Riwayat",
                            description: "Riwayat laporan yang sudah selesai",
                            icon: FolderOpen,
                            href: "/reports/history",
                            variant: "outline" as const,
                        },
                    ],
                };

            case "COS": // COS / ACOS
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

            case "COORDINATOR": // Maintenance Coordinator
                return {
                    menus: [
                        {
                            title: "Monitoring Laporan",
                            description: "Dashboard monitoring semua laporan",
                            icon: BarChart3,
                            href: "/monitoring/dashboard",
                            variant: "default" as const,
                        },
                        {
                            title: "Konfirmasi Data",
                            description: "Konfirmasi kelengkapan administratif",
                            icon: ListChecks,
                            href: "/monitoring/confirmation",
                            variant: "outline" as const,
                        },
                        {
                            title: "Laporan Bermasalah",
                            description: "Laporan yang memerlukan perhatian",
                            icon: AlertCircle,
                            href: "/monitoring/issues",
                            variant: "outline" as const,
                        },
                        {
                            title: "Statistik",
                            description: "Analisa dan statistik maintenance",
                            icon: BarChart3,
                            href: "/monitoring/statistics",
                            variant: "outline" as const,
                        },
                    ],
                };

            case "ADMIN": // Admin Building & Maintenance
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

            case "MANAGER": // Manager
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

    // Get role name for display
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

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header
                variant="dashboard"
                title="Dashboard"
                showBackButton={false}
                description={getRoleName()}
                backHref="/"
            />

            <main className="flex-1 container mx-auto px-4 py-4 md:py-6">
                {/* User Info */}
                <div className="mb-4">
                    <div className="flex flex-grid items-center sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <Badge
                            variant="default"
                            className="text-xs px-2.5 py-0.5 w-fit"
                        >
                            NAMA
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                            NAMA CABANG
                        </p>
                    </div>
                </div>
                <h2 className="text-base md:text-lg font-bold text-foreground mb-3">
                    Laporan
                </h2>
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                    <Card className="border hover:shadow-md transition-all cursor-pointer hover:border-primary/30">
                        <CardContent className="flex flex-col items-center gap-2 text-center">
                            <div className="space-y-0.5">
                                <p className="text-2xl md:text-3xl font-bold text-foreground">
                                    0
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Total
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border hover:shadow-md transition-all cursor-pointer hover:border-primary/30">
                        <CardContent className="flex flex-col items-center gap-2 text-center">
                            <div className="space-y-0.5">
                                <p className="text-2xl md:text-3xl font-bold text-yellow-600">
                                    0
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Progress
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border hover:shadow-md transition-all cursor-pointer hover:border-primary/30">
                        <CardContent className=" flex flex-col items-center gap-2 text-center">
                            <div className="space-y-0.5">
                                <p className="text-2xl md:text-3xl font-bold text-green-600">
                                    0
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Selesai
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border hover:shadow-md transition-all cursor-pointer hover:border-primary/30">
                        <CardContent className="flex flex-col items-center gap-2 text-center">
                            <div className="space-y-0.5">
                                <p className="text-2xl md:text-3xl font-bold text-red-600">
                                    0
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Review
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Menu Grid */}
                <div className="mb-6">
                    <h2 className="text-base md:text-lg font-bold text-foreground mb-3">
                        Menu Utama
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {menus.map((menu, index) => {
                            const Icon = menu.icon;
                            const isDefault = menu.variant === "default";
                            return (
                                <Link
                                    key={index}
                                    href={menu.href}
                                    className="block"
                                >
                                    <Card
                                        className={`
                                            h-full transition-all cursor-pointer
                                            ${
                                                isDefault
                                                    ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                                    : "hover:border-primary/50 hover:shadow-md"
                                            }
                                        `}
                                    >
                                        <CardContent className="p-4 flex flex-col items-center gap-3 text-center">
                                            <Icon
                                                className={`
                                                        h-10 w-10
                                                        ${isDefault ? "text-white" : "text-primary"}
                                                    `}
                                            />
                                            <div className="space-y-1">
                                                <h3
                                                    className={`
                                                    text-sm font-semibold leading-tight
                                                    ${isDefault ? "text-white" : "text-foreground"}
                                                `}
                                                >
                                                    {menu.title}
                                                </h3>
                                                <p
                                                    className={`
                                                    text-xs leading-tight line-clamp-2 hidden md:block
                                                    ${isDefault ? "text-white/80" : "text-muted-foreground"}
                                                `}
                                                >
                                                    {menu.description}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
