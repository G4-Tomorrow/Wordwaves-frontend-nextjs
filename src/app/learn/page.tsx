'use client';
import { Button } from '@/components/ui/button';
import { Brain, Book, History, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const modes = [
    {
        title: 'Collection Learning',
        description: 'Learn new words from your collections',
        icon: Book,
        href: '/learn/collection/new',
        color: 'from-blue-500 to-indigo-500'
    },
    {
        title: 'Topic Learning',
        description: 'Learn new words by topics',
        icon: Brain,
        href: '/learn/topic/new',
        color: 'from-emerald-500 to-green-500'
    },
    {
        title: 'Collection Review',
        description: 'Review words from your collections',
        icon: History,
        href: '/learn/collection/review',
        color: 'from-orange-500 to-red-500'
    },
    {
        title: 'Topic Review',
        description: 'Review words by topics',
        icon: Sparkles,
        href: '/learn/topic/review',
        color: 'from-purple-500 to-pink-500'
    }
];

export default function LearnPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-6 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Choose Your Learning Mode</h1>
                    <p className="text-xl text-gray-700">Find the best way to enhance your vocabulary journey</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {modes.map((mode, index) => (
                        <motion.div
                            key={mode.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={mode.href} className="block">
                                <div className="relative group overflow-hidden rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 bg-white">
                                    {/* Gradient background */}
                                    <div className={`absolute inset-0 bg-gradient-to-r ${mode.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

                                    <div className="relative z-10 p-8 flex items-start space-x-6">
                                        {/* Icon */}
                                        <div className={`p-4 rounded-xl bg-gradient-to-r ${mode.color} text-white shadow-md`}>
                                            <mode.icon className="w-8 h-8" />
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{mode.title}</h2>
                                            <p className="text-gray-700 text-base">{mode.description}</p>
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <div className="relative z-10 mt-6 flex justify-end px-8 pb-6">
                                        <Button
                                            variant="ghost"
                                            className="group-hover:bg-gradient-to-r group-hover:from-gray-100 group-hover:to-gray-200 text-sm font-medium"
                                        >
                                            Start Learning →
                                        </Button>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
