"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextInput, Card, Label } from "flowbite-react";
import { userService } from "@/app/services/api";

const CreateUserApp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await userService.createUser({
        name: `${formData.firstName} ${formData.lastName}`,
        username: formData.username,
        email: formData.email,
      });
      router.push("/apps/user-profile/friends");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Create New User</h2>
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <TextInput
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <TextInput
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter user's email"
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="username">Username</Label>
            <TextInput
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <TextInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateUserApp;
