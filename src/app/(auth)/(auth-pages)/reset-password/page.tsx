"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

const formSchema = z.object({
    newPassword: z.string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/, {
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        }),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
    const [resetStatus, setResetStatus] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await axios.put(`http://localhost:8080/wordwaves/users/reset-password?token=${token}`, {
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data && response.data.code === 1000) {
                setResetStatus("Password reset successful. Redirecting to login page...");
                setTimeout(() => {
                    router.push('/sign-in');
                }, 3000);
            } else {
                setResetStatus("Password reset failed. Please try again.");
            }
        } catch (error) {
            console.error('Password reset failed:', error);
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400) {
                    setResetStatus("Invalid password format. Please ensure your password meets the requirements.");
                } else {
                    setResetStatus("An error occurred. Please try again.");
                }
            } else {
                setResetStatus("An unexpected error occurred. Please try again.");
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                            <p className="text-sm text-gray-500">Password must contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.</p>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="text-white">Reset Password</Button>

                {resetStatus && (
                    <p className={`text-center ${resetStatus.includes("successful") ? "text-green-600" : "text-red-600"}`}>
                        {resetStatus}
                    </p>
                )}
            </form>
        </Form>
    );
}