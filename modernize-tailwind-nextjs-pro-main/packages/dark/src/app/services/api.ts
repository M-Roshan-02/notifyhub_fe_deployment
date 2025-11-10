import { client } from '@/app/libs/apollo-client';
import { gql } from '@apollo/client';
import { Reminder } from '@/types/apps/invoice';

// Assuming these interfaces for inputs
interface CreateReminderInput {
    title: string;
    description?: string;
    senderEmail: string;
    senderName?: string;
    receiverEmail: string;
    intervalType?: string;
    reminderStartDate?: string; // DateTime
    reminderEndDate?: string; // DateTime
    phoneNo?: string;
    active?: boolean;
}

interface UpdateReminderInput {
    id: string;
    title?: string;
    description?: string;
    senderEmail?: string;
    senderName?: string;
    receiverEmail?: string;
    intervalType?: string;
    reminderStartDate?: string; // DateTime
    reminderEndDate?: string; // DateTime
    phoneNo?: string;
    active?: boolean;
    send?: boolean;
    completed?: boolean;
}

const LIST_REMINDERS_QUERY = gql`
  query Reminders($active: Boolean) {
    reminders(active: $active) {
      id
      title
      description
      reminderStartDate
      reminderEndDate
      active
    }
  }
`;

const GET_REMINDER_BY_ID_QUERY = gql`
  query Reminder($id: ID!) {
    reminder(id: $id) {
      id
      title
      description
      senderEmail
      receiverEmail
      intervalType
      reminderStartDate
      reminderEndDate
      active
    }
  }
`;

const CREATE_REMINDER_MUTATION = gql`
  mutation CreateReminder(
    $title: String!
    $description: String
    $senderEmail: String!
    $senderName: String
    $receiverEmail: String!
    $intervalType: String
    $reminderStartDate: DateTime
    $reminderEndDate: DateTime
    $phoneNo: String
    $active: Boolean
  ) {
    createReminder(
      title: $title
      description: $description
      senderEmail: $senderEmail
      senderName: $senderName
      receiverEmail: $receiverEmail
      intervalType: $intervalType
      reminderStartDate: $reminderStartDate
      reminderEndDate: $reminderEndDate
      phoneNo: $phoneNo
      active: $active
    ) {
      ok
      reminder { id title active }
    }
  }
`;

const UPDATE_REMINDER_MUTATION = gql`
  mutation UpdateReminder(
    $id: ID!
    $title: String
    $description: String
    $senderEmail: String
    $senderName: String
    $receiverEmail: String
    $intervalType: String
    $reminderStartDate: DateTime
    $reminderEndDate: DateTime
    $phoneNo: String
    $active: Boolean
    $send: Boolean
    $completed: Boolean
  ) {
    updateReminder(
      id: $id
      title: $title
      description: $description
      senderEmail: $senderEmail
      senderName: $senderName
      receiverEmail: $receiverEmail
      intervalType: $intervalType
      reminderStartDate: $reminderStartDate
      reminderEndDate: $reminderEndDate
      phoneNo: $phoneNo
      active: $active
      send: $send
      completed: $completed
    ) {
      ok
      reminder { id title active }
    }
  }
`;

const DELETE_REMINDER_MUTATION = gql`
  mutation DeleteReminder($id: ID!) {
    deleteReminder(id: $id) { ok }
  }
`;

export const reminderService = {
  async getReminders(active?: boolean): Promise<Reminder[]> {
    try {
      const result = await client.query({ query: LIST_REMINDERS_QUERY, variables: { active } });
      return result.data.reminders;
    } catch (error) {
      console.error("Error fetching reminders:", error);
      throw error;
    }
  },

  async getReminderById(id: string): Promise<Reminder> {
    try {
      const result = await client.query({ query: GET_REMINDER_BY_ID_QUERY, variables: { id } });
      return result.data.reminder;
    } catch (error) {
      console.error(`Error fetching reminder with id ${id}:`, error);
      throw error;
    }
  },

  async createReminder(reminderData: CreateReminderInput): Promise<{ id: string; title: string; active: boolean }> {
    try {
      const result = await client.mutate({ mutation: CREATE_REMINDER_MUTATION, variables: reminderData });
      return result.data.createReminder;
    } catch (error) {
      console.error("Error creating reminder:", error);
      throw error;
    }
  },

  async updateReminder(reminderData: UpdateReminderInput): Promise<{ id: string; title: string; active: boolean }> {
    try {
      const result = await client.mutate({ mutation: UPDATE_REMINDER_MUTATION, variables: reminderData });
      return result.data.updateReminder;
    } catch (error) {
      console.error("Error updating reminder:", error);
      throw error;
    }
  },

  async deleteReminder(id: string): Promise<{ ok: boolean }> {
    try {
      const result = await client.mutate({ mutation: DELETE_REMINDER_MUTATION, variables: { id } });
      return result.data.deleteReminder;
    } catch (error) {
      console.error("Error deleting reminder:", error);
      throw error;
    }
  },
};