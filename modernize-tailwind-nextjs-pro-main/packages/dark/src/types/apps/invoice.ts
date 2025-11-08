export interface Reminder {
  id: string;
  title: string;
  description: string;
  senderEmail: string;
  senderName: string;
  receiverEmail: string;
  intervalType: string;
  reminderStartDate: string;
  reminderEndDate: string;
  sendReminderAt: string;
  phoneNo: string;
  active: boolean;
  completed: boolean;
  status: string;
  userId?: string; // Assuming userId is needed for create, but not returned by queries
}