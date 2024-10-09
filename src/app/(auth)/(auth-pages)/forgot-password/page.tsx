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

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
});

export default function ForgotPasswordPage() {
    const [requestStatus, setRequestStatus] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await axios.post('http://localhost:8080/wordwaves/users/forgot-password', {
                email: values.email,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data && response.data.code === 1000) {
                setRequestStatus("Password reset request successful. Please check your email.");
            } else {
                setRequestStatus("Password reset request failed. Please try again.");
            }
        } catch (error) {
            console.error('Password reset request failed:', error);
            setRequestStatus("An error occurred. Please try again.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="johndoe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="text-white">Reset Password</Button>

                {requestStatus && (
                    <p className={`text-center ${requestStatus.includes("successful") ? "text-green-600" : "text-red-600"}`}>
                        {requestStatus}
                    </p>
                )}

                <p className="text-sm text-gray-500">
                    Remember your password?
                    <a href="/sign-in" className="text-gray-700 underline"> Sign in</a>.
                </p>
            </form>
        </Form>
    );
}