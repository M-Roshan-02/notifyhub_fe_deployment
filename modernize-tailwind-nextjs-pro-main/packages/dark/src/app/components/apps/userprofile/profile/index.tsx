"use client";
import React, { useContext, useState, useEffect } from "react";
import { Label, TextInput, Textarea, Button } from "flowbite-react";
import { Pencil, Check } from "lucide-react";
import ProfileBanner from "./ProfileBanner";
import CardBox from "@/app/components/shared/CardBox";
import { UserDataContext } from "@/app/context/UserDataContext/index"; // Import global UserDataContext

const ProfileSection = () => {
  const context = useContext(UserDataContext); // Consume global user

  if (!context) {
    return <div>Error: User data context not available.</div>;
  }

  const { user, loading, error } = context;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.username || "", // Use user data
    bio: "", // Bio is not in the current user object, so default to empty
    department: user?.company?.name || "", // Use company name as department
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.username || "",
        bio: "",
        department: user.company?.name || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would call an API to update the user data
    // For now, we just update the local state (which is not persisted)
    // setUserData(formData); // This would update the global context if it were mutable
    setIsEditing(false);
    setIsSaved(true);
  };

  if (loading) return <div>Loading user profile...</div>;
  if (error) return <div>Error loading user profile: {error.message}</div>;
  if (!user) return <div>No user data available.</div>;

  return (
    <CardBox className="bg-gray-800 text-gray-200 rounded-xl p-6 shadow-md border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-white">Profile Details</h4>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
          >
            <Pencil size={18} /> Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition"
          >
            <Check size={18} /> Save
          </button>
        )}
      </div>

      {/* View Mode */}
      {!isEditing && (
        <div className="space-y-3">
          <p>
            <span className="text-gray-400 font-medium">Name:</span>{" "}
            <span className="text-gray-100">{user.username}</span> {/* Use user.username */}
          </p>
          <p>
            <span className="text-gray-400 font-medium">Department:</span>{" "}
            <span className="text-gray-100">{user.company?.name}</span> {/* Use user.company.name */}
          </p>
          <p>
            <span className="text-gray-400 font-medium">Email:</span>{" "}
            <span className="text-gray-100">{user.email}</span> {/* Add email */}
          </p>
          <p>
            <span className="text-gray-400 font-medium">Bio:</span>{" "}
            <span className="text-gray-100">{formData.bio}</span>
          </p>
          {isSaved && (
            <p className="text-green-400 text-sm font-semibold">Saved!</p>
          )}
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <form onSubmit={handleSave} className="flex flex-col gap-4 mt-4">
          <div>
            <Label htmlFor="name" value="Name" className="text-gray-300" />
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-gray-100"
              required
            />
          </div>
          <div>
            <Label
              htmlFor="department"
              value="Department"
              className="text-gray-300"
            />
            <TextInput
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-gray-100"
              required
            />
          </div>
          <div>
            <Label htmlFor="bio" value="Bio" className="text-gray-300" />
            <Textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-gray-100"
              required
            />
          </div>
        </form>
      )}
    </CardBox>
  );
};

const UserProfileApp = () => {
  return (
    // UserDataProvider is now provided at a higher level (e.g., layout.tsx)
    // so we just render the content directly.
    <div className="grid grid-cols-12 gap-6">
      {/* Banner */}
      <div className="col-span-12">
        <ProfileBanner />
      </div>

      {/* Profile Section */}
      <div className="col-span-12">
        <ProfileSection />
      </div>
    </div>
  );
};

export default UserProfileApp;
