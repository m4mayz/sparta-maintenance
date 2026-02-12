"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from "@/components/ui/empty";
import {
    Search,
    Plus,
    MapPin,
    Calendar,
    Filter,
    FileText,
    ChevronRight,
    Clock,
    CheckCircle2,
    MoreHorizontal,
    ArrowUpDown,
    X,
    Check,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data
const MOCK_REPORTS = [
    {
        id: "RPT-2024-001",
        store: "Alfamart Cikokol Raya",
        location: "Area Kasir",
        damageType: "Electrical",
        description: "Lampu utama kedip-kedip dan mati nyala",
        status: "pending",
        date: "2024-02-10",
        cost: 150000,
    },
    {
        id: "RPT-2024-002",
        store: "Alfamart Hasyim Ashari",
        location: "Gudang Belakang",
        damageType: "Plumbing",
        description: "Pipa wastafel bocor membasahi lantai",
        status: "approved",
        date: "2024-02-09",
        cost: 350000,
    },
    {
        id: "RPT-2024-003",
        store: "Alfamart Modernland",
        location: "Area Sales",
        damageType: "AC",
        description: "AC tidak dingin, hanya keluar angin",
        status: "rejected",
        date: "2024-02-08",
        cost: 750000,
    },
    {
        id: "RPT-2024-004",
        store: "Alfamart Sudirman",
        location: "Pintu Masuk",
        damageType: "Building",
        description: "Engsel pintu kaca lepas",
        status: "pending",
        date: "2024-02-07",
        cost: 200000,
    },
];

export default function MyReportsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Filter Logic
    const filteredReports = MOCK_REPORTS.filter((report) => {
        const matchesSearch =
            report.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || report.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge
                        variant="secondary"
                        className="gap-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80 border-yellow-200 shadow-none"
                    >
                        <Clock className="h-3 w-3" /> Menunggu persetujuan
                    </Badge>
                );
            case "approved":
                return (
                    <Badge
                        variant="secondary"
                        className="gap-1 bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200 shadow-none"
                    >
                        <Check className="h-3 w-3" /> Disetujui
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge
                        variant="secondary"
                        className="gap-1 bg-red-100 text-red-700 hover:bg-red-100/80 border-red-200 shadow-none"
                    >
                        <X className="h-3 w-3" /> Ditolak
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header
                variant="dashboard"
                title="Laporan Saya"
                description="Kelola dan pantau status laporan kerusakan"
                showBackButton
                backHref="/dashboard"
            />

            {/* Container diperlebar ke max-w-6xl untuk mengakomodasi Table Desktop */}
            <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl space-y-6">
                {/* Action Bar: Search, Filter, Create */}
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                    <div className="flex flex-1 gap-2">
                        <div className="relative flex-1 md:max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari toko atau ID laporan..."
                                className="pl-9 bg-background"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-[130px] bg-background">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Status" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="pending">
                                    Menunggu
                                </SelectItem>
                                <SelectItem value="approved">
                                    Diproses
                                </SelectItem>
                                <SelectItem value="rejected">
                                    Selesai
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={() => router.push("/reports/create")}
                        className="w-full md:w-auto gap-2 shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden md:inline">Buat Laporan</span>
                        <span className="md:hidden">Laporan Baru</span>
                    </Button>
                </div>

                {filteredReports.length > 0 ? (
                    <>
                        {/* --- MOBILE VIEW: CARD LIST (Visible on small screens) --- */}
                        <div className="space-y-3 md:hidden">
                            {filteredReports.map((report) => (
                                <Card
                                    key={report.id}
                                    className="cursor-pointer hover:border-primary/50 transition-all active:scale-[0.99] shadow-sm"
                                    onClick={() =>
                                        console.log("View detail", report.id)
                                    }
                                >
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-semibold text-sm line-clamp-1">
                                                    {report.store}
                                                </h3>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-mono">
                                                    {report.id}
                                                </p>
                                            </div>
                                            {getStatusBadge(report.status)}
                                        </div>

                                        <div className="grid gap-2 text-sm text-muted-foreground mb-3">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">
                                                    {report.location}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                                <span>{report.date}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t mt-3">
                                            <Badge
                                                variant="outline"
                                                className="capitalize font-normal text-xs bg-muted/50"
                                            >
                                                {report.damageType}
                                            </Badge>
                                            <div className="flex items-center text-xs text-primary font-medium group">
                                                Detail
                                                <ChevronRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* --- DESKTOP VIEW: DATA TABLE (Visible on medium+ screens) --- */}
                        <div className="hidden md:block border rounded-lg shadow-sm bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="w-[100px]">
                                            ID Laporan
                                        </TableHead>
                                        <TableHead className="min-w-[200px]">
                                            Toko & Lokasi
                                        </TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                                                Tanggal{" "}
                                                <ArrowUpDown className="h-3 w-3" />
                                            </div>
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Estimasi
                                        </TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredReports.map((report) => (
                                        <TableRow
                                            key={report.id}
                                            className="cursor-pointer group"
                                            onClick={() =>
                                                console.log(
                                                    "View detail",
                                                    report.id,
                                                )
                                            }
                                        >
                                            <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                                                {report.id}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium text-sm">
                                                        {report.store}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />{" "}
                                                        {report.location}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="capitalize font-normal bg-muted/30"
                                                >
                                                    {report.damageType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {report.date}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(report.status)}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-sm">
                                                Rp{" "}
                                                {report.cost.toLocaleString(
                                                    "id-ID",
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Menu
                                                            </span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>
                                                            Aksi
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                console.log(
                                                                    "Edit",
                                                                );
                                                            }}
                                                        >
                                                            Edit Laporan
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                console.log(
                                                                    "History",
                                                                );
                                                            }}
                                                        >
                                                            Lihat Riwayat
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                ) : (
                    /* Empty State - Responsive Container */
                    <div className="bg-card border rounded-lg border-dashed">
                        <Empty className="py-16">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <FileText className="h-10 w-10 text-muted-foreground" />
                                </EmptyMedia>
                                <EmptyTitle>
                                    Tidak ada laporan ditemukan
                                </EmptyTitle>
                                <EmptyDescription>
                                    {searchQuery
                                        ? "Coba ubah kata kunci pencarian atau filter Anda."
                                        : "Anda belum membuat laporan kerusakan apapun."}
                                </EmptyDescription>
                                {!searchQuery && (
                                    <div className="pt-4">
                                        <Button
                                            onClick={() =>
                                                router.push("/reports/create")
                                            }
                                        >
                                            Buat Laporan Sekarang
                                        </Button>
                                    </div>
                                )}
                            </EmptyHeader>
                        </Empty>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
