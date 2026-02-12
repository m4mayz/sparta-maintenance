"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logoutAction } from "./action";
import { useTransition } from "react";

export function LogoutButton() {
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();
        });
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            className="ml-auto md:ml-0"
            onClick={handleLogout}
            disabled={isPending}
        >
            <LogOut className="mr-2 h-4 w-4" />
            {isPending ? "Logging out..." : "Logout"}
        </Button>
    );
}
