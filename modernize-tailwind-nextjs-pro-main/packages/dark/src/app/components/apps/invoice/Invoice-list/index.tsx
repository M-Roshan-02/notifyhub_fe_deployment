'use client';
import React, { useEffect, useState } from "react";
import { Checkbox, Table, TextInput, Button, Modal, Badge, Tooltip, Alert, Spinner } from "flowbite-react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { reminderService } from "@/services/api";
import { Reminder } from "@/types/apps/invoice";

function ReminderList() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const fetchedReminders = await reminderService.getReminders();
        setReminders(fetchedReminders);
      } catch (err) {
        setError("Failed to fetch reminders.");
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await Promise.all(selectedReminders.map(id => reminderService.deleteReminder(id)));
      setReminders(reminders.filter(r => !selectedReminders.includes(r.id)));
      setSelectedReminders([]);
      setOpenDeleteDialog(false);
    } catch (err) {
      setError("Failed to delete reminders.");
    }
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedReminders(newSelectAll ? reminders.map(r => r.id) : []);
  };

  const toggleSelectReminder = (id: string) => {
    setSelectedReminders(prev =>
      prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
    );
  };

  const filteredReminders = (reminders || []).filter(r =>
    (r.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.senderName || "").toLowerCase().includes(searchTerm.toLowerCase()) // senderName is optional in Reminder interface
  );

  if (loading) return <div className="flex justify-center items-center h-[60vh]"><Spinner size="xl" /></div>;
  if (error) return <Alert color="failure">{error}</Alert>;

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Reminders</h2>
      <div className="sm:flex justify-between my-6">
        <TextInput
          id="search"
          type="text"
          className="form-control"
          placeholder="Search by title or sender"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button as={Link} href="/apps/invoice/create" color={"primary"} className="sm:w-fit w-full rounded-md sm:mt-0 mt-4">
          + New Reminder
        </Button>
      </div>

      <div className="overflow-x-auto mt-6">
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell className="p-4">
              <Checkbox checked={selectAll} onChange={toggleSelectAll} />
            </Table.HeadCell>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Sender Email</Table.HeadCell>
            <Table.HeadCell>Receivers Email</Table.HeadCell>
            <Table.HeadCell>Active</Table.HeadCell>
            <Table.HeadCell className="text-center">Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredReminders.map((reminder: Reminder) => (
              <Table.Row key={reminder.id} className="bg-white dark:bg-gray-800">
                <Table.Cell className="p-4">
                  <Checkbox
                    checked={selectedReminders.includes(reminder.id)}
                    onChange={() => toggleSelectReminder(reminder.id)}
                  />
                </Table.Cell>
                <Table.Cell>{reminder.id}</Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {reminder.title}
                </Table.Cell>
                <Table.Cell>{reminder.senderEmail}</Table.Cell>
                <Table.Cell>{reminder.receiverEmail}</Table.Cell>
                <Table.Cell>
                  <Badge color={reminder.active ? 'success' : 'warning'}>
                    {reminder.active ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-center">
                  <div className="flex justify-center gap-3">
                    <Tooltip content="Edit Reminder">
                      <Link href={`/apps/invoice/edit/${reminder.id}`}>
                        <Button size="xs" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Icon icon="tabler:pencil" height={18} />
                        </Button>
                      </Link>
                    </Tooltip>
                    <Tooltip content="Delete Reminder">
                      <Button
                        size="xs"
                        color={"red"}
                        onClick={() => {
                          setSelectedReminders([reminder.id]);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <Icon icon="tabler:trash" height={18} />
                      </Button>
                    </Tooltip>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <Modal show={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} size="md">
        <Modal.Body className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Are you sure you want to delete the selected reminders?</h3>
        </Modal.Body>
        <Modal.Footer className="justify-center">
          <Button color="gray" onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReminderList;