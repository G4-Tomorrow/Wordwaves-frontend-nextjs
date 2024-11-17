"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, BookOpen, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/admin/stat-card";
import { PeriodChart } from "@/components/admin/period-chart";
import { DataCard } from "@/components/admin/data-card";

const MOCK_STATS = [
  {
    title: "Total Users",
    value: "1,234",
    description: "+20% from last month",
    icon: Users,
  },
  {
    title: "Total Words",
    value: "5,678",
    description: "+100 new words this week",
    icon: BookOpen,
  },
  {
    title: "Daily Active Users",
    value: "573",
    description: "+5% from yesterday",
    icon: TrendingUp,
  },
  {
    title: "Words Learned Today",
    value: "2,345",
    description: "Across all users",
    icon: Calendar,
  },
];

const MOCK_CHART_DATA = {
  daily: [
    { name: "Mon", total: 120 },
    { name: "Tue", total: 150 },
    { name: "Wed", total: 200 },
    { name: "Thu", total: 180 },
    { name: "Fri", total: 250 },
    { name: "Sat", total: 300 },
    { name: "Sun", total: 280 },
  ],
  weekly: [
    { name: "Week 1", total: 1200 },
    { name: "Week 2", total: 1500 },
    { name: "Week 3", total: 2000 },
    { name: "Week 4", total: 1800 },
  ],
  monthly: [
    { name: "Jan", total: 5000 },
    { name: "Feb", total: 5500 },
    { name: "Mar", total: 6000 },
    { name: "Apr", total: 5800 },
    { name: "May", total: 6500 },
    { name: "Jun", total: 7000 },
  ],
};

const MOCK_DATA = {
  daily: {
    topWords: [
      { label: "Example", value: "50 times" },
      { label: "Word", value: "45 times" },
      { label: "Vocabulary", value: "40 times" },
    ],
    engagement: [
      { label: "Average session duration", value: "15 minutes" },
      { label: "Words learned per session", value: "12" },
      { label: "Retention rate", value: "85%" },
    ],
  },
  weekly: {
    topWords: [
      { label: "Weekly Top", value: "350 times" },
      { label: "Popular", value: "245 times" },
      { label: "Common", value: "180 times" },
    ],
    engagement: [
      { label: "Average session duration", value: "2 hours" },
      { label: "Words learned per week", value: "84" },
      { label: "Weekly retention", value: "78%" },
    ],
  },
  monthly: {
    topWords: [
      { label: "Monthly Best", value: "1500 times" },
      { label: "Frequent", value: "1200 times" },
      { label: "Regular", value: "900 times" },
    ],
    engagement: [
      { label: "Average session duration", value: "8 hours" },
      { label: "Words learned per month", value: "360" },
      { label: "Monthly retention", value: "72%" },
    ],
  },
};

const TIME_PERIODS = ["daily", "weekly", "monthly"] as const;

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<(typeof TIME_PERIODS)[number]>("daily");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {MOCK_STATS.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <Tabs
        value={selectedPeriod}
        onValueChange={(value) =>
          setSelectedPeriod(value as (typeof TIME_PERIODS)[number])
        }
        className="space-y-4"
      >
        <TabsList>
          {TIME_PERIODS.map((period) => (
            <TabsTrigger key={period} value={period} className="capitalize">
              {period}
            </TabsTrigger>
          ))}
        </TabsList>

        {TIME_PERIODS.map((period) => (
          <TabsContent key={period} value={period} className="space-y-4">
            <PeriodChart period={period} data={MOCK_CHART_DATA[period]} />

            <div className="grid gap-4 md:grid-cols-2">
              <DataCard
                title="Top Learned Words"
                data={MOCK_DATA[period].topWords}
              />
              <DataCard
                title="User Engagement"
                data={MOCK_DATA[period].engagement}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-6">
        <Button asChild>
          <Link href="/admin/vocabulary">Manage Vocabulary</Link>
        </Button>
      </div>
    </div>
  );
}
