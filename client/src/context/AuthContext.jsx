import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../api/authApi";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isOnboarded: false,
  accessToken: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        isOnboarded: action.payload.user?.isOnboarded || false,
        isLoading: false,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        isOnboarded: action.payload?.isOnboarded ?? state.isOnboarded,
      };

    case "LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };

    case "SET_ONBOARDED":
      return {
        ...state,
        isOnboarded: true,
        user: { ...state.user, isOnboarded: true },
      };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    try {
      const response = await authAPI.getMe();
      if (response.data.success) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: response.data.data.user,
            accessToken: token,
          },
        });
        return;
      }
      throw new Error("Auth failed");
    } catch (error) {
      try {
        const refreshResponse = await authAPI.refreshToken();
        if (refreshResponse.data.success) {
          const newToken = refreshResponse.data.data.accessToken;
          localStorage.setItem("accessToken", newToken);

          const meResponse = await authAPI.getMe();
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user: meResponse.data.data.user,
              accessToken: newToken,
            },
          });
          return;
        }
        throw new Error("Refresh failed");
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        dispatch({ type: "LOGOUT" });
      }
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user, accessToken } = response.data.data;

      localStorage.setItem("accessToken", accessToken);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, accessToken },
      });

      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const signup = useCallback(async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      const { user, accessToken } = response.data.data;

      localStorage.setItem("accessToken", accessToken);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, accessToken },
      });

      toast.success(`Welcome to TalishFits, ${user.name.split(" ")[0]}`);
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const googleLogin = useCallback(async (credential) => {
    try {
      const response = await authAPI.googleLogin({ credential });
      const { user, accessToken } = response.data.data;

      localStorage.setItem("accessToken", accessToken);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, accessToken },
      });

      toast.success(`Welcome, ${user.name.split(" ")[0]}`);
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || "Google login failed";
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {}
    localStorage.removeItem("accessToken");
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully");
  }, []);

  const updateUser = useCallback((userData) => {
    dispatch({ type: "UPDATE_USER", payload: userData });
  }, []);

  const setOnboarded = useCallback(() => {
    dispatch({ type: "SET_ONBOARDED" });
  }, []);

  const value = {
    ...state,
    login,
    signup,
    googleLogin,
    logout,
    updateUser,
    setOnboarded,
    initializeAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthContext;
