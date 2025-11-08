
"use client"
import React, { createContext, useState } from "react";
import { Reminder } from "@/app/(DashboardLayout)/types/apps/reminder";

// This is a placeholder for the ReminderContext.
// The actual implementation is missing from the repository.

export const ReminderContext = createContext<{
  reminders: Reminder[];
}>({
  reminders: [],
});

const ReminderProvider = ({ children }: { children: React.ReactNode }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  return (
    <ReminderContext.Provider value={{ reminders }}>
      {children}
    </ReminderContext.Provider>
  );
};

export default ReminderProvider;
