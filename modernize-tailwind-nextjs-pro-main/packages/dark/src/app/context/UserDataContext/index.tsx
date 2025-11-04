'use client'
import React, { createContext, useState, useEffect } from 'react';
import { PostType, profiledataType } from '@/app/(DashboardLayout)/types/apps/userProfile';
import { Reminder } from '@/app/(DashboardLayout)/types/apps/reminder';
import { userService, departmentService, reminderService } from '@/app/services/api';

export type UserDataContextType = {
    posts: PostType[];
    users: any[];
    gallery: any[];
    departments: any[];
    reminders: Reminder[];
    profileData: profiledataType;
    loading: boolean;
    error: null | any;
    userSearch: string;
    departmentSearch: string;
    setUserSearch: React.Dispatch<React.SetStateAction<string>>;
    setDepartmentSearch: React.Dispatch<React.SetStateAction<string>>;
    setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
    addGalleryItem: (item: any) => void;
    addReply: (postId: number, commentId: number, reply: string) => void;
    likePost: (postId: number) => void;
    addComment: (postId: number, comment: string) => void;
    likeReply: (postId: number, commentId: number) => void;
    toggleFollow: (id: number) => void;
    toggleDepartmentStatus: (id: number) => void;
};

export const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

const config = {
    posts: [], 
    users: [],
    gallery: [],
    departments: [],
    reminders: [],
    userSearch: '',
    departmentSearch: '',
    loading: true,
};

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<PostType[]>(config.posts);
    const [users, setUsers] = useState<any[]>(config.users);
    const [gallery, setGallery] = useState<any[]>(config.gallery);
    const [departments, setDepartments] = useState<any[]>(config.departments);
    const [reminders, setReminders] = useState<Reminder[]>(config.reminders);
    const [userSearch, setUserSearch] = useState<string>(config.userSearch);
    const [departmentSearch, setDepartmentSearch] = useState<string>(config.departmentSearch);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(config.loading);

    const [profileData, setProfileData] = useState<profiledataType>({
        name: 'Mathew Anderson',
        role: 'Designer',
        avatar: '/images/profile/user-1.jpg',
        coverImage: '/images/backgrounds/profilebg.jpg',
        postsCount: 938,
        followersCount: 3586,
        followingCount: 2659,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const usersResponse = await userService.getUsers();
                const deptsResponse = await departmentService.getDepartments();
                const remindersResponse = await reminderService.getReminders();
                setUsers(usersResponse);
                setDepartments(deptsResponse);
                setReminders(remindersResponse.map((reminder: any) => ({
                  ...reminder,
                  title: reminder.title || "",
                  description: reminder.description || "",
                  senderName: reminder.senderName || "",
                  senderEmail: reminder.senderEmail || "",
                  receiverEmail: reminder.receiverEmail || "",
                  intervalType: reminder.intervalType || "Daily",
                  reminderStartDate: reminder.reminderStartDate || "",
                  reminderEndDate: reminder.reminderEndDate || "",
                  phoneNo: reminder.phoneNo || "",
                  active: reminder.active || false,
                  completed: reminder.completed || false,
                })));
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    
    const filterUsers = () => {
        if (users) {
            return users.filter((t) =>
                t.username.toLowerCase().includes(userSearch.toLowerCase())
            );
        }
        return users;
    };
    
   
const filterDepartments = () => {
    if (departments && departmentSearch) {
        return departments.filter((t) =>
            (typeof t.name === 'string' && t.name.toLowerCase().includes(departmentSearch.toLowerCase())) 
        );
    }
    return departments;
};

    return (
        <UserDataContext.Provider
            value={{
                posts,
                users: filterUsers(),
                gallery,
                departments: filterDepartments(),
                reminders,
                profileData,
                loading,
                error,
                addGalleryItem: () => {},
                addReply: () => {},
                likePost: () => {},
                addComment: () => {},
                likeReply: () => {},
                toggleFollow: () => {},
                toggleDepartmentStatus: () => {},
                setUserSearch,
                userSearch,
                setDepartmentSearch,
                departmentSearch,
                setReminders,
            }}
        >
            {children}
        </UserDataContext.Provider>
    );
}; 