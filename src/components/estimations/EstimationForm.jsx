import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  fetchEstimationSections,
  createEstimationSection,
  updateEstimationSection,
  deleteEstimationSection,
  createItemForSection,
  updateItemForSection,
  deleteItemForSection,
} from '../../store/estimationSlice';
import { Button, TextField, Stack, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

// Validation Schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Section title is required'),
  items: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Item title is required'),
      description: Yup.string().required('Description is required'),
      unit: Yup.string().required('Unit is required'),
      quantity: Yup.number().required('Quantity is required').positive(),
      price: Yup.number().required('Price is required').positive(),
      margin: Yup.number().required('Margin is required').min(0).max(100),
    })
  ),
});

const EstimationForm = () => {
  const dispatch = useDispatch();
  const sections = useSelector((state) => state.estimations.sections);
  const [editSection, setEditSection] = useState(null); // Section to be edited
  const [openModal, setOpenModal] = useState(false); // Modal state

  useEffect(() => {
    dispatch(fetchEstimationSections());
  }, [dispatch]);

  

  const calculateTotal = (quantity, price, margin) => {
    return (quantity * price) + ((margin / 100) * (quantity * price));
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
  };

  const handleEditSection = (section) => {
    setEditSection(section); // Set section in edit mode
    setOpenModal(true); // Open modal to edit section
  };

  const handleDeleteSection = (sectionId) => {
    dispatch(deleteEstimationSection(sectionId));
  };

  const handleAddItem = (sectionId, item) => {
    dispatch(createItemForSection({ sectionId, item }));
  };

  const handleUpdateItem = (sectionId, itemId, item) => {
    dispatch(updateItemForSection({ sectionId, itemId, item }));
  };

  const handleDeleteItem = (sectionId, itemId) => {
    dispatch(deleteItemForSection({ sectionId, itemId }));
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
        startIcon={<Add />}
      >
        Add New Section
      </Button>

      {/* Modal with Estimation Form */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editSection ? 'Edit Section' : 'Add New Section'}</DialogTitle>
        <DialogContent>
          <Formik
            enableReinitialize
            initialValues={
              editSection
                ? { title: editSection.title, items: editSection.items }
                : { title: '', items: [{ title: '', description: '', unit: '', quantity: 0, price: 0, margin: 0, total: 0 }] }
            }
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => handleAddSection(values, resetForm)}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                <Typography variant="h6">{editSection ? 'Edit Section' : 'Add New Section'}</Typography>

                <TextField
                  label="Section Title"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                  fullWidth
                />

                {/* Items */}
                <FieldArray name="items">
                  {({ push, remove }) => (
                    <>
                      {values.items.map((item, index) => (
                        <Stack direction="row" spacing={2} key={index} mt={2}>
                          <TextField
                            label="Item Title"
                            name={`items[${index}].title`}
                            value={item.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.items?.[index]?.title && Boolean(errors.items?.[index]?.title)}
                            helperText={touched.items?.[index]?.title && errors.items?.[index]?.title}
                          />

                          <TextField
                            label="Description"
                            name={`items[${index}].description`}
                            value={item.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.items?.[index]?.description && Boolean(errors.items?.[index]?.description)}
                            helperText={touched.items?.[index]?.description && errors.items?.[index]?.description}
                          />

                          <TextField
                            label="Unit"
                            name={`items[${index}].unit`}
                            value={item.unit}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.items?.[index]?.unit && Boolean(errors.items?.[index]?.unit)}
                            helperText={touched.items?.[index]?.unit && errors.items?.[index]?.unit}
                          />

                          <TextField
                            label="Quantity"
                            name={`items[${index}].quantity`}
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const updatedQuantity = e.target.value;
                              setFieldValue(`items[${index}].quantity`, updatedQuantity);
                              const total = calculateTotal(updatedQuantity, item.price, item.margin);
                              setFieldValue(`items[${index}].total`, total);
                            }}
                            onBlur={handleBlur}
                            error={touched.items?.[index]?.quantity && Boolean(errors.items?.[index]?.quantity)}
                            helperText={touched.items?.[index]?.quantity && errors.items?.[index]?.quantity}
                          />

                          <TextField
                            label="Price"
                            name={`items[${index}].price`}
                            type="number"
                            value={item.price}
                            onChange={(e) => {
                              const updatedPrice = e.target.value;
                              setFieldValue(`items[${index}].price`, updatedPrice);
                              const total = calculateTotal(item.quantity, updatedPrice, item.margin);
                              setFieldValue(`items[${index}].total`, total);
                            }}
                            onBlur={handleBlur}
                            error={touched.items?.[index]?.price && Boolean(errors.items?.[index]?.price)}
                            helperText={touched.items?.[index]?.price && errors.items?.[index]?.price}
                          />

                          <TextField
                            label="Margin (%)"
                            name={`items[${index}].margin`}
                            type="number"
                            value={item.margin}
                            onChange={(e) => {
                              const updatedMargin = e.target.value;
                              setFieldValue(`items[${index}].margin`, updatedMargin);
                              const total = calculateTotal(item.quantity, item.price, updatedMargin);
                              setFieldValue(`items[${index}].total`, total);
                            }}
                            onBlur={handleBlur}
                            error={touched.items?.[index]?.margin && Boolean(errors.items?.[index]?.margin)}
                            helperText={touched.items?.[index]?.margin && errors.items?.[index]?.margin}
                          />

                          <TextField
                            label="Total"
                            name={`items[${index}].total`}
                            value={calculateTotal(item.quantity, item.price, item.margin)}
                            disabled
                          />

                          <IconButton onClick={() => remove(index)}>
                            <Remove />
                          </IconButton>
                        </Stack>
                      ))}

                      <Button
                        onClick={() =>
                          push({ title: '', description: '', unit: '', quantity: 0, price: 0, margin: 0, total: 0 })
                        }
                        variant="outlined"
                        startIcon={<Add />}
                      >
                        Add Item
                      </Button>
                    </>
                  )}
                </FieldArray>

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                  {editSection ? 'Update Section' : 'Add Section'}
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Existing Sections List */}
      <div>
        <Typography variant="h6" mt={4}>
          Existing Sections
        </Typography>
        {sections.map((section) => (
          <div key={section.id} style={{ marginTop: '20px' }}>
            <Typography variant="h6">{section.title}</Typography>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleEditSection(section)}
              sx={{ mr: 2 }}
            >
              Edit Section
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDeleteSection(section.id)}
            >
              Delete Section
            </Button>

            {/* Items */}
            {section.items.map((item) => (
              <div key={item.id}>
                <Typography>{item.title}</Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleUpdateItem(section.id, item.id, item)}
                  sx={{ mr: 2 }}
                >
                  Edit Item
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteItem(section.id, item.id)}
                >
                  Delete Item
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default EstimationForm;
