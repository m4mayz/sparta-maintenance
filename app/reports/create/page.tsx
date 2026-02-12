"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { CameraModal } from "@/components/ui/camera-modal";
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
    Trash2,
    X,
    Zap,
    Plus,
} from "lucide-react";
import {
    checklistCategories,
    type ChecklistItem,
    type ChecklistCondition,
    type ChecklistCategory,
} from "@/lib/checklist-data";

type BmsItemEntry = {
    id: string;
    categoryId: string;
    categoryTitle: string;
    itemName: string;
    quantity: number;
    price: number;
    total: number;
};

type BmsCategoryGroup = {
    categoryId: string;
    categoryTitle: string;
    checklistItem: ChecklistItem;
    entries: BmsItemEntry[];
};

export default function CreateReportPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [openCategories, setOpenCategories] = useState<Set<string>>(
        new Set(),
    );
    const [store, setStore] = useState("");
    const [address, setAddress] = useState("");
    const [checklist, setChecklist] = useState<Map<string, ChecklistItem>>(
        new Map(),
    );
    const [bmsCategories, setBmsCategories] = useState<
        Map<string, BmsCategoryGroup>
    >(new Map());

    // STATE UNTUK CAMERA MODAL
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [activePhotoItemId, setActivePhotoItemId] = useState<string | null>(
        null,
    );

    // STATE UNTUK PREVIEW FOTO
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

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

    // Fungsi membuka modal kamera
    const handleOpenCamera = (itemId: string) => {
        setActivePhotoItemId(itemId);
        setIsCameraOpen(true);
    };

    // Callback saat foto diambil dari modal
    const handlePhotoCaptured = (file: File) => {
        if (activePhotoItemId) {
            // Cari nama item berdasarkan ID (opsional, hanya untuk state update)
            let itemName = "";
            for (const cat of checklistCategories) {
                const found = cat.items.find((i) => i.id === activePhotoItemId);
                if (found) {
                    itemName = found.name;
                    break;
                }
            }
            updateChecklistItem(activePhotoItemId, itemName, "photo", file);
            toast.success("Foto berhasil diupload");
        }
        setActivePhotoItemId(null);
    };

    const removePhoto = (itemId: string, itemName: string) => {
        updateChecklistItem(itemId, itemName, "photo", undefined);
    };

    // Fungsi untuk preview foto
    const handlePreviewPhoto = (file: File) => {
        const url = URL.createObjectURL(file);
        setPreviewPhoto(url);
    };

    const closePreview = () => {
        if (previewPhoto) {
            URL.revokeObjectURL(previewPhoto);
        }
        setPreviewPhoto(null);
    };

    // DEVELOPMENT ONLY: Auto-fill semua field
    const autoFillForDevelopment = async () => {
        // Fill store info
        setStore("Toko Sumber Jaya");
        setAddress("Jl. Merdeka No. 123, Kota Bandung, Jawa Barat 40123");

        // Open all categories
        const allCategoryIds = checklistCategories.map((cat) => cat.id);
        setOpenCategories(new Set(allCategoryIds));

        // Fill checklist items
        const newChecklist = new Map<string, ChecklistItem>();
        let itemIndex = 0;

        for (const category of checklistCategories) {
            for (const item of category.items) {
                itemIndex++;
                // Alternate between conditions: baik, rusak, tidak-ada
                const conditions: ChecklistCondition[] = [
                    "baik",
                    "rusak",
                    "tidak-ada",
                ];
                const condition = conditions[itemIndex % 3];

                const checklistItem: ChecklistItem = {
                    id: item.id,
                    name: item.name,
                    condition: condition,
                    handler: "",
                };

                // If baik or rusak, add photo
                if (condition === "baik" || condition === "rusak") {
                    try {
                        const dummyPhoto = await new Promise<File>(
                            (resolve) => {
                                const canvas = document.createElement("canvas");
                                canvas.width = 640;
                                canvas.height = 480;
                                const ctx = canvas.getContext("2d");
                                if (ctx) {
                                    ctx.fillStyle =
                                        condition === "baik"
                                            ? "#10B981"
                                            : "#4F46E5";
                                    ctx.fillRect(
                                        0,
                                        0,
                                        canvas.width,
                                        canvas.height,
                                    );
                                    ctx.fillStyle = "white";
                                    ctx.font = "bold 32px Arial";
                                    ctx.textAlign = "center";
                                    ctx.fillText(
                                        `FOTO: ${item.name}`,
                                        canvas.width / 2,
                                        canvas.height / 2 - 20,
                                    );
                                    ctx.font = "20px Arial";
                                    ctx.fillText(
                                        condition === "baik"
                                            ? "(Foto Bukti)"
                                            : "(Dummy Photo)",
                                        canvas.width / 2,
                                        canvas.height / 2 + 20,
                                    );
                                }
                                canvas.toBlob(
                                    (blob) => {
                                        if (blob) {
                                            resolve(
                                                new File(
                                                    [blob],
                                                    `foto_${item.id}.jpg`,
                                                    { type: "image/jpeg" },
                                                ),
                                            );
                                        }
                                    },
                                    "image/jpeg",
                                    0.8,
                                );
                            },
                        );
                        checklistItem.photo = dummyPhoto;
                    } catch (error) {
                        console.error("Error creating dummy photo:", error);
                    }
                }

                // If rusak, add handler
                if (condition === "rusak") {
                    checklistItem.handler =
                        itemIndex % 2 === 0 ? "BMS" : "Kontraktor";
                }

                newChecklist.set(item.id, checklistItem);
            }
        }

        setChecklist(newChecklist);

        // Auto-populate BMS categories with sample entries (for step 2)
        const bmsCats = new Map<string, BmsCategoryGroup>();
        for (const [id, item] of newChecklist) {
            if (item.condition === "rusak" && item.handler === "BMS") {
                let categoryData: ChecklistCategory | undefined;
                for (const cat of checklistCategories) {
                    if (cat.items.some((i) => i.id === id)) {
                        categoryData = cat;
                        break;
                    }
                }

                if (categoryData) {
                    const categoryId = categoryData.id;

                    if (!bmsCats.has(categoryId)) {
                        bmsCats.set(categoryId, {
                            categoryId: categoryData.id,
                            categoryTitle: categoryData.title,
                            checklistItem: item,
                            entries: [],
                        });
                    }

                    // Add 2 sample entries per category
                    const cat = bmsCats.get(categoryId)!;
                    for (let i = 1; i <= 2; i++) {
                        cat.entries.push({
                            id: `entry_${categoryId}_${i}_${Date.now()}`,
                            categoryId: categoryData.id,
                            categoryTitle: categoryData.title,
                            itemName: `Barang Contoh ${i}`,
                            quantity: Math.floor(Math.random() * 10) + 1,
                            price: (Math.floor(Math.random() * 10) + 1) * 50000,
                            total: 0,
                        });
                        // Calculate total
                        const lastEntry = cat.entries[cat.entries.length - 1];
                        lastEntry.total = lastEntry.quantity * lastEntry.price;
                    }
                }
            }
        }
        setBmsCategories(bmsCats);

        toast.success("Form berhasil diisi otomatis!");
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
            if (item.condition === "baik") {
                if (!item.photo) {
                    toast.error(`Item "${item.name}" wajib upload foto bukti`);
                    return false;
                }
            }
            if (item.condition === "rusak") {
                if (!item.photo) {
                    toast.error(`Item "${item.name}" rusak wajib upload foto`);
                    return false;
                }
                if (!item.handler) {
                    toast.error(
                        `Item "${item.name}" rusak wajib pilih handler`,
                    );
                    return false;
                }
            }
        }
        return true;
    };

    const handleNextStep = () => {
        if (!validateStep1()) return;

        // Group BMS items by category
        const categoryGroups = new Map<string, BmsCategoryGroup>();

        for (const [id, item] of checklist) {
            if (item.condition === "rusak" && item.handler === "BMS") {
                // Find category for this item
                let categoryData: ChecklistCategory | undefined;
                for (const cat of checklistCategories) {
                    if (cat.items.some((i) => i.id === id)) {
                        categoryData = cat;
                        break;
                    }
                }

                if (categoryData) {
                    const categoryId = categoryData.id;

                    if (!categoryGroups.has(categoryId)) {
                        categoryGroups.set(categoryId, {
                            categoryId: categoryData.id,
                            categoryTitle: categoryData.title,
                            checklistItem: item,
                            entries: [],
                        });
                    }
                }
            }
        }

        setBmsCategories(categoryGroups);
        setStep(2);
        window.scrollTo(0, 0);
    };

    const addBmsEntry = (categoryId: string) => {
        setBmsCategories((prev) => {
            const next = new Map(prev);
            const category = next.get(categoryId);
            if (category) {
                const newEntry: BmsItemEntry = {
                    id: `entry_${Date.now()}_${Math.random()}`,
                    categoryId: category.categoryId,
                    categoryTitle: category.categoryTitle,
                    itemName: "",
                    quantity: 0,
                    price: 0,
                    total: 0,
                };
                // Create new array instead of mutating
                const updatedCategory = {
                    ...category,
                    entries: [...category.entries, newEntry],
                };
                next.set(categoryId, updatedCategory);
            }
            return next;
        });
    };

    const updateBmsEntry = (
        categoryId: string,
        entryId: string,
        field: "itemName" | "quantity" | "price",
        value: string | number,
    ) => {
        setBmsCategories((prev) => {
            const next = new Map(prev);
            const category = next.get(categoryId);
            if (category) {
                const entryIndex = category.entries.findIndex(
                    (e) => e.id === entryId,
                );
                if (entryIndex !== -1) {
                    const updated = {
                        ...category.entries[entryIndex],
                        [field]: value,
                    };
                    if (field === "quantity" || field === "price") {
                        updated.total = updated.quantity * updated.price;
                    }
                    // Create new array with updated entry
                    const updatedEntries = [...category.entries];
                    updatedEntries[entryIndex] = updated;
                    const updatedCategory = {
                        ...category,
                        entries: updatedEntries,
                    };
                    next.set(categoryId, updatedCategory);
                }
            }
            return next;
        });
    };

    const removeBmsEntry = (categoryId: string, entryId: string) => {
        setBmsCategories((prev) => {
            const next = new Map(prev);
            const category = next.get(categoryId);
            if (category) {
                // Create new array without the removed entry
                const updatedCategory = {
                    ...category,
                    entries: category.entries.filter((e) => e.id !== entryId),
                };
                next.set(categoryId, updatedCategory);
            }
            return next;
        });
    };

    const validateStep2 = (): boolean => {
        for (const category of bmsCategories.values()) {
            if (category.entries.length === 0) {
                toast.error(
                    `Kategori "${category.categoryTitle}" harus memiliki minimal 1 barang`,
                );
                return false;
            }

            for (const entry of category.entries) {
                if (!entry.itemName.trim()) {
                    toast.error(
                        `Nama item di kategori "${category.categoryTitle}" wajib diisi`,
                    );
                    return false;
                }
                if (entry.quantity <= 0) {
                    toast.error(
                        `Quantity untuk "${entry.itemName}" wajib diisi`,
                    );
                    return false;
                }
                if (entry.price <= 0) {
                    toast.error(`Harga untuk "${entry.itemName}" wajib diisi`);
                    return false;
                }
            }
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateStep2()) return;
        // ... (logika submit sama seperti sebelumnya)
        toast.success("Laporan berhasil dibuat!");
        setTimeout(() => router.push("/reports/my-reports"), 1500);
    };

    const rusakItems = Array.from(checklist.values()).filter(
        (i) => i.condition === "rusak",
    );
    const kontraktorItems = rusakItems.filter(
        (i) => i.handler === "Kontraktor",
    );
    const grandTotalBms = Array.from(bmsCategories.values()).reduce(
        (sum, cat) => sum + cat.entries.reduce((s, e) => s + e.total, 0),
        0,
    );

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header
                variant="dashboard"
                title={step === 1 ? "Checklist Toko" : "Ringkasan Laporan"}
                showBackButton
                backHref={step === 2 ? undefined : "/dashboard"}
            />

            {/* MODAL KAMERA FULLSCREEN */}
            <CameraModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handlePhotoCaptured}
            />

            {/* MODAL PREVIEW FOTO */}
            {previewPhoto && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={closePreview}
                >
                    <div className="relative max-w-4xl max-h-full">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-12 right-0 text-white hover:bg-white/20 rounded-full"
                            onClick={closePreview}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={previewPhoto}
                            alt="Preview"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}

            <main className="flex-1 container mx-auto px-4 py-4 md:py-8 max-w-6xl">
                {/* ... (Bagian Progress Bar dan Header sama seperti sebelumnya) ... */}
                <div className="flex items-center justify-center gap-2 mb-6 md:mb-8">
                    {/* ... Progress Bar Code (tidak berubah) ... */}
                    <div
                        className={`flex items-center gap-2 ${step === 1 ? "text-primary" : "text-muted-foreground"}`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                            1
                        </div>
                        <span className="text-sm font-medium">Checklist</span>
                    </div>
                    <div className="w-16 h-0.5 bg-border" />
                    <div
                        className={`flex items-center gap-2 ${step === 2 ? "text-primary" : "text-muted-foreground"}`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                            2
                        </div>
                        <span className="text-sm font-medium">Ringkasan</span>
                    </div>
                </div>

                {/* DEVELOPMENT ONLY: Auto Fill Button */}
                {process.env.NODE_ENV === "development" && step === 1 && (
                    <div className="mb-4 flex justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-300"
                            onClick={autoFillForDevelopment}
                        >
                            <Zap className="mr-2 h-4 w-4" />
                            Auto Fill (Dev Only)
                        </Button>
                    </div>
                )}

                {step === 1 ? (
                    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-8">
                        {/* Kolom Kiri: Info Toko */}
                        <div className="md:col-span-4 md:order-1">
                            <div className="md:sticky md:top-24">
                                <Card>
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
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <InputGroup className="mt-2">
                                                <InputGroupAddon>
                                                    <Store className="h-4 w-4" />
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    id="store"
                                                    placeholder="Nama toko"
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
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <InputGroup className="mt-2">
                                                <InputGroupAddon>
                                                    <MapPin className="h-4 w-4" />
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    id="address"
                                                    placeholder="Alamat lengkap"
                                                    value={address}
                                                    onChange={(e) =>
                                                        setAddress(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </InputGroup>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Kolom Kanan: Checklist */}
                        <div className="md:col-span-8 md:order-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Checklist Kondisi
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Total{" "}
                                        {checklistCategories.reduce(
                                            (sum, cat) =>
                                                sum + cat.items.length,
                                            0,
                                        )}{" "}
                                        item
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {checklistCategories.map((category) => {
                                        const isOpen = openCategories.has(
                                            category.id,
                                        );
                                        const categoryItems =
                                            category.items.map((item) => ({
                                                ...item,
                                                ...checklist.get(item.id),
                                            }));
                                        const completedCount =
                                            categoryItems.filter(
                                                (item) => item.condition,
                                            ).length;
                                        const totalCount =
                                            category.items.length;
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
                                                                (
                                                                {completedCount}
                                                                /{totalCount})
                                                            </span>
                                                        </div>
                                                        <ChevronDown
                                                            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
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

                                                                        {condition ===
                                                                            "baik" && (
                                                                            <div className="space-y-3 pt-2 border-t animate-in slide-in-from-top-2">
                                                                                <div>
                                                                                    <Label className="text-sm">
                                                                                        Foto
                                                                                        Bukti{" "}
                                                                                        <span className="text-red-500">
                                                                                            *
                                                                                        </span>
                                                                                    </Label>

                                                                                    {/* TOMBOL UNTUK MEMBUKA COMPONENT KAMERA BARU */}
                                                                                    {!photo ? (
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="secondary"
                                                                                            className="w-full mt-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                                                                                            onClick={() =>
                                                                                                handleOpenCamera(
                                                                                                    item.id,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <Camera className="mr-2 h-4 w-4" />
                                                                                            Ambil
                                                                                            Foto
                                                                                            /
                                                                                            Galeri
                                                                                        </Button>
                                                                                    ) : (
                                                                                        <div className="mt-2 space-y-2">
                                                                                            {/* Thumbnail Preview */}
                                                                                            <div
                                                                                                className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-green-200 bg-green-50"
                                                                                                onClick={() =>
                                                                                                    handlePreviewPhoto(
                                                                                                        photo,
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                                                <img
                                                                                                    src={URL.createObjectURL(
                                                                                                        photo,
                                                                                                    )}
                                                                                                    alt="Preview"
                                                                                                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                                                                                                />
                                                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                                                                                                    <div className="bg-white/90 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">
                                                                                                        Klik
                                                                                                        untuk
                                                                                                        lihat
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            {/* File Info & Actions */}
                                                                                            <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg">
                                                                                                <div className="flex items-center gap-2 overflow-hidden">
                                                                                                    <CheckCircle2 className="h-4 w-4 text-green-700 shrink-0" />
                                                                                                    <div className="min-w-0">
                                                                                                        <p className="text-xs font-medium text-green-800 truncate">
                                                                                                            {
                                                                                                                photo.name
                                                                                                            }
                                                                                                        </p>
                                                                                                        <p className="text-[10px] text-green-600">
                                                                                                            {(
                                                                                                                photo.size /
                                                                                                                1024
                                                                                                            ).toFixed(
                                                                                                                0,
                                                                                                            )}{" "}
                                                                                                            KB
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <Button
                                                                                                    size="icon"
                                                                                                    variant="ghost"
                                                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                                                                                                    onClick={() =>
                                                                                                        removePhoto(
                                                                                                            item.id,
                                                                                                            item.name,
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <Trash2 className="h-4 w-4" />
                                                                                                </Button>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {condition ===
                                                                            "rusak" && (
                                                                            <div className="space-y-3 pt-2 border-t animate-in slide-in-from-top-2">
                                                                                <div>
                                                                                    <Label className="text-sm">
                                                                                        Foto
                                                                                        Kerusakan{" "}
                                                                                        <span className="text-red-500">
                                                                                            *
                                                                                        </span>
                                                                                    </Label>

                                                                                    {/* TOMBOL UNTUK MEMBUKA COMPONENT KAMERA BARU */}
                                                                                    {!photo ? (
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="secondary"
                                                                                            className="w-full mt-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                                                                                            onClick={() =>
                                                                                                handleOpenCamera(
                                                                                                    item.id,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <Camera className="mr-2 h-4 w-4" />
                                                                                            Ambil
                                                                                            Foto
                                                                                            /
                                                                                            Galeri
                                                                                        </Button>
                                                                                    ) : (
                                                                                        <div className="mt-2 space-y-2">
                                                                                            {/* Thumbnail Preview */}
                                                                                            <div
                                                                                                className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-green-200 bg-green-50"
                                                                                                onClick={() =>
                                                                                                    handlePreviewPhoto(
                                                                                                        photo,
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                                                <img
                                                                                                    src={URL.createObjectURL(
                                                                                                        photo,
                                                                                                    )}
                                                                                                    alt="Preview"
                                                                                                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                                                                                                />
                                                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                                                                                                    <div className="bg-white/90 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">
                                                                                                        Klik
                                                                                                        untuk
                                                                                                        lihat
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            {/* File Info & Actions */}
                                                                                            <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg">
                                                                                                <div className="flex items-center gap-2 overflow-hidden">
                                                                                                    <CheckCircle2 className="h-4 w-4 text-green-700 shrink-0" />
                                                                                                    <div className="min-w-0">
                                                                                                        <p className="text-xs font-medium text-green-800 truncate">
                                                                                                            {
                                                                                                                photo.name
                                                                                                            }
                                                                                                        </p>
                                                                                                        <p className="text-[10px] text-green-600">
                                                                                                            {(
                                                                                                                photo.size /
                                                                                                                1024
                                                                                                            ).toFixed(
                                                                                                                0,
                                                                                                            )}{" "}
                                                                                                            KB
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <Button
                                                                                                    size="icon"
                                                                                                    variant="ghost"
                                                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                                                                                                    onClick={() =>
                                                                                                        removePhoto(
                                                                                                            item.id,
                                                                                                            item.name,
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <Trash2 className="h-4 w-4" />
                                                                                                </Button>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                                <div>
                                                                                    <Label className="text-sm">
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
                                                                                        <SelectTrigger className="mt-1">
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
                        </div>
                        {/* ... (Bagian Tombol Aksi Bawah sama) ... */}
                        <div className="md:col-span-8 md:col-start-5 md:order-3 mt-4 md:mt-0">
                            <ButtonGroup
                                className="w-full"
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
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-8">
                        <div className="md:col-span-4 md:order-1">
                            <div className="md:sticky md:top-24">
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
                            </div>
                        </div>
                        <div className="md:col-span-8 md:order-2 space-y-6">
                            {bmsCategories.size > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Estimasi Harga BMS
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Tambahkan barang untuk setiap
                                            kategori
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="border rounded-lg overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/30">
                                                        <TableHead className="w-12">
                                                            No
                                                        </TableHead>
                                                        <TableHead>
                                                            Item
                                                        </TableHead>
                                                        <TableHead className="w-24">
                                                            Qty
                                                        </TableHead>
                                                        <TableHead className="w-32">
                                                            Harga
                                                        </TableHead>
                                                        <TableHead className="w-32">
                                                            Jumlah
                                                        </TableHead>
                                                        <TableHead className="w-12"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {Array.from(
                                                        bmsCategories.values(),
                                                    ).map(
                                                        (category, catIdx) => (
                                                            <Fragment
                                                                key={
                                                                    category.categoryId
                                                                }
                                                            >
                                                                {/* Category Header Row */}
                                                                <TableRow
                                                                    key={`cat-${category.categoryId}`}
                                                                    className="bg-primary/5 hover:bg-primary/10"
                                                                >
                                                                    <TableCell className="font-bold">
                                                                        {catIdx +
                                                                            1}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        colSpan={
                                                                            5
                                                                        }
                                                                        className="font-bold"
                                                                    >
                                                                        {
                                                                            category.categoryTitle
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>

                                                                {/* Category Items */}
                                                                {category.entries.map(
                                                                    (entry) => (
                                                                        <TableRow
                                                                            key={
                                                                                entry.id
                                                                            }
                                                                        >
                                                                            <TableCell></TableCell>
                                                                            <TableCell className="pl-8">
                                                                                <Input
                                                                                    type="text"
                                                                                    placeholder="Nama barang"
                                                                                    value={
                                                                                        entry.itemName
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        updateBmsEntry(
                                                                                            category.categoryId,
                                                                                            entry.id,
                                                                                            "itemName",
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        )
                                                                                    }
                                                                                    className="h-8"
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Input
                                                                                    type="number"
                                                                                    min="0"
                                                                                    placeholder="0"
                                                                                    value={
                                                                                        entry.quantity ||
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        updateBmsEntry(
                                                                                            category.categoryId,
                                                                                            entry.id,
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
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Input
                                                                                    type="number"
                                                                                    min="0"
                                                                                    placeholder="0"
                                                                                    value={
                                                                                        entry.price ||
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        updateBmsEntry(
                                                                                            category.categoryId,
                                                                                            entry.id,
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
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell className="text-right font-medium">
                                                                                Rp{" "}
                                                                                {entry.total.toLocaleString(
                                                                                    "id-ID",
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Button
                                                                                    type="button"
                                                                                    size="icon"
                                                                                    variant="ghost"
                                                                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                                    onClick={() =>
                                                                                        removeBmsEntry(
                                                                                            category.categoryId,
                                                                                            entry.id,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ),
                                                                )}

                                                                {/* Add Item Button Row */}
                                                                <TableRow
                                                                    key={`add-${category.categoryId}`}
                                                                    className="hover:bg-muted/30"
                                                                >
                                                                    <TableCell></TableCell>
                                                                    <TableCell
                                                                        colSpan={
                                                                            5
                                                                        }
                                                                        className="pl-8"
                                                                    >
                                                                        <Button
                                                                            type="button"
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            className="text-primary hover:text-primary hover:bg-primary/10"
                                                                            onClick={() =>
                                                                                addBmsEntry(
                                                                                    category.categoryId,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Plus className="h-4 w-4 mr-1" />
                                                                            Tambah
                                                                            barang
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>

                                                                {/* Category Subtotal */}
                                                                {category
                                                                    .entries
                                                                    .length >
                                                                    0 && (
                                                                    <TableRow
                                                                        key={`subtotal-${category.categoryId}`}
                                                                        className="bg-muted/20"
                                                                    >
                                                                        <TableCell></TableCell>
                                                                        <TableCell
                                                                            colSpan={
                                                                                3
                                                                            }
                                                                            className="text-right font-semibold"
                                                                        >
                                                                            Subtotal{" "}
                                                                            {
                                                                                category.categoryTitle
                                                                            }
                                                                            :
                                                                        </TableCell>
                                                                        <TableCell className="text-right font-semibold text-primary">
                                                                            Rp{" "}
                                                                            {category.entries
                                                                                .reduce(
                                                                                    (
                                                                                        sum,
                                                                                        e,
                                                                                    ) =>
                                                                                        sum +
                                                                                        e.total,
                                                                                    0,
                                                                                )
                                                                                .toLocaleString(
                                                                                    "id-ID",
                                                                                )}
                                                                        </TableCell>
                                                                        <TableCell></TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </Fragment>
                                                        ),
                                                    )}

                                                    {/* Grand Total */}
                                                    <TableRow className="bg-primary/10 font-bold">
                                                        <TableCell></TableCell>
                                                        <TableCell
                                                            colSpan={3}
                                                            className="text-right text-base"
                                                        >
                                                            Total Keseluruhan:
                                                        </TableCell>
                                                        <TableCell className="text-right text-base text-primary">
                                                            Rp{" "}
                                                            {grandTotalBms.toLocaleString(
                                                                "id-ID",
                                                            )}
                                                        </TableCell>
                                                        <TableCell></TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            {kontraktorItems.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Item Kontraktor (
                                            {kontraktorItems.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableBody>
                                                {kontraktorItems.map(
                                                    (item, i) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell>
                                                                {i + 1}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.name}
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                        <div className="md:col-span-8 md:col-start-5 md:order-3 mt-4 md:mt-0">
                            <ButtonGroup className="w-full">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setStep(1)}
                                >
                                    Kembali
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
