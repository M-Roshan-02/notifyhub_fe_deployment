import React from 'react'
import CardBox from "@/app/components/shared/CardBox";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import EditReminderPage from '@/app/components/apps/invoice/Edit-invoice/index';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Reminder",
};

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Edit Reminder",
    },
];

interface PageProps {
    params: {
        slug: string;
    };
}

const Page = ({ params }: PageProps) => {
    return (
        <>
            <BreadcrumbComp title="Edit Reminder" items={BCrumb} />
            <CardBox>
                <EditReminderPage reminderId={params.slug} />
            </CardBox>
        </>
    )
}

export default Page;