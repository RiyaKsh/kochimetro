
import { create } from "zustand";
import { axiosInstance } from './axios.js';
export const useAuth = create((set) => ({
    authUser: null,
    isSigningUp:false,
    isLoggingIn:false,
    isCheckingAuth: true,
    checkAuth: async () => {
        try {
        const token = localStorage.getItem("token"); 
        const res = await axiosInstance.get('/auth/auth-check', {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });
        set({ authUser: res.data.user });
    } catch (error) {
        console.error("Error checking auth:", error);
        set({ authUser: null }); 
    } finally {
        set({ isCheckingAuth: false });
    }
    }
}))