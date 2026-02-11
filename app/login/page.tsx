"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    InputGroup,
    InputGroupInput,
    InputGroupButton,
    InputGroupAddon,
} from "@/components/ui/input-group";
import { ButtonGroup } from "@/components/ui/button-group";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// Validation schema dengan Zod
const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email wajib diisi" })
        .email({ message: "Format email tidak valid" }),
    password: z
        .string()
        .min(6, { message: "Password minimal 6 karakter" })
        .max(50, { message: "Password maksimal 50 karakter" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        // TODO: Handle authentication with backend
        console.log("Login attempt:", { email: data.email });

        // Simulate login success
        toast.success("Login berhasil!", {
            description: "Selamat datang di Sparta Maintenance",
        });

        // Redirect to dashboard after short delay
        setTimeout(() => {
            router.push("/dashboard");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header
                variant="dashboard"
                title="Kembali"
                description=""
                showBackButton
                backHref="/"
            />

            {/* Login Form */}
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-lg ring-0 shadow-[0_0_0_0]">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl md:text-4xl font-bold">
                            Login
                        </CardTitle>
                        <CardDescription className="text-sm md:text-lg">
                            Masukkan kredensial Anda untuk mengakses sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                className="space-y-4"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        type="email"
                                                        placeholder="Masukkan email"
                                                        {...field}
                                                    />
                                                    <InputGroupAddon align="inline-start">
                                                        <Mail className="h-4 w-4" />
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <InputGroup>
                                                    <InputGroupAddon align="inline-start">
                                                        <Lock className="h-4 w-4" />
                                                    </InputGroupAddon>
                                                    <InputGroupInput
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        placeholder="Masukkan password"
                                                        {...field}
                                                        onChange={(e) => {
                                                            const uppercased =
                                                                e.target.value.toUpperCase();
                                                            field.onChange(
                                                                uppercased,
                                                            );
                                                        }}
                                                    />
                                                    <InputGroupButton
                                                        size="icon-sm"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword,
                                                            )
                                                        }
                                                        aria-label={
                                                            showPassword
                                                                ? "Hide password"
                                                                : "Show password"
                                                        }
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </InputGroupButton>
                                                </InputGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Button */}
                                <ButtonGroup className="w-full mt-2">
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        size="lg"
                                        disabled={form.formState.isSubmitting}
                                    >
                                        {form.formState.isSubmitting
                                            ? "Memproses..."
                                            : "Login"}
                                    </Button>
                                </ButtonGroup>

                                {/* Divider */}
                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">
                                            Butuh bantuan?
                                        </span>
                                    </div>
                                </div>

                                {/* User Manual Link */}
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    asChild
                                >
                                    <Link href="/user-manual">
                                        Lihat User Manual
                                    </Link>
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </div>
    );
}
