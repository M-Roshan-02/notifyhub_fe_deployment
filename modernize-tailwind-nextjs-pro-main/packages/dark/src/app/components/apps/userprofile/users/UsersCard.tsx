import React, { useContext, useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Badge, Button, TextInput, Modal, Label } from "flowbite-react";
import Link from "next/link";
import CardBox from "@/app/components/shared/CardBox";
import { UserDataContext } from "@/app/context/UserDataContext/index";

interface User {
    id: React.Key | null | undefined;
    username: string;
}

const EditUserModal = ({
    isVisible,
    onClose,
    user
}: {
    isVisible: boolean,
    onClose: () => void,
    user: User | null
}) => {
  
 
  const [formData, setFormData] = useState({
    name: '',
  });

  
  const [isSaving, setIsSaving] = useState(false);

  
  useEffect(() => {
    if (user) {
      
      setFormData({
        name: user.username || '',
      });
    }
  }, [user]);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ name: value });
  };

  
  const handleSave = async () => {
    if (!user || !user.id) return;
    setIsSaving(true);

    try {
      
      console.log(`[API MOCK] Attempting to update user ID: ${user.id} with name: ${formData.name}`); 
      
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      
      console.log("[API MOCK] User update successful!");
      
      
      onClose();
    } catch (err) {
      console.error("User Save Error:", err);
    } finally {
      setIsSaving(false);
    }
  };


  if (!user) return null;

  return (
    <Modal show={isVisible} onClose={onClose}>
      <Modal.Header>Edit {user.username}</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          
         
          <div>
            <Label htmlFor="name" value="User Name" className="mb-2 block"/> 
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>
          
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={handleSave}
          disabled={isSaving || formData.name.trim() === user.username.trim()} 
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button color="gray" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const UsersCard = () => {
  const { users, setUserSearch }: any = useContext(UserDataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null); 
  };

  useEffect(() => {
    console.log('Users in UsersCard:', users);
  }, [users]);

  
  return (
    <>
      <div className="md:flex justify-between mb-6">
        <h5 className="text-2xl flex gap-3 items-center sm:my-0 my-4">
          Users
          <Badge color={"secondary"} className="rounded-md">
            {users.length}
          </Badge>
        </h5>
        <div className="flex gap-3">
          <TextInput
            icon={() => <Icon icon="tabler:search" height={18} />}
            type="text"
            sizing="md"
            className="form-control"
            placeholder="Search Users"
            onChange={(e) => setUserSearch(e.target.value)}
          />
          <Link href="/apps/user-profile/users/create">
            <Button color="primary">Add User</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {users.map(
          (user: User) => (
            <div
              className="lg:col-span-4 md:col-span-6 sm:col-span-6 col-span-12"
              key={user.id}
            >
              <CardBox>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-lightprimary rounded-full">
                      <Icon
                        icon="tabler:user-circle"
                        height="24"
                        className="text-primary"
                      />
                    </div>
                    <h6 className="text-base font-medium">{user.username}</h6> 
                  </div>

                  
                  <Button
                    color="light"
                    size="xs"
                    onClick={() => openEditModal(user)}
                  >
                    <Icon icon="tabler:edit" height="16" />
                  </Button>
                </div>
              </CardBox>
            </div>
          )
        )}
      </div>

      
      <EditUserModal
        isVisible={isModalOpen}
        onClose={closeEditModal}
        user={currentUser}
      />
    </>
  );
};

export default UsersCard;