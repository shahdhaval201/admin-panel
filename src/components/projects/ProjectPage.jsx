import React, { useState } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import AddProjectForm from './AddProjectForm'; // Import the form component

const ProjectPage = () => {
  const [open, setOpen] = useState(false);

  // Function to open the modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to close the modal
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* Add Project Button */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Project
      </Button>

      {/* Modal to Display the Project Form */}
      <Modal open={open} onClose={handleClose}>
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {
              xs: '90%',  // For extra small devices (phone), take up 90% of the screen width
              sm: '80%',  // For small devices (tablets), take up 80% of the screen width
              md: 800,    // For medium devices (desktops), set width to 800px
            },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* Add Project Form */}
          <AddProjectForm onClose={handleClose} />
        </Box>
      </Modal>
    </div>
  );
};

export default ProjectPage;
