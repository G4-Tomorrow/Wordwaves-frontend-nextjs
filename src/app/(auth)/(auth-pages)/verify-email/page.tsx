"use client";

import { Button } from "@/components/ui/button";
import http from '@/utils/http';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

export default function VerifyEmailPage() {
    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'alreadyVerified'>('loading');
    const searchParams = useSearchParams();

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');
            if (!token) {
                setVerificationStatus('error');
                return;
            }

            try {
                const response = await http.post(
                    `users/verify`,
                    { token: token },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.data.code === 1000) {
                    setVerificationStatus('success');
                } else if (response.data.code === 1001) { 
                    setVerificationStatus('alreadyVerified');
                } else {
                    setVerificationStatus('error');
                }
            } catch (error) {
                console.error('Xác nhận email thất bại:', error);
                setVerificationStatus('error');
            }
        };

        verifyEmail();
    }, [searchParams]);

    const renderContent = () => {
        switch (verificationStatus) {
            case 'loading':
                return <p>Đang xác nhận địa chỉ email của bạn...</p>;
            case 'success':
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Xác Nhận Email Thành Công!</h2>
                        <p className="mb-4">Email của bạn đã được xác nhận. Bạn có thể đăng nhập vào tài khoản của mình ngay bây giờ.</p>
                        <Button onClick={() => window.location.href = '/sign-in'}>Đăng nhập</Button>
                    </>
                );
            case 'alreadyVerified':
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Email Đã Được Xác Nhận</h2>
                        <p className="mb-4">Email của bạn đã được xác nhận trước đó. Bạn có thể đăng nhập vào tài khoản của mình.</p>
                        <Button onClick={() => window.location.href = '/sign-in'}>Đăng nhập</Button>
                    </>
                );
            case 'error':
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Xác Nhận Email Thất Bại</h2>
                        <p className="mb-4">Chúng tôi không thể xác nhận địa chỉ email của bạn. Có thể liên kết xác nhận đã hết hạn hoặc không hợp lệ.</p>
                        <Button onClick={() => window.location.href = '/sign-up'}>Quay lại Đăng ký</Button>
                    </>
                );
        }
    };

    return (
        <Suspense>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                {renderContent()}
            </div>
            </div>
        </Suspense>
    );
}
