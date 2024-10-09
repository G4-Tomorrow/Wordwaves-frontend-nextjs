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
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string(),
});

export default function SignInPage() {
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post('http://localhost:8080/wordwaves/auth/login', {
        email: values.email,
        password: values.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, 
      });

      if (response.data && response.data.code === 1000) {
        setLoginStatus("Login successful!");
       
        localStorage.setItem('accessToken', response.data.result.accessToken);
       
        localStorage.setItem('user', JSON.stringify(response.data.result.user));
     
        router.push('/');
      } else {
        setLoginStatus("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginStatus("An error occurred. Please try again.");
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





        <div className="text-sm text-gray-500">
          By creating an account, you agree to our
          <a href="#" className="text-gray-700 underline"> terms and conditions </a>
          and
          <a href="#" className="text-gray-700 underline"> privacy policy</a>.
        </div>

        <div className="flex items-center justify-between">
          <Button type="submit" className="text-white">Sign In</Button>

          {loginStatus && (
            <p className={`text-center ${loginStatus.includes("successful") ? "text-green-600" : "text-red-600"}`}>
              {loginStatus}
            </p>
          )}
          <p className="text-sm text-gray-500">
            Already have an account?
            <a href="#" className="text-gray-700 underline"> Log in</a>.
          </p>
        </div>
        <p className="text-sm text-gray-500 text-center">
          <a href="/forgot-password" className="text-gray-700 underline">Forgot your password?</a>
        </p>
      </form>
    </Form>
  );
}
