import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = "http://localhost:5000";

// fetch project

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/projects`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

// Add new project

export const addProject = createAsyncThunk('projects/addProject', async (projectData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/projects`, projectData);
        console.log("addproject----->",response);
        
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

// update project

export const updateProject = createAsyncThunk('projects/updateProject', async ({ id, projectData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/projects/${id}`, projectData);
        console.log("projectData---->",response);
        
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

// delete project

export const deleteProject = createAsyncThunk('projects/deleteProject', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${API_URL}/projects/${id}`);
        console.log("response-------->", response)
        return id;  // Return the ID of the deleted project
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        projects: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        // Handle fetchProject actions
        builder.addCase(fetchProjects.pending, (state) => {
            state.loading = true;
        })
            .addCase(fetchProjects.fulfilled, (state,action) => {
                state.loading = false;
                state.projects = action.payload;
                
            })
            .addCase(fetchProjects.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Handle addProject

        builder.addCase(addProject.fulfilled, (state, action) => {
            state.projects.push(action.payload);
            localStorage.setItem('projects', JSON.stringify(state));  // Save projects to localStorage
        });

        // Handle updateProject

        builder.addCase(updateProject.fulfilled, (state, action) => {
            const index = state.projects.findIndex(project => project.id === action.payload.id);
            if (index !== -1) {
                state.projects[index] = action.payload;
            }
            localStorage.setItem('projects', JSON.stringify(state.projects));  // Save updated projects to localStorage
        })
        .addCase(updateProject.rejected, (state, action) => {
            state.error = action.payload;
        });

        // Handle deleteProject
        builder.addCase(deleteProject.fulfilled, (state, action) => {
            state.projects = state.projects.filter(project => project.id !== action.payload);
            localStorage.setItem('projects', JSON.stringify(state.projects));
        });
    }
});


export default projectSlice.reducer;