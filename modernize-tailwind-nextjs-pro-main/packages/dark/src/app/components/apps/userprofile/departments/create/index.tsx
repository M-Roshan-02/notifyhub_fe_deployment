"use client";

import React, { useState } from "react"; 
import { useRouter } from "next/navigation";
import { Button, TextInput, Card, Label, Textarea } from "flowbite-react";
import { departmentService } from "@/services/api";

const CreateDepartmentApp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    userId: "1", // Static for now
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
      await departmentService.createDepartment({ 
        title: formData.name, 
        body: "", 
        userId: formData.userId 
      });
      router.push("/apps/user-profile/followers");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Create New Department</h2>
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name">Name</Label>
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter department name"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Department"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateDepartmentApp;
