import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEstimationSections, deleteEstimationSection, createEstimationSection } from '../../store/estimationSlice';
import { Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Typography, IconButton, Modal, Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const EstimationList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const estimations = useSelector((state) => state.estimations.sections);
  const [filteredEstimations, setFilteredEstimations] = useState(estimations);
  const [filterText, setFilterText] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [newEstimation, setNewEstimation] = useState({
    title: '',
    description: '',
    unit: '',
    quantity: '',
    price: '',
    margin: '',
  });

  useEffect(() => {
    dispatch(fetchEstimationSections());
  }, [dispatch]);

  useEffect(() => {
    setFilteredEstimations(
      estimations?.filter((estimation) =>
        estimation.title.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [estimations, filterText]);

  const handleDelete = (estimationId) => {
    if (window.confirm('Are you sure you want to delete this estimation?')) {
      dispatch(deleteEstimationSection(estimationId));
    }
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleAddEstimation = () => {
    // Validate the inputs
    if (!newEstimation.title || !newEstimation.description) {
      alert('Title and Description are required.');
      return;
    }

    // Prepare the new section object based on user input
    const sectionToCreate = {
      title: newEstimation.title,
      description: newEstimation.description,
      unit: newEstimation.unit,
      quantity: newEstimation.quantity,
      price: newEstimation.price,
      margin: newEstimation.margin,
    };

    // Dispatch the action to add the new estimation section
    dispatch(createEstimationSection(sectionToCreate));
    setNewEstimation({
      title: '',
      description: '',
      unit: '',
      quantity: '',
      price: '',
      margin: '',
    });
    setOpenModal(false); // Close the modal after submission
  };

  const handleAddSection = (values, resetForm) => {
    if (editSection) {
      // Update section if it's in edit mode
      dispatch(updateEstimationSection({ id: editSection.id, ...values }));
      setEditSection(null); // Reset edit mode
    } else {
      // Create new section
      dispatch(createEstimationSection({ ...values }));
    }
    resetForm(); // Reset form after submission
    setOpenModal(false); // Close modal after submission
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Estimation List
      </Typography>

      {/* Filter */}
      <TextField
        label="Filter by Title"
        variant="outlined"
        value={filterText}
        onChange={handleFilterChange}
        fullWidth
        sx={{ marginBottom: '20px' }}
      />

      {/* Add Estimation Button */}
      {/* <Button variant="contained" color="primary" onClick={() => setOpenModal(true)} sx={{ marginBottom: '20px' }}>
        Add Estimation
      </Button> */}

      {/* Estimations Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Total Items</TableCell>
            <TableCell>Total Cost</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredEstimations?.map((estimation) => (
            <TableRow key={estimation.id}>
              <TableCell>{estimation.title}</TableCell>
              <TableCell>{estimation.description}</TableCell>
              <TableCell>{estimation.items?.length}</TableCell>
              <TableCell>
                {estimation.items?.reduce(
                  (sum, item) => sum + (item.quantity * item.price) + ((item.margin / 100) * (item.quantity * item.price)),
                  0
                ).toFixed(2)}
              </TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => onEdit(estimation)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(estimation.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Handle empty state */}
      {filteredEstimations?.length === 0 && (
        <Typography variant="h6" color="textSecondary" align="center" mt={4}>
          No estimations found
        </Typography>
      )}

      {/* Modal for adding new estimation */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Estimation
          </Typography>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={newEstimation.title}
            onChange={(e) => setNewEstimation({ ...newEstimation, title: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            value={newEstimation.description}
            onChange={(e) => setNewEstimation({ ...newEstimation, description: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Unit"
            variant="outlined"
            fullWidth
            value={newEstimation.unit}
            onChange={(e) => setNewEstimation({ ...newEstimation, unit: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Quantity"
            variant="outlined"
            fullWidth
            value={newEstimation.quantity}
            onChange={(e) => setNewEstimation({ ...newEstimation, quantity: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            value={newEstimation.price}
            onChange={(e) => setNewEstimation({ ...newEstimation, price: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Margin"
            variant="outlined"
            fullWidth
            value={newEstimation.margin}
            onChange={(e) => setNewEstimation({ ...newEstimation, margin: e.target.value })}
            margin="normal"
          />
          <Box sx={{ marginTop: '16px', textAlign: 'right' }}>
            <Button variant="contained" color="primary" onClick={handleAddSection}>
              Add Estimation
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default EstimationList;
