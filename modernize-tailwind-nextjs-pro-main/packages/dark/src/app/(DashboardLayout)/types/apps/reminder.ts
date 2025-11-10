export interface Reminder {
  id: string;
  title: string;
  description?: string;
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
}

export interface UpdateReminderInput {
  id: string;
  title?: string;
  description?: string;
  senderEmail?: string;
  senderName?: string;
  receiverEmail?: string;
  intervalType?: string;
  reminderStartDate?: string;
  reminderEndDate?: string;
  sendReminderAt?: string;
  phoneNo?: string;
  active?: boolean;
  completed?: boolean;
}
