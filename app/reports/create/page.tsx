"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
} from "@/components/ui/input-group";
import { ButtonGroup } from "@/components/ui/button-group";
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from "@/components/ui/empty";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Camera, MapPin, Tag, DollarSign } from "lucide-react";

// Validasi schema dengan Zod
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
    store: z.string().min(1, "Pilih toko terlebih dahulu"),
    damageType: z.string().min(1, "Pilih jenis kerusakan"),
    location: z
        .string()
        .min(3, "Lokasi minimal 3 karakter")
        .max(100, "Lokasi maksimal 100 karakter"),
    description: z
        .string()
        .min(10, "Deskripsi minimal 10 karakter")
        .max(500, "Deskripsi maksimal 500 karakter"),
    estimatedCost: z
        .number()
        .min(0, { message: "Biaya tidak boleh negatif" })
        .max(100000000, { message: "Biaya maksimal Rp 100.000.000" }),
    images: z
        .array(z.instanceof(File))
        .max(5, "Maksimal 5 foto")
        .optional()
        .refine(
            (files) => {
                if (!files || files.length === 0) return true;
                return files.every((file) => file.size <= MAX_FILE_SIZE);
            },
            { message: "Ukuran file maksimal 5MB per foto" },
        )
        .refine(
            (files) => {
                if (!files || files.length === 0) return true;
                return files.every((file) =>
                    ACCEPTED_IMAGE_TYPES.includes(file.type),
                );
            },
            { message: "Hanya file JPG, JPEG, dan PNG yang diperbolehkan" },
        ),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateReportPage() {
    const router = useRouter();
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            store: "",
            damageType: "",
            location: "",
            description: "",
            estimatedCost: 0,
            images: [],
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const currentImages = form.getValues("images") || [];

        if (files.length > 0) {
            const totalImages = currentImages.length + files.length;

            if (totalImages > 5) {
                toast.error("Maksimal 5 foto!");
                return;
            }

            // Validate file size and type
            const invalidFiles = files.filter(
                (file) =>
                    file.size > MAX_FILE_SIZE ||
                    !ACCEPTED_IMAGE_TYPES.includes(file.type),
            );

            if (invalidFiles.length > 0) {
                toast.error(
                    "Beberapa file tidak valid. Periksa ukuran (max 5MB) dan format (JPG, PNG)",
                );
                return;
            }

            // Update form
            form.setValue("images", [...currentImages, ...files], {
                shouldValidate: true,
            });

            // Create preview URLs
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrls((prev) => [
                        ...prev,
                        reader.result as string,
                    ]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        const currentImages = form.getValues("images") || [];
        form.setValue(
            "images",
            currentImages.filter((_, i) => i !== index),
            { shouldValidate: true },
        );
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = (data: FormValues) => {
        // TODO: Handle form submission with backend
        console.log("Form Data:", data);

        toast.success("Laporan berhasil dibuat!", {
            description: `Laporan untuk ${data.store} telah dikirim`,
        });

        // Redirect to dashboard after short delay
        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header
                variant="dashboard"
                title="Buat Laporan"
                description="Laporkan kerusakan atau maintenance"
                showBackButton
                backHref="/dashboard"
            />

            <main className="flex-1 container mx-auto px-4 py-4 md:py-6 max-w-2xl">
                {/* Info Badge */}
                <div className="mb-4">
                    <Badge variant="outline" className="text-xs">
                        Maintenance Support
                    </Badge>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Toko */}
                        <Card>
                            <CardHeader className="p-4 pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    Informasi Toko
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-3">
                                <FormField
                                    control={form.control}
                                    name="store"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Nama Toko{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih toko" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="store1">
                                                        Alfamart Sudirman
                                                    </SelectItem>
                                                    <SelectItem value="store2">
                                                        Alfamart Gatot Subroto
                                                    </SelectItem>
                                                    <SelectItem value="store3">
                                                        Alfamart Thamrin
                                                    </SelectItem>
                                                    <SelectItem value="store4">
                                                        Alfamart Kuningan
                                                    </SelectItem>
                                                    <SelectItem value="store5">
                                                        Alfamart Casablanca
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Detail Kerusakan */}
                        <Card>
                            <CardHeader className="p-4 pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-primary" />
                                    Detail Kerusakan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-3">
                                {/* Jenis Kerusakan */}
                                <FormField
                                    control={form.control}
                                    name="damageType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Jenis Kerusakan{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih jenis kerusakan" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="ac">
                                                        AC / Pendingin
                                                    </SelectItem>
                                                    <SelectItem value="electrical">
                                                        Kelistrikan
                                                    </SelectItem>
                                                    <SelectItem value="plumbing">
                                                        Air / Plumbing
                                                    </SelectItem>
                                                    <SelectItem value="building">
                                                        Bangunan / Struktur
                                                    </SelectItem>
                                                    <SelectItem value="equipment">
                                                        Peralatan / Equipment
                                                    </SelectItem>
                                                    <SelectItem value="furniture">
                                                        Furniture
                                                    </SelectItem>
                                                    <SelectItem value="other">
                                                        Lainnya
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Lokasi Detail */}
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Lokasi Spesifik{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <InputGroup>
                                                    <InputGroupAddon>
                                                        <MapPin className="h-4 w-4" />
                                                    </InputGroupAddon>
                                                    <InputGroupInput
                                                        placeholder="Contoh: Ruang kasir, Gudang belakang"
                                                        {...field}
                                                    />
                                                </InputGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Deskripsi */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Deskripsi Kerusakan{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Jelaskan detail kerusakan yang terjadi"
                                                    rows={4}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Estimasi Biaya */}
                        <Card>
                            <CardHeader className="p-4 pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                    Estimasi Biaya
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-3">
                                <FormField
                                    control={form.control}
                                    name="estimatedCost"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Perkiraan Biaya (Rp){" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    min="0"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseFloat(
                                                                e.target.value,
                                                            ) || 0,
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Masukkan estimasi biaya
                                                perbaikan dalam Rupiah
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Upload Foto */}
                        <Card>
                            <CardHeader className="p-4 pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Camera className="h-4 w-4 text-primary" />
                                    Foto Kerusakan
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Upload foto untuk dokumentasi (Maks. 5 foto)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-3">
                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>
                                                Foto (Opsional)
                                            </FormLabel>
                                            <FormControl>
                                                <div className="space-y-3">
                                                    <label
                                                        htmlFor="imageUpload"
                                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                                    >
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <Upload className="h-8 w-8 text-muted-foreground" />
                                                            <p className="text-sm text-muted-foreground">
                                                                Klik untuk
                                                                upload foto
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                PNG, JPG, JPEG
                                                                (Maks. 5MB per
                                                                foto)
                                                            </p>
                                                        </div>
                                                        <input
                                                            id="imageUpload"
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={
                                                                handleImageChange
                                                            }
                                                            className="hidden"
                                                        />
                                                    </label>

                                                    {/* Preview Images */}
                                                    {previewUrls.length > 0 ? (
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                            {previewUrls.map(
                                                                (
                                                                    url,
                                                                    index,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="relative aspect-square rounded-lg border overflow-hidden group"
                                                                    >
                                                                        <Image
                                                                            src={
                                                                                url
                                                                            }
                                                                            alt={`Preview ${index + 1}`}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="destructive"
                                                                            size="icon"
                                                                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            onClick={() =>
                                                                                removeImage(
                                                                                    index,
                                                                                )
                                                                            }
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <Empty className="h-32 border-0 p-4">
                                                            <EmptyHeader>
                                                                <EmptyMedia variant="icon">
                                                                    <Camera className="h-5 w-5" />
                                                                </EmptyMedia>
                                                                <EmptyTitle className="text-sm">
                                                                    Belum ada
                                                                    foto
                                                                </EmptyTitle>
                                                                <EmptyDescription className="text-xs">
                                                                    Upload foto
                                                                    kerusakan
                                                                    untuk
                                                                    dokumentasi
                                                                </EmptyDescription>
                                                            </EmptyHeader>
                                                        </Empty>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Submit Buttons */}
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
                                type="submit"
                                className="flex-1"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? "Mengirim..."
                                    : "Submit Laporan"}
                            </Button>
                        </ButtonGroup>
                    </form>
                </Form>
            </main>

            <Footer />
        </div>
    );
}
