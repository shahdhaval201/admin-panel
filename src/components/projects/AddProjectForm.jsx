import React from 'react';
import { Button, TextField, Stack, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { addProject, updateProject } from '../../store/projectSlice'; // Ensure updateProject is imported

// Validation schema using Yup
const validationSchema = Yup.object({
  customerName: Yup.string().required('Customer Name is required'),
  referenceNumber: Yup.string().required('Reference Number is required'),
  projectName: Yup.string().required('Project Name is required'),
  projectNumber: Yup.string().required('Project Number is required'),
  areaLocation: Yup.string().required('Area Location is required'),
  address: Yup.string().required('Address is required'),
  dueDate: Yup.date().required('Due Date is required'),
  contact: Yup.string().required('Contact is required'),
  manager: Yup.string().required('Manager is required'),
  staff: Yup.string().required('Staff is required'),
  status: Yup.string().required('Status is required'),
});

const AddProjectForm = ({ project, onSave, onClose }) => {
  console.log("project------->",project);
  
  const dispatch = useDispatch();

  // Initial values for the form, either new project or pre-filled for editing
  const initialValues = project
    ? {
        customerName: project.customerName || '',
        referenceNumber: project.referenceNumber || '',
        projectName: project.projectName || '',
        projectNumber: project.projectNumber || '',
        areaLocation: project.areaLocation || '',
        address: project.address || '',
        dueDate: project.dueDate || '',
        contact: project.contact || '',
        manager: project.manager || '',
        staff: project.staff || '',
        status: project.status || '',
      }
    : {
        customerName: '',
        referenceNumber: '',
        projectName: '',
        projectNumber: '',
        areaLocation: '',
        address: '',
        dueDate: '',
        contact: '',
        manager: '',
        staff: '',
        status: '',
      };

  const handleSubmit = (values) => {
    if (project) {
      // If project exists, call onSave with the updated values
      onSave({ ...project, ...values });
    } else {
      // Else dispatch addProject
      dispatch(addProject(values));
    }
    onClose(); // Close the modal after submitting
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, handleChange, handleBlur, values }) => (
        <Form>
          <Stack spacing={2}>
            <Typography variant="h6">{project ? 'Edit Project' : 'Add New Project'}</Typography>

            {/* Customer Name Field */}
            <TextField
              name="customerName"
              label="Customer Name"
              value={values.customerName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.customerName && Boolean(errors.customerName)}
              helperText={touched.customerName && errors.customerName}
              required
              fullWidth
            />

            {/* Reference Number Field */}
            <TextField
              name="referenceNumber"
              label="Reference Number"
              value={values.referenceNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.referenceNumber && Boolean(errors.referenceNumber)}
              helperText={touched.referenceNumber && errors.referenceNumber}
              required
              fullWidth
            />

            {/* Project Name Field */}
            <TextField
              name="projectName"
              label="Project Name"
              value={values.projectName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.projectName && Boolean(errors.projectName)}
              helperText={touched.projectName && errors.projectName}
              required
              fullWidth
            />

            {/* Project Number Field */}
            <TextField
              name="projectNumber"
              label="Project Number"
              value={values.projectNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.projectNumber && Boolean(errors.projectNumber)}
              helperText={touched.projectNumber && errors.projectNumber}
              required
              fullWidth
            />

            {/* Area Location Field */}
            <TextField
              name="areaLocation"
              label="Area Location"
              value={values.areaLocation}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.areaLocation && Boolean(errors.areaLocation)}
              helperText={touched.areaLocation && errors.areaLocation}
              required
              fullWidth
            />

            {/* Address Field */}
            <TextField
              name="address"
              label="Address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.address && Boolean(errors.address)}
              helperText={touched.address && errors.address}
              required
              fullWidth
            />

            {/* Due Date Field */}
            <TextField
              name="dueDate"
              label="Due Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={values.dueDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.dueDate && Boolean(errors.dueDate)}
              helperText={touched.dueDate && errors.dueDate}
              required
              fullWidth
            />

            {/* Contact Field */}
            <TextField
              name="contact"
              label="Contact"
              value={values.contact}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.contact && Boolean(errors.contact)}
              helperText={touched.contact && errors.contact}
              required
              fullWidth
            />

            {/* Manager Field */}
            <TextField
              name="manager"
              label="Manager"
              value={values.manager}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.manager && Boolean(errors.manager)}
              helperText={touched.manager && errors.manager}
              required
              fullWidth
            />

            {/* Staff Field */}
            <TextField
              name="staff"
              label="Staff"
              value={values.staff}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.staff && Boolean(errors.staff)}
              helperText={touched.staff && errors.staff}
              required
              fullWidth
            />

            {/* Status Field */}
            <TextField
              name="status"
              label="Status"
              value={values.status}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.status && Boolean(errors.status)}
              helperText={touched.status && errors.status}
              required
              fullWidth
            />

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary">
              {project ? 'Update Project' : 'Add Project'}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default AddProjectForm;
