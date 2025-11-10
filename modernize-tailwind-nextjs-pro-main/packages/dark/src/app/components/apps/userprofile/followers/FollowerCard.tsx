import React, { useContext, useState, useEffect } from "react"; // 👈 Added useState, useEffect
import { Icon } from "@iconify/react";
import { Badge, Button, TextInput, Modal, Label } from "flowbite-react"; // 👈 Added Modal, Label
import Link from "next/link";
import CardBox from "@/app/components/shared/CardBox";
import { UserDataContext } from "@/app/context/UserDataContext/index";

interface Department {
    id: React.Key | null | undefined;
    name: string;
}

const EditDepartmentModal = ({
    isVisible,
    onClose,
    department
}: {
    isVisible: boolean,
    onClose: () => void,
    department: Department | null
}) => {
  
 
  const [formData, setFormData] = useState({
    name: '', 
  });

  
  const [isSaving, setIsSaving] = useState(false);

  
  useEffect(() => {
    if (department) {
      
      setFormData({
        name: department.name || '', 
      });
    }
  }, [department]);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ name: value });
  };

  
  const handleSave = async () => {
    if (!department || !department.id) return;
    setIsSaving(true);

    try {
      
      console.log(`[API MOCK] Attempting to update department ID: ${department.id} with name: ${formData.name}`); 
      
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      
      console.log("[API MOCK] Department update successful!");
      
      
      onClose();
    } catch (err) {
      console.error("Department Save Error:", err);
    } finally {
      setIsSaving(false);
    }
  };


  if (!department) return null;

  return (
    <Modal show={isVisible} onClose={onClose}>
      <Modal.Header>Edit {department.name}</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          
         
          <div>
            <Label htmlFor="name" value="Department Name" className="mb-2 block"/> 
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
          disabled={isSaving || formData.name.trim() === department.name.trim()} 
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

const FollowerCard = () => {
  const { departments, setDepartmentSearch }: any = useContext(UserDataContext);

  // State for Modal Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);

  const openEditModal = (department: Department) => {
    setCurrentDepartment(department);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setCurrentDepartment(null);
  };
  
  return (
    <>
      <div className="md:flex justify-between mb-6">
        <h5 className="text-2xl flex gap-3 items-center sm:my-0 my-4">
          Departments
          <Badge color={"secondary"} className="rounded-md">
            {departments.length}
          </Badge>
        </h5>
        <div className="flex gap-3">
          <TextInput
            icon={() => <Icon icon="tabler:search" height={18} />}
            type="text"
            sizing="md"
            className="form-control"
            placeholder="Search Departments"
            onChange={(e) => setDepartmentSearch(e.target.value)}
          />
          <Link href="/apps/user-profile/departments/create">
            <Button color="primary">Add Department</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {departments.map(
          (department: Department) => (
            <div
              className="lg:col-span-4 md:col-span-6 sm:col-span-6 col-span-12"
              key={department.id}
            >
              <CardBox>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-lightprimary rounded-full">
                      <Icon
                        icon="tabler:building"
                        height="24"
                        className="text-primary"
                      />
                    </div>
                    <h6 className="text-base font-medium">{department.name}</h6> 
                  </div>

                  
                  <Button
                    color="light"
                    size="xs"
                    onClick={() => openEditModal(department)}
                  >
                    <Icon icon="tabler:edit" height="16" />
                  </Button>
                </div>
              </CardBox>
            </div>
          )
        )}
      </div>

      
      <EditDepartmentModal
        isVisible={isModalOpen}
        onClose={closeEditModal}
        department={currentDepartment}
      />
    </>
  );
};

export default FollowerCard;