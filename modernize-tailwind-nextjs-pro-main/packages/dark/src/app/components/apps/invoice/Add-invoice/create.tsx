'use client';
import React, { useState } from "react";
import { Alert, Button, Label, Select, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { reminderService } from "@/app/services/api";
import { Reminder } from "@/types/apps/invoice";

const CreateReminderPage = () => {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    senderName: "",
    senderEmail: "",
    receiverEmail: "",
    intervalType: "Daily",
    sendReminderAt: "",
    reminderEndDate: "",
    status: "Pending",
    userId: "1", // Assuming a default user for now
    active: true,
    reminderStartDate: "",
    phoneNo: "",
  });

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await reminderService.createReminder(formData);
      setShowAlert(true);
      setTimeout(() => router.push('/apps/invoice/list'), 2000);
    } catch (error) {
      setError("Failed to create reminder.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-6">Create New Reminder</h2>
      <form onSubmit={handleSubmit}>
        <div className="bg-lightgray dark:bg-gray-800/70 p-6 my-6 rounded-md">
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="title">Title</Label>
              <TextInput id="title" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="description">Description</Label>
              <TextInput id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} required />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="senderName">Sender Name</Label>
              <TextInput id="senderName" value={formData.senderName} onChange={(e) => handleChange('senderName', e.target.value)} required />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="senderEmail">Sender Email</Label>
              <TextInput id="senderEmail" type="email" value={formData.senderEmail} onChange={(e) => handleChange('senderEmail', e.target.value)} required />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="receiverEmail">Receiver Email</Label>
              <TextInput id="receiverEmail" value={formData.receiverEmail} onChange={(e) => handleChange('receiverEmail', e.target.value)} required />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="intervalType">Interval Type</Label>
              <Select id="intervalType" value={formData.intervalType} onChange={(e) => handleChange('intervalType', e.target.value)}>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </Select>
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="sendReminderAt">Send Reminder At</Label>
              <TextInput id="sendReminderAt" type="time" value={formData.sendReminderAt} onChange={(e) => handleChange('sendReminderAt', e.target.value)} required />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="reminderEndDate">Reminder End Date</Label>
              <TextInput id="reminderEndDate" type="date" value={formData.reminderEndDate} onChange={(e) => handleChange('reminderEndDate', e.target.value)} required />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button color="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Reminder'}
          </Button>
          <Button color="gray" onClick={() => router.push('/apps/invoice/list')} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </form>
      {showAlert && (
        <Alert color="success" onDismiss={() => setShowAlert(false)} className="mt-4">
          Reminder created successfully.
        </Alert>
      )}
      {error && (
        <Alert color="failure" onDismiss={() => setError(null)} className="mt-4">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default CreateReminderPage;