import { NextResponse } from "next/server";
import { Reminder } from "@/app/(DashboardLayout)/types/apps/reminder";

const reminders: Reminder[] = [
    {
        id: "1",
        title: "Submit timesheet",
        description: "Submit the timesheet for the previous week",
        senderEmail: "test@test.com",
        senderName: "Test",
        receiverEmail: "test@test.com",
        intervalType: "Weekly",
        reminderStartDate: "2025-09-20",
        reminderEndDate: "2025-09-20",
        sendReminderAt: "09:00",
        phoneNo: "1234567890",
        active: true,
        completed: false,
    },
    {
        id: "2",
        title: "Client meeting preparation",
        description: "Prepare for the meeting with the client",
        senderEmail: "test@test.com",
        senderName: "Test",
        receiverEmail: "test@test.com",
        intervalType: "Daily",
        reminderStartDate: "2025-09-18",
        reminderEndDate: "2025-09-18",
        sendReminderAt: "14:00",
        phoneNo: "1234567890",
        active: true,
        completed: false,
    },
    {
        id: "3",
        title: "Update website content",
        description: "Update the content of the website",
        senderEmail: "test@test.com",
        senderName: "Test",
        receiverEmail: "test@test.com",
        intervalType: "Monthly",
        reminderStartDate: "2025-09-25",
        reminderEndDate: "2025-09-25",
        sendReminderAt: "11:00",
        phoneNo: "1234567890",
        active: false,
        completed: true,
    },
];

export async function GET() {
    return NextResponse.json(reminders);
}
