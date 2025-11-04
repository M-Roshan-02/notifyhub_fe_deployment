import { client } from '@/app/libs/apollo-client';
import { gql } from '@apollo/client';
import { Reminder, UpdateReminderInput } from "@/app/(DashboardLayout)/types/apps/reminder";

export const userService = {
  async getUsers() {
    const query = gql`
      query Users {
        users {
          id
          username
          email
          company {
            id
            name
          }
        }
      }
    `;
    const result = await client.query({ query });
    return result.data.users;
  },

  async createUser(userData: { name: string; username: string; email: string }) {
    const mutation = gql`
      mutation CreateUser($name: String!, $username: String!, $email: String!) {
        createUser(input: { name: $name, username: $username, email: $email }) {
          id
          username
          email
        }
      }
    `;
    const result = await client.mutate({
      mutation,
      variables: {
        name: userData.name,
        username: userData.username,
        email: userData.email,
      },
    });
    return result.data.createUser;
  },
};

export const departmentService = {
  async getDepartments() {
    const query = gql`
      query Departments {
        departments {
          id
          name
          company {
            id
            name
          }
        }
      }
    `;
    const result = await client.query({ query });
    return result.data.departments;
  },

  async createDepartment(deptData: { userId: string; title: string; body: string }) {
    const mutation = gql`
      mutation CreateDepartment($name: String!) {
        createDepartment(name: $name) {
          ok
          department {
            id
            name
            company {
              id
              name
            }
          }
        }
      }
    `;
    const result = await client.mutate({
      mutation,
      variables: {
        name: deptData.title, // Assuming title maps to name for department
      },
    });
    return result.data.createDepartment.department;
  },
};

export const reminderService = {
  async getReminders(active?: boolean) {
    const query = gql`
      query Reminders($active: Boolean) {
        reminders(active: $active) {
          id
          title
          description
          senderName
          senderEmail
          receiverEmail
          intervalType
          reminderStartDate
          reminderEndDate
          phoneNo
          active
          completed
        }
      }
    `;
    const result = await client.query({ query, variables: { active } });
    return result.data.reminders;
  },

  async getReminderById(id: string): Promise<Reminder> {
    const query = gql`
      query Reminder($id: ID!) {
        reminder(id: $id) {
          id
          title
          description
          senderEmail
          senderName
          receiverEmail
          intervalType
          reminderStartDate
          reminderEndDate
          phoneNo
          active
          completed
        }
      }
    `;
    const result = await client.query({ query, variables: { id } });
    const reminder = result.data.reminder;

    if (!reminder) {
      throw new Error(`Reminder with ID ${id} not found.`);
    }

    return reminder;
  },

  async createReminder(reminderData: {
    title: string;
    description?: string;
    senderEmail: string;
    senderName?: string;
    receiverEmail: string;
    intervalType?: string;
    reminderStartDate?: string;
    reminderEndDate?: string;
    phoneNo?: string;
    active?: boolean;
  }) {
    const mutation = gql`
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
    const result = await client.mutate({ 
      mutation, 
      variables: {
        title: reminderData.title,
        description: reminderData.description,
        senderEmail: reminderData.senderEmail,
        senderName: reminderData.senderName,
        receiverEmail: reminderData.receiverEmail,
        intervalType: reminderData.intervalType,
        reminderStartDate: reminderData.reminderStartDate,
        reminderEndDate: reminderData.reminderEndDate,
        phoneNo: reminderData.phoneNo,
        active: reminderData.active,
      }
    });
    return result.data.createReminder.reminder;
  },

  async updateReminder(input: UpdateReminderInput): Promise<Reminder> {
    const mutation = gql`
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
    const variables: any = { ...input };
    const result = await client.mutate({ mutation, variables });
    const reminder = result.data.updateReminder.reminder;
    return reminder;
  },
};
