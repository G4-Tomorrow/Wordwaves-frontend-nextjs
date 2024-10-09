"use client"

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const searchParams = useSearchParams();

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');
            if (!token) {
                setVerificationStatus('error');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/verify-email?token=${token}`);
                if (response.status === 200) {
                    setVerificationStatus('success');
                } else {
                    setVerificationStatus('error');
                }
            } catch (error) {
                console.error('Email verification failed:', error);
                setVerificationStatus('error');
            }
        };

        verifyEmail();
    }, [searchParams]);

    const renderContent = () => {
        switch (verificationStatus) {
            case 'loading':
                return <p>Verifying your email address...</p>;
            case 'success':
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Email Verified Successfully!</h2>
                        <p className="mb-4">Your email has been verified. You can now log in to your account.</p>
                        <Button onClick={() => window.location.href = '/sign-in'}>Go to Sign In</Button>
                    </>
                );
            case 'error':
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Email Verification Failed</h2>
                        <p className="mb-4">We couldn't verify your email address. The verification link may have expired or is invalid.</p>
                        <Button onClick={() => window.location.href = '/sign-up'}>Back to Sign Up</Button>
                    </>
                );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                {renderContent()}
            </div>
        </div>
    );
}