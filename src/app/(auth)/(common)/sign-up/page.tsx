"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
  }),
  passwordConfirmation: z.string(),
  marketingAccept: z.boolean().default(false).optional(),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords don't match",
  path: ["passwordConfirmation"],
});

export default function SignUpPage() {
  const [verificationSent, setVerificationSent] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
      marketingAccept: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post('http://localhost:8080/wordwaves/users', {
        email: values.email,
        password: values.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.data && response.data.code === 1000) {
        setVerificationSent(true);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  if (verificationSent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Please check your email</h2>
          <p className="mb-4">A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account.</p>
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or
            <Button variant="link" className="p-0 h-auto font-normal" onClick={() => setVerificationSent(false)}>try signing up again</Button>.
          </p>
        </div>
      </div>
    );
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Confirmation</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="marketingAccept"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I want to receive emails about events, product updates and company announcements.
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="text-sm text-gray-500">
          By creating an account, you agree to our
          <a href="#" className="text-gray-700 underline"> terms and conditions </a>
          and
          <a href="#" className="text-gray-700 underline"> privacy policy</a>.
        </div>

        <div className="flex items-center justify-between">
          <Button type="submit" className="text-white">Create an account</Button>
          <p className="text-sm text-gray-500">
            Already have an account?
            <a href="#" className="text-gray-700 underline"> Log in</a>.
          </p>
        </div>
      </form>
    </Form>
  );
}
