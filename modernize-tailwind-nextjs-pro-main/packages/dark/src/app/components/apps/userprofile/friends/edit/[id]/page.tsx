import React from 'react';


const EditUserPage = ({ params }: { params: { id: string } }) => {
  const userId = params.id;
  
  
  return (
    <div>
      <h1>Edit User Profile</h1>
      <p>Now editing user with ID: {userId}</p>
      {/* Add your actual user edit form component here */}
    </div>
  );
};

export default EditUserPage;