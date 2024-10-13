import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/estimations';

// Fetch sections
export const fetchEstimationSections = createAsyncThunk('estimations/fetchSections', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

// Add a new section
export const createEstimationSection = createAsyncThunk('estimations/createSection', async (section) => {
  const response = await axios.post(API_URL, section);
  return response.data;
});

// Update a section
export const updateEstimationSection = createAsyncThunk('estimations/updateSection', async (section) => {
  const response = await axios.put(`${API_URL}/${section.id}`, section);
  return response.data;
});

// Delete a section
export const deleteEstimationSection = createAsyncThunk('estimations/deleteSection', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id; // Return the section ID to delete from the state
});

// Add a new item to a section
export const createItemForSection = createAsyncThunk('estimations/createItem', async ({ sectionId, item }) => {
  const section = await axios.get(`${API_URL}/${sectionId}`);
  section.data.items.push(item); // Add the new item to the items array
  const response = await axios.put(`${API_URL}/${sectionId}`, section.data); // Update the section with the new item
  return { sectionId, item: response.data.items[response.data.items.length - 1] }; // Return the updated section and the new item
});

// Update an item in a section
export const updateItemForSection = createAsyncThunk('estimations/updateItem', async ({ sectionId, item }) => {
  const section = await axios.get(`${API_URL}/${sectionId}`);
  const itemIndex = section.data.items.findIndex((i) => i.id === item.id); // Find the item by ID
  if (itemIndex !== -1) {
    section.data.items[itemIndex] = item; // Update the item in the array
  }
  const response = await axios.put(`${API_URL}/${sectionId}`, section.data); // Save the updated section
  return { sectionId, item: response.data.items[itemIndex] }; // Return the updated item
});

// Delete an item from a section
export const deleteItemForSection = createAsyncThunk('estimations/deleteItem', async ({ sectionId, itemId }) => {
  const section = await axios.get(`${API_URL}/${sectionId}`);
  section.data.items = section.data.items.filter((item) => item.id !== itemId); // Filter out the item by ID
  await axios.put(`${API_URL}/${sectionId}`, section.data); // Update the section after deletion
  return { sectionId, itemId }; // Return the section ID and the item ID to delete from the state
});

const estimationSlice = createSlice({
  name: 'estimations',
  initialState: {
    sections: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch sections
      .addCase(fetchEstimationSections.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEstimationSections.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sections = action.payload; // Store fetched sections
      })
      .addCase(fetchEstimationSections.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Create section
      .addCase(createEstimationSection.fulfilled, (state, action) => {
        state.sections.push(action.payload); // Add the new section to the list
      })

      // Update section
      .addCase(updateEstimationSection.fulfilled, (state, action) => {
        const index = state.sections.findIndex((section) => section.id === action.payload.id);
        if (index !== -1) {
          state.sections[index] = action.payload; // Update the section with the new data
        }
      })

      // Delete section
      .addCase(deleteEstimationSection.fulfilled, (state, action) => {
        state.sections = state.sections.filter((section) => section.id !== action.payload); // Remove the deleted section
      })

      // Add item
      .addCase(createItemForSection.fulfilled, (state, action) => {
        const section = state.sections.find((sec) => sec.id === action.payload.sectionId);
        section.items.push(action.payload.item); // Add the new item to the section's items
      })

      // Update item
      .addCase(updateItemForSection.fulfilled, (state, action) => {
        const section = state.sections.find((sec) => sec.id === action.payload.sectionId);
        const itemIndex = section.items.findIndex((item) => item.id === action.payload.item.id);
        if (itemIndex !== -1) {
          section.items[itemIndex] = action.payload.item; // Update the item in the section
        }
      })

      // Delete item
      .addCase(deleteItemForSection.fulfilled, (state, action) => {
        const section = state.sections.find((sec) => sec.id === action.payload.sectionId);
        section.items = section.items.filter((item) => item.id !== action.payload.itemId); // Remove the item
      });
  },
});

export default estimationSlice.reducer;
