'use client';
import React, { useState, useEffect } from "react";
import { Alert, Button, Label, Select, TextInput, Checkbox } from "flowbite-react";
import { useRouter } from "next/navigation";
import { reminderService } from "@/services/api";
import { Reminder } from "@/app/(DashboardLayout)/types/apps/reminder";
import { format } from "date-fns";

const EditReminderPage = ({ reminderId }: { reminderId: string }) => {
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [editing, setEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchReminder = async () => {
      if (!reminderId) return;
      try {
        const fetchedReminder = await reminderService.getReminderById(reminderId);
        setReminder({
          ...fetchedReminder,
          title: fetchedReminder.title || "",
          description: fetchedReminder.description || "",
          senderName: fetchedReminder.senderName || "",
          senderEmail: fetchedReminder.senderEmail || "",
          receiverEmail: fetchedReminder.receiverEmail || "",
          intervalType: fetchedReminder.intervalType || "Daily",
          reminderStartDate: fetchedReminder.reminderStartDate || "",
          reminderEndDate: fetchedReminder.reminderEndDate || "",
          phoneNo: fetchedReminder.phoneNo || "",
          active: fetchedReminder.active || false,
          completed: fetchedReminder.completed || false,
        });
      } catch (err) {
        setError("Failed to fetch reminder data.");
      }
    };
    fetchReminder();
  }, [reminderId]);

  const handleSave = async () => {
    if (!reminder) return;
    try {
      const updateInput = {
        id: reminder.id,
        title: reminder.title,
        description: reminder.description,
        senderEmail: reminder.senderEmail,
        senderName: reminder.senderName,
        receiverEmail: reminder.receiverEmail,
        intervalType: reminder.intervalType,
        reminderStartDate: reminder.reminderStartDate,
        reminderEndDate: reminder.reminderEndDate,
        phoneNo: reminder.phoneNo,
        active: reminder.active,
        completed: reminder.completed,
      };
      await reminderService.updateReminder(updateInput);
      setEditing(false);
      setShowAlert(true);
      setTimeout(() => router.push('/apps/invoice/list'), 2000);
    } catch (error) {
      setError("Failed to update reminder.");
    }
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleInputChange = (field: keyof Reminder, value: any) => {
    if (!reminder) return;
    setReminder({ ...reminder, [field]: value });
  };
  
  if (!reminder) {
    return <div>Loading...</div>;
  }
  
  if (error) {
      return <Alert color="failure">{error}</Alert>
  }

  const reminderStartDateForInput = reminder.reminderStartDate ? format(new Date(reminder.reminderStartDate), 'yyyy-MM-dd') : '';
  const reminderEndDateForInput = reminder.reminderEndDate ? format(new Date(reminder.reminderEndDate), 'yyyy-MM-dd') : '';

  return (
    <div>
      <h2 className="text-xl mb-2">Edit Reminder</h2>
      <p>ID: {reminder.id}</p>

      <div className="bg-lightgray dark:bg-gray-800/70 p-6 my-6 rounded-md">
        <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="title">Title</Label>
              <TextInput id="title" value={reminder.title} onChange={(e) => handleInputChange('title', e.target.value)} disabled={!editing} />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="description">Description</Label>
              <TextInput id="description" value={reminder.description} onChange={(e) => handleInputChange('description', e.target.value)} disabled={!editing} />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="senderName">Sender Name</Label>
              <TextInput id="senderName" value={reminder.senderName} onChange={(e) => handleInputChange('senderName', e.target.value)} disabled={!editing} />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="senderEmail">Sender Email</Label>
              <TextInput id="senderEmail" type="email" value={reminder.senderEmail} onChange={(e) => handleInputChange('senderEmail', e.target.value)} disabled={!editing} />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="receiverEmail">Receiver Email</Label>
              <TextInput id="receiverEmail" value={reminder.receiverEmail} onChange={(e) => handleInputChange('receiverEmail', e.target.value)} disabled={!editing} />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="intervalType">Interval Type</Label>
              <Select id="intervalType" value={reminder.intervalType} onChange={(e) => handleInputChange('intervalType', e.target.value)} disabled={!editing}>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </Select>
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="reminderStartDate">Reminder Start Date</Label>
              <TextInput id="reminderStartDate" type="date" value={reminderStartDateForInput} onChange={(e) => handleInputChange('reminderStartDate', e.target.value)} disabled={!editing} />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="reminderEndDate">Reminder End Date</Label>
              <TextInput id="reminderEndDate" type="date" value={reminderEndDateForInput} onChange={(e) => handleInputChange('reminderEndDate', e.target.value)} disabled={!editing} />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="phoneNo">Phone Number</Label>
              <TextInput id="phoneNo" value={reminder.phoneNo} onChange={(e) => handleInputChange('phoneNo', e.target.value)} disabled={!editing} />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="active">Active</Label>
              <Checkbox id="active" checked={reminder.active} onChange={(e) => handleInputChange('active', e.target.checked)} disabled={!editing} />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Label htmlFor="completed">Completed</Label>
              <Checkbox id="completed" checked={reminder.completed} onChange={(e) => handleInputChange('completed', e.target.checked)} disabled={!editing} />
            </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        {editing ? (
          <>
            <Button color="success" onClick={handleSave}>Save</Button>
            <Button color="gray" onClick={handleCancel}>Cancel</Button>
          </>
        ) : (
          <Button onClick={() => setEditing(true)}>Edit Reminder</Button>
        )}
      </div>

      {showAlert && (
        <Alert color="success" onDismiss={() => setShowAlert(false)} className="mt-4">
          Reminder updated successfully.
        </Alert>
      )}
    </div>
  );
};

export default EditReminderPage;