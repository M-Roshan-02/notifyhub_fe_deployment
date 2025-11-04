import React from 'react'
import CardBox from "@/app/components/shared/CardBox";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import { UserDataProvider } from '@/app/context/UserDataContext';
import ReminderDetail from '@/app/components/apps/invoice/Invoice-detail/index'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reminder Details",
};

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Reminder Details",
    },
];

function ReminderDetailPage() {
    return (
        <UserDataProvider>
            <BreadcrumbComp title="Reminder Details" items={BCrumb} />
            <CardBox>
                <ReminderDetail />
            </CardBox>
        </UserDataProvider>
    )
}
export default ReminderDetailPage;