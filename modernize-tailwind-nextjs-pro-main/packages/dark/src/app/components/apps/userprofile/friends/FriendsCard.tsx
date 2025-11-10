import React, { useContext, useState, useEffect } from "react";
import { Badge, TextInput, Button, Modal, Label } from "flowbite-react"; // Added Modal, Label
import { Icon } from "@iconify/react";
import CardBox from "@/app/components/shared/CardBox";
import Link from "next/link"; // Kept Link for 'Add User' button
import { UserDataContext } from "@/app/context/UserDataContext/index";

// Define the type for a user profile to ensure type safety (recommended)
interface UserProfile {
  id: React.Key | null | undefined;
  name: string;
  username: string;
  email: string;
}

// -------------------------------------------------------------
// 1. EditUserModal Component
// -------------------------------------------------------------
const EditUserModal = ({ 
    isVisible, 
    onClose, 
    user 
}: { 
    isVisible: boolean, 
    onClose: () => void, 
    user: UserProfile | null 
}) => {
  
  // State to manage data currently being edited in the form
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
  });

  // State for loading/saving feedback
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Use useEffect to initialize form data when a new user is selected
  useEffect(() => {
    if (user) {
      // Initialize form state with the data from the clicked user
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
      });
      setError('');
    }
  }, [user]);

  // Handler for input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for the Save button (Placeholder for API call)
  const handleSave = async () => {
    if (!user || !user.id) return;
    setIsSaving(true);
    setError('');

    try {
      // --- START: PLACEHOLDER API CALL ---
      console.log(`[API MOCK] Attempting to update user ID: ${user.id} with data:`, formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      console.log("[API MOCK] Update successful!");
      // --- END: PLACEHOLDER API CALL ---

      // **IMPORTANT:** You'll typically need to call a function (e.g., from UserDataContext) 
      // here to update the list of 'followers' data on the main page after a successful save.
      
      onClose(); // Close the modal
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error("Save Error:", err);
    } finally {
      setIsSaving(false);
    }
  };


  if (!user) return null;

  return (
    <Modal show={isVisible} onClose={onClose}>
      <Modal.Header>Edit {user.name}</Modal.Header>
      <Modal.Body>
        {error && <div className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400">{error}</div>}
        
        <div className="space-y-4">
          
          {/* Input for Name */}
          <div>
            <Label htmlFor="name" value="Name" className="mb-2 block"/>
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>
          
          {/* Input for Username */}
          <div>
            <Label htmlFor="username" value="Username" className="mb-2 block"/>
            <TextInput
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>
          
          {/* Input for Email */}
          <div>
            <Label htmlFor="email" value="Email" className="mb-2 block"/>
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>
          
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
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


// -------------------------------------------------------------
// 2. FriendsCard Component
// -------------------------------------------------------------
const FriendsCard = () => {
  const { followers, setFollowerSearch }: any = useContext(UserDataContext);
  
  // State for Modal Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const openEditModal = (profile: UserProfile) => {
    setCurrentUser(profile);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    // Clear current user data when modal closes
    setCurrentUser(null); 
  };

  return (
    <>
      <div className="md:flex justify-between mb-6">
        <h5 className="text-2xl flex gap-3 items-center sm:my-0 my-4">
          Users <Badge color={"secondary"}>{followers.length}</Badge>
        </h5>
        <div className="flex gap-3">
          <TextInput
            icon={() => <Icon icon="tabler:search" height={18} />}
            type="text"
            sizing="md"
            className="form-control"
            placeholder="Search Friends"
            onChange={(e) => setFollowerSearch(e.target.value)}
          />
          {/* Keeping Link for Add User as it often goes to a dedicated creation page */}
          <Link href="/apps/user-profile/friends/create"> 
            <Button color="primary">Add User</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {followers.map(
          (profile: UserProfile) => (
            <div
              className="lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12"
              key={profile.id}
            >
              <CardBox className=" text-center overflow-hidden">
                {/* User Info Section (omitted for brevity) */}
                <div>
                  <div className="flex items-center justify-center w-20 h-20 bg-lightprimary rounded-full mx-auto">
                    <Icon icon="tabler:user" height="48" className="text-primary" />
                  </div>
                  <div>
                    <h5 className="text-lg mt-3">{profile.name}</h5>
                    <p className="text-xs text-darklink">@{profile.username}</p>
                    <p className="text-xs text-gray-500">{profile.email}</p>
                  </div>
                </div>

                {/* Actions Section with Edit Button */}
                <div className="flex justify-center gap-3 mt-4">
                  <Button 
                    color="primary" 
                    size="sm"
                    onClick={() => openEditModal(profile)} // 👈 OPENS THE MODAL
                  >
                    <Icon icon="tabler:edit" className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </CardBox>
            </div>
          )
        )}
      </div>

      {/* Renders the Modal outside the list loop */}
      <EditUserModal 
        isVisible={isModalOpen} 
        onClose={closeEditModal} 
        user={currentUser} 
      />
    </>
  );
};

export default FriendsCard;