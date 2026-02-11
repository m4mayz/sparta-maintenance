"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
} from "@/components/ui/input-group";
import {
    Camera,
    ChevronDown,
    Store,
    MapPin,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import {
    checklistCategories,
    type ChecklistItem,
    type ChecklistCondition,
} from "@/lib/checklist-data";

type BmsItem = ChecklistItem & {
    quantity: number;
    price: number;
    total: number;
};

export default function CreateReportPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [openCategories, setOpenCategories] = useState<Set<string>>(
        new Set(),
    );

    // Step 1 Data
    const [store, setStore] = useState("");
    const [address, setAddress] = useState("");
    const [checklist, setChecklist] = useState<Map<string, ChecklistItem>>(
        new Map(),
    );

    // Step 2 Data
    const [bmsItems, setBmsItems] = useState<Map<string, BmsItem>>(new Map());

    const toggleCategory = (categoryId: string) => {
        setOpenCategories((prev) => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }
            return next;
        });
    };

    const updateChecklistItem = (
        itemId: string,
        itemName: string,
        field: keyof ChecklistItem,
        value: ChecklistCondition | File | string | undefined,
    ) => {
        setChecklist((prev) => {
            const next = new Map(prev);
            const existing = next.get(itemId) || {
                id: itemId,
                name: itemName,
                condition: "" as ChecklistCondition,
                handler: "",
            };
            next.set(itemId, { ...existing, [field]: value });
            return next;
        });
    };

    const handlePhotoUpload = (
        itemId: string,
        itemName: string,
        file: File | undefined,
    ) => {
        if (file) {
            // Validate file
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Ukuran file maksimal 5MB");
                return;
            }
            if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
                toast.error("Hanya file JPG, JPEG, dan PNG yang diperbolehkan");
                return;
            }
        }
        updateChecklistItem(itemId, itemName, "photo", file);
    };

    const validateStep1 = (): boolean => {
        if (!store.trim()) {
            toast.error("Nama toko wajib diisi");
            return false;
        }
        if (!address.trim() || address.length < 5) {
            toast.error("Alamat minimal 5 karakter");
            return false;
        }

        // Validate all items must have condition
        const totalItems = checklistCategories.reduce(
            (sum, cat) => sum + cat.items.length,
            0,
        );

        if (checklist.size !== totalItems) {
            toast.error("Semua item wajib diisi kondisinya");
            return false;
        }

        for (const item of checklist.values()) {
            if (!item.condition) {
                toast.error("Semua item wajib diisi kondisinya");
                return false;
            }
            if (item.condition === "rusak") {
                if (!item.photo) {
                    toast.error(`Item "${item.name}" rusak wajib upload foto`);
                    return false;
                }
                if (!item.handler) {
                    toast.error(
                        `Item "${item.name}" rusak wajib pilih handler (BMS/Kontraktor)`,
                    );
                    return false;
                }
            }
        }

        return true;
    };

    const handleNextStep = () => {
        if (!validateStep1()) return;

        // Prepare BMS items for step 2
        const bmsData = new Map<string, BmsItem>();
        for (const [id, item] of checklist) {
            if (item.condition === "rusak" && item.handler === "BMS") {
                bmsData.set(id, {
                    ...item,
                    quantity: 0,
                    price: 0,
                    total: 0,
                });
            }
        }
        setBmsItems(bmsData);
        setStep(2);
        window.scrollTo(0, 0);
    };

    const updateBmsItem = (
        itemId: string,
        field: "quantity" | "price",
        value: number,
    ) => {
        setBmsItems((prev) => {
            const next = new Map(prev);
            const item = next.get(itemId);
            if (item) {
                const updated = { ...item, [field]: value };
                updated.total = updated.quantity * updated.price;
                next.set(itemId, updated);
            }
            return next;
        });
    };

    const validateStep2 = (): boolean => {
        for (const item of bmsItems.values()) {
            if (item.quantity <= 0) {
                toast.error(`Quantity untuk "${item.name}" wajib diisi`);
                return false;
            }
            if (item.price <= 0) {
                toast.error(`Harga untuk "${item.name}" wajib diisi`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateStep2()) return;

        const rusakItems = Array.from(checklist.values()).filter(
            (item) => item.condition === "rusak",
        );
        const bmsItemsList = Array.from(bmsItems.values());
        const kontraktorItems = rusakItems.filter(
            (item) => item.handler === "Kontraktor",
        );

        const reportData = {
            store,
            address,
            totalRusakItems: rusakItems.length,
            bmsItems: bmsItemsList,
            kontraktorItems,
            totalBmsCost: bmsItemsList.reduce(
                (sum, item) => sum + item.total,
                0,
            ),
        };

        console.log("Report Data:", reportData);

        toast.success("Laporan berhasil dibuat!", {
            description: `${rusakItems.length} item rusak tercatat`,
        });

        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    };

    const rusakItems = Array.from(checklist.values()).filter(
        (item) => item.condition === "rusak",
    );
    const kontraktorItems = rusakItems.filter(
        (item) => item.handler === "Kontraktor",
    );
    const bmsItemsCount = rusakItems.filter(
        (item) => item.handler === "BMS",
    ).length;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header
                variant="dashboard"
                title={step === 1 ? "Checklist Toko" : "Ringkasan Laporan"}
                description={
                    step === 1
                        ? "Periksa kondisi semua item di toko"
                        : "Isi quantity dan harga untuk item BMS"
                }
                showBackButton
                backHref={step === 2 ? undefined : "/dashboard"}
            />

            <main className="flex-1 container mx-auto px-4 py-4 md:py-6 max-w-4xl">
                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div
                        className={`flex items-center gap-2 ${
                            step === 1
                                ? "text-primary"
                                : "text-muted-foreground"
                        }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                step === 1
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                            }`}
                        >
                            1
                        </div>
                        <span className="text-sm font-medium">Checklist</span>
                    </div>
                    <div className="w-16 h-0.5 bg-border" />
                    <div
                        className={`flex items-center gap-2 ${
                            step === 2
                                ? "text-primary"
                                : "text-muted-foreground"
                        }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                step === 2
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                            }`}
                        >
                            2
                        </div>
                        <span className="text-sm font-medium">Ringkasan</span>
                    </div>
                </div>

                {step === 1 ? (
                    <>
                        {/* Store Info */}
                        <Card className="mb-4">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Store className="h-4 w-4 text-primary" />
                                    Informasi Toko
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="store">
                                        Nama Toko{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <InputGroup className="mt-2">
                                        <InputGroupAddon>
                                            <Store className="h-4 w-4" />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="store"
                                            placeholder="Masukkan nama toko"
                                            value={store}
                                            onChange={(e) =>
                                                setStore(e.target.value)
                                            }
                                        />
                                    </InputGroup>
                                </div>
                                <div>
                                    <Label htmlFor="address">
                                        Alamat{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <InputGroup className="mt-2">
                                        <InputGroupAddon>
                                            <MapPin className="h-4 w-4" />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="address"
                                            placeholder="Masukkan alamat lengkap toko"
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(e.target.value)
                                            }
                                        />
                                    </InputGroup>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Checklist Categories */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Checklist Kondisi
                                    <span className="text-sm font-normal text-muted-foreground ml-2">
                                        (Wajib isi semua item)
                                    </span>
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Total{" "}
                                    {checklistCategories.reduce(
                                        (sum, cat) => sum + cat.items.length,
                                        0,
                                    )}{" "}
                                    item harus diperiksa
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {checklistCategories.map((category) => {
                                    const isOpen = openCategories.has(
                                        category.id,
                                    );
                                    const categoryItems = category.items.map(
                                        (item) => ({
                                            ...item,
                                            ...checklist.get(item.id),
                                        }),
                                    );
                                    const completedCount = categoryItems.filter(
                                        (item) => item.condition,
                                    ).length;
                                    const totalCount = category.items.length;
                                    const isCompleted =
                                        completedCount === totalCount;

                                    return (
                                        <Collapsible
                                            key={category.id}
                                            open={isOpen}
                                            onOpenChange={() =>
                                                toggleCategory(category.id)
                                            }
                                        >
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-between"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {isCompleted ? (
                                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                                                        )}
                                                        <span className="font-medium">
                                                            {category.title}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            ({completedCount}/
                                                            {totalCount})
                                                        </span>
                                                    </div>
                                                    <ChevronDown
                                                        className={`h-4 w-4 transition-transform ${
                                                            isOpen
                                                                ? "rotate-180"
                                                                : ""
                                                        }`}
                                                    />
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pt-2">
                                                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                                                    {category.items.map(
                                                        (item) => {
                                                            const itemData =
                                                                checklist.get(
                                                                    item.id,
                                                                );
                                                            const condition =
                                                                itemData?.condition ||
                                                                "";
                                                            const handler =
                                                                itemData?.handler ||
                                                                "";
                                                            const photo =
                                                                itemData?.photo;

                                                            return (
                                                                <div
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className="space-y-3 p-3 bg-background rounded-md border"
                                                                >
                                                                    <div className="font-medium text-sm">
                                                                        {
                                                                            item.id
                                                                        }
                                                                        .{" "}
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </div>

                                                                    {/* Condition Radio */}
                                                                    <RadioGroup
                                                                        value={
                                                                            condition
                                                                        }
                                                                        onValueChange={(
                                                                            value,
                                                                        ) =>
                                                                            updateChecklistItem(
                                                                                item.id,
                                                                                item.name,
                                                                                "condition",
                                                                                value as ChecklistCondition,
                                                                            )
                                                                        }
                                                                    >
                                                                        <div className="flex flex-wrap gap-4">
                                                                            <div className="flex items-center space-x-2">
                                                                                <RadioGroupItem
                                                                                    value="baik"
                                                                                    id={`${item.id}-baik`}
                                                                                />
                                                                                <Label
                                                                                    htmlFor={`${item.id}-baik`}
                                                                                    className="cursor-pointer"
                                                                                >
                                                                                    Baik
                                                                                </Label>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <RadioGroupItem
                                                                                    value="rusak"
                                                                                    id={`${item.id}-rusak`}
                                                                                />
                                                                                <Label
                                                                                    htmlFor={`${item.id}-rusak`}
                                                                                    className="cursor-pointer"
                                                                                >
                                                                                    Rusak
                                                                                </Label>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <RadioGroupItem
                                                                                    value="tidak-ada"
                                                                                    id={`${item.id}-tidak-ada`}
                                                                                />
                                                                                <Label
                                                                                    htmlFor={`${item.id}-tidak-ada`}
                                                                                    className="cursor-pointer"
                                                                                >
                                                                                    Tidak
                                                                                    Ada
                                                                                </Label>
                                                                            </div>
                                                                        </div>
                                                                    </RadioGroup>

                                                                    {/* Conditional Fields for Rusak */}
                                                                    {condition ===
                                                                        "rusak" && (
                                                                        <div className="space-y-3 pt-2 border-t">
                                                                            {/* Photo Upload */}
                                                                            <div>
                                                                                <Label
                                                                                    htmlFor={`${item.id}-photo`}
                                                                                    className="text-sm"
                                                                                >
                                                                                    Foto
                                                                                    Kerusakan{" "}
                                                                                    <span className="text-red-500">
                                                                                        *
                                                                                    </span>
                                                                                </Label>
                                                                                <div className="flex items-center gap-2 mt-1">
                                                                                    <Input
                                                                                        id={`${item.id}-photo`}
                                                                                        type="file"
                                                                                        accept="image/*"
                                                                                        capture="environment"
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) =>
                                                                                            handlePhotoUpload(
                                                                                                item.id,
                                                                                                item.name,
                                                                                                e
                                                                                                    .target
                                                                                                    .files?.[0],
                                                                                            )
                                                                                        }
                                                                                        className="text-sm"
                                                                                    />
                                                                                    {photo && (
                                                                                        <Camera className="h-4 w-4 text-green-600" />
                                                                                    )}
                                                                                </div>
                                                                                {photo && (
                                                                                    <p className="text-xs text-muted-foreground mt-1">
                                                                                        {
                                                                                            photo.name
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>

                                                                            {/* Handler Select */}
                                                                            <div>
                                                                                <Label
                                                                                    htmlFor={`${item.id}-handler`}
                                                                                    className="text-sm"
                                                                                >
                                                                                    Akan
                                                                                    dikerjakan
                                                                                    oleh{" "}
                                                                                    <span className="text-red-500">
                                                                                        *
                                                                                    </span>
                                                                                </Label>
                                                                                <Select
                                                                                    value={
                                                                                        handler
                                                                                    }
                                                                                    onValueChange={(
                                                                                        value,
                                                                                    ) =>
                                                                                        updateChecklistItem(
                                                                                            item.id,
                                                                                            item.name,
                                                                                            "handler",
                                                                                            value,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <SelectTrigger
                                                                                        id={`${item.id}-handler`}
                                                                                        className="mt-1"
                                                                                    >
                                                                                        <SelectValue placeholder="Pilih handler" />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        <SelectItem value="BMS">
                                                                                            BMS
                                                                                        </SelectItem>
                                                                                        <SelectItem value="Kontraktor">
                                                                                            Kontraktor
                                                                                        </SelectItem>
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Submit Step 1 */}
                        <ButtonGroup
                            className="mt-6 w-full"
                            orientation="horizontal"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => router.back()}
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                className="flex-1"
                                onClick={handleNextStep}
                            >
                                Lanjut ke Ringkasan
                            </Button>
                        </ButtonGroup>
                    </>
                ) : (
                    <>
                        {/* Step 2: Summary Tables */}
                        <div className="space-y-6">
                            {/* Store Info Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Informasi Toko
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">
                                            Nama:
                                        </span>{" "}
                                        <span className="font-medium">
                                            {store}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">
                                            Alamat:
                                        </span>{" "}
                                        <span className="font-medium">
                                            {address}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">
                                            Total Item Rusak:
                                        </span>{" "}
                                        <span className="font-medium text-red-600">
                                            {rusakItems.length} item
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* BMS Items Table */}
                            {bmsItemsCount > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Item yang Dikerjakan BMS
                                            <span className="text-sm font-normal text-muted-foreground ml-2">
                                                ({bmsItemsCount} item)
                                            </span>
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Isi quantity dan harga untuk setiap
                                            item
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="border rounded-lg overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-12">
                                                            No
                                                        </TableHead>
                                                        <TableHead>
                                                            Item
                                                        </TableHead>
                                                        <TableHead className="w-24">
                                                            Qty{" "}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </TableHead>
                                                        <TableHead className="w-32">
                                                            Harga Satuan{" "}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </TableHead>
                                                        <TableHead className="text-right w-32">
                                                            Jumlah
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {Array.from(
                                                        bmsItems.values(),
                                                    ).map((item, index) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell>
                                                                {index + 1}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {item.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    value={
                                                                        item.quantity ||
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateBmsItem(
                                                                            item.id,
                                                                            "quantity",
                                                                            parseFloat(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ) ||
                                                                                0,
                                                                        )
                                                                    }
                                                                    className="h-8"
                                                                    placeholder="0"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    value={
                                                                        item.price ||
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateBmsItem(
                                                                            item.id,
                                                                            "price",
                                                                            parseFloat(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ) ||
                                                                                0,
                                                                        )
                                                                    }
                                                                    className="h-8"
                                                                    placeholder="0"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="text-right font-medium">
                                                                Rp{" "}
                                                                {item.total.toLocaleString(
                                                                    "id-ID",
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={4}
                                                            className="text-right font-bold"
                                                        >
                                                            Total Biaya BMS:
                                                        </TableCell>
                                                        <TableCell className="text-right font-bold text-primary">
                                                            Rp{" "}
                                                            {Array.from(
                                                                bmsItems.values(),
                                                            )
                                                                .reduce(
                                                                    (
                                                                        sum,
                                                                        item,
                                                                    ) =>
                                                                        sum +
                                                                        item.total,
                                                                    0,
                                                                )
                                                                .toLocaleString(
                                                                    "id-ID",
                                                                )}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Kontraktor Items Table */}
                            {kontraktorItems.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Item yang Dikerjakan Kontraktor
                                            <span className="text-sm font-normal text-muted-foreground ml-2">
                                                ({kontraktorItems.length} item)
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="border rounded-lg overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-12">
                                                            No
                                                        </TableHead>
                                                        <TableHead>
                                                            Item
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {kontraktorItems.map(
                                                        (item, index) => (
                                                            <TableRow
                                                                key={item.id}
                                                            >
                                                                <TableCell>
                                                                    {index + 1}
                                                                </TableCell>
                                                                <TableCell className="font-medium">
                                                                    {item.name}
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Submit Step 2 */}
                            <ButtonGroup
                                className="w-full"
                                orientation="horizontal"
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setStep(1)}
                                >
                                    Kembali
                                </Button>
                                <Button
                                    type="button"
                                    className="flex-1"
                                    onClick={handleSubmit}
                                >
                                    Submit Laporan
                                </Button>
                            </ButtonGroup>
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
