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

// New interfaces for Department mutations
interface CreateDepartmentInput {
    name: string;
}

interface UpdateDepartmentInput {
    id: string;
    name?: string;
}

// Define the type for the updateDepartment mutation result
type UpdateDepartmentMutationResult = {
  updateDepartment: {
    ok: boolean;
    department: {
      id: string;
      name: string;
    };
  };
};

// Define the type for the updateDepartment mutation result
type UpdateDepartmentMutationResult = {
  updateDepartment: {
    ok: boolean;
    department: {
      id: string;
      name: string;
    };
  };
};

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

// New Department Mutations
const CREATE_DEPARTMENT_MUTATION = gql`
  mutation CreateDepartment($name: String!) {
    createDepartment(name: $name) {
      ok
      department { id name company { id name } }
    }
  }
`;

const UPDATE_DEPARTMENT_MUTATION = gql`
  mutation UpdateDepartment($id: ID!, $name: String) {
    updateDepartment(id: $id, name: $name) {
      ok
      department { id name }
    }
  }
`;

const DELETE_DEPARTMENT_MUTATION = gql`
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id) { ok }
  }
`;


export const reminderService = {

  async getReminders(active?: boolean): Promise<Reminder[]> {

    try {

      const result = await client.query<{ reminders: Reminder[] }>({ query: LIST_REMINDERS_QUERY, variables: { active } });
      if (!result.data || !result.data.reminders) {
        throw new Error("No reminders data returned.");
      }
      return result.data.reminders;

    } catch (error) {

      console.error("Error fetching reminders:", error);

      throw error;

    }

  },



  async getReminderById(id: string): Promise<Reminder> {

    try {

      const result = await client.query<{ reminder: Reminder }>({ query: GET_REMINDER_BY_ID_QUERY, variables: { id } });
      if (!result.data || !result.data.reminder) {
        throw new Error(`No reminder data returned for id ${id}.`);
      }
      return result.data.reminder;

    } catch (error) {

      console.error(`Error fetching reminder with id ${id}:`, error);

      throw error;

    }

  },



  async createReminder(reminderData: CreateReminderInput): Promise<{ ok: boolean; reminder: { id: string; title: string; active: boolean } }> {

    try {

      const result = await client.mutate<{ createReminder: { ok: boolean; reminder: { id: string; title: string; active: boolean } } }>({ mutation: CREATE_REMINDER_MUTATION, variables: reminderData });
      if (!result.data || !result.data.createReminder) {
        throw new Error("Failed to create reminder.");
      }
      return result.data.createReminder;

    } catch (error) {

      console.error("Error creating reminder:", error);

      throw error;

    }

  },



  async updateReminder(reminderData: UpdateReminderInput): Promise<{ ok: boolean; reminder: { id: string; title: string; active: boolean } }> {

    try {

      const result = await client.mutate<{ updateReminder: { ok: boolean; reminder: { id: string; title: string; active: boolean } } }>({ mutation: UPDATE_REMINDER_MUTATION, variables: reminderData });
      if (!result.data || !result.data.updateReminder) {
        throw new Error("Failed to update reminder.");
      }
      return result.data.updateReminder;

    } catch (error) {

      console.error("Error updating reminder:", error);

      throw error;

    }

  },



  async deleteReminder(id: string): Promise<{ ok: boolean }> {

    try {

      const result = await client.mutate<{ deleteReminder: { ok: boolean } }>({ mutation: DELETE_REMINDER_MUTATION, variables: { id } });
      if (!result.data || !result.data.deleteReminder) {
        throw new Error("Failed to delete reminder.");
      }
      return result.data.deleteReminder;

    } catch (error) {

      console.error("Error deleting reminder:", error);

      throw error;

    }

  },

};

const LIST_USERS_QUERY = gql`
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


export const userService = {

  async getMe() {

    const query = gql`

      query Me {

        me {

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

    const result = await client.query<{ me: { id: string; username: string; email: string; company: { id: string; name: string } } }>({ query });
    if (!result.data || !result.data.me) {
      // Don't throw an error, just return null if no user data
      return null;
    }
    return result.data.me;

  },

  async getAllUsers() {
    try {
      const result = await client.query<{ users: { id: string; username: string; email: string; company: { id: string; name: string } }[] }>({ query: LIST_USERS_QUERY });
      if (!result.data || !result.data.users) {
        throw new Error("No users data returned.");
      }
      return result.data.users;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },


  async createUser(userData: { name: string; username: string; email: string }) {

    const mutation = gql`

      mutation CreateUser($name: String!, $username: String!, $email: String!) {

        createUser(input: { name: $name, username: $username, email: $email }) {

          id

          name

          username

          email

        }

      }

    `;

    const result = await client.mutate<{ createUser: { id: string; name: string; username: string; email: string } }>({

      mutation,

      variables: {

        name: userData.name,

        username: userData.username,

        email: userData.email,

      },

    });
    if (!result.data || !result.data.createUser) {
      throw new Error("Failed to create user.");
    }
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

    const result = await client.query<{ departments: { id: string; name: string; company: { id: string; name: string } }[] }>({ query });
    if (!result.data || !result.data.departments) {
      throw new Error("No departments data returned.");
    }
    return result.data.departments;

  },



  async createDepartment(deptData: CreateDepartmentInput): Promise<{ ok: boolean; department: { id: string; name: string; company: { id: string; name: string } } }> {

    try {

      const result = await client.mutate<{ createDepartment: { ok: boolean; department: { id: string; name: string; company: { id: string; name: string } } } }>({

        mutation: CREATE_DEPARTMENT_MUTATION,

        variables: deptData,

      });
      if (!result.data || !result.data.createDepartment) {
        throw new Error("Failed to create department.");
      }
      return result.data.createDepartment;

    } catch (error) {

      console.error("Error creating department:", error);

      throw error;

    }

  },

  async updateDepartment(deptData: UpdateDepartmentInput): Promise<{ ok: boolean; department: { id: string; name: string } }> {

    try {

      const result = await client.mutate<UpdateDepartmentMutationResult>({

        mutation: UPDATE_DEPARTMENT_MUTATION,

        variables: deptData,

      });
      if (!result.data || !result.data.updateDepartment) {
        throw new Error("Failed to update department.");
      }
      return result.data.updateDepartment;

    } catch (error) {

      console.error("Error updating department:", error);

      throw error;

    }

  },

  async deleteDepartment(id: string): Promise<{ ok: boolean }> {

    try {

      const result = await client.mutate<{ deleteDepartment: { ok: boolean } }>({ mutation: DELETE_DEPARTMENT_MUTATION, variables: { id } });
      if (!result.data || !result.data.deleteDepartment) {
        throw new Error("Failed to delete department.");
      }
      return result.data.deleteDepartment;

    } catch (error) {

      console.error("Error deleting department:", error);

      throw error;

    }

  },

};
