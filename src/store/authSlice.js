import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Base url for mock api

const API_URL = "http://localhost:5000";

// Async Thunk for login, signup and forgot password

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data.user; // Return user data from the response
    } catch (error) {
        console.log("error---->", error);

        return rejectWithValue(error.response.data.message);
    }
});

export const register = createAsyncThunk("auth/signup", async (credentials, { rejectWithValue }) => {
    try {
        const newUser = {
            firstname: credentials.firstname,
            lastname: credentials.lastname,
            email: credentials.email,
            password: credentials.password
        };

        // API request to register the new user
        const response = await axios.post(`${API_URL}/signup`, newUser);
        console.log("Response-------->", response.data);

        return response.data; // Return user data from the response
    } catch (error) {
        console.log("errordata---->", error);
        return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
});

export const fetchUsers = createAsyncThunk("auth/fetchUsers", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/users`); // Assuming you have a /users endpoint
        return response.data; // Return the users data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
});


export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        return response.data.message; // Return message from the response
    } catch (error) {
        return rejectWithValue(error.response.data.error);
    }
});

// AuthSlice Definition

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('authUser')) || null,
        isLoading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('authUser'); // Remove user from localstorage on logout
        },
        setUsers: (state, action) => {
            state.users = action.payload; // Action to update the list of users
        }
    },
    extraReducers: (builder) => {
        //Handle Login

        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                localStorage.setItem('authUser', JSON.stringify(action.payload));
            })
            .addCase(login.rejected, (state, action) => {
                console.log("action--->", action);

                state.isLoading = false;
                state.error = action.payload;
            });

        //Handle registration

        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                console.log("signupaction------->", action);

                state.isLoading = false;
                state.user = action.payload;
                localStorage.setItem('authUser', JSON.stringify(action.payload))
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        //Handle forgotPassword

        builder
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                alert(action.payload) // Display Success Message
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // fetch users    

        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload; // Update the users list
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

    }
});

export const { logout, setUsers } = authSlice.actions;
export default authSlice.reducer;
