import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { User } from "firebase/auth";
import {
  login,
  logout,
  onAuthChange,
  register,
} from "../components/firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../models/user-profile";
import {
  createUserProfile,
  getUserProfile,
  isUsernameTaken,
  updateLastConnection,
} from "../components/firebase/firestore";
import zxcvbn from "zxcvbn";
import { useTranslation } from "react-i18next";

interface AuthContextType {
  userProfile: UserProfile | null;
  authMode: "signIn" | "register";
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  username: string;
  setUsername: (username: string) => void;
  handleRegister: () => Promise<void>;
  handleSignIn: () => Promise<void>;
  handleSignOut: () => Promise<void>;
  toggleAuthMode: () => void;
  privacyPolicyAccepted: boolean;
  setPrivacyPolicyAccepted: (accepted: boolean) => void;
  error: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<"signIn" | "register">("signIn");
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setError("");
      if (firebaseUser) {
        setUserProfile(await getUserProfile(firebaseUser.uid));
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setError("");
    setPrivacyPolicyAccepted(false);
    setAuthMode("signIn");
  };

  const isValidUsername = (name: string) => /^[a-zA-Z0-9_]{3,20}$/.test(name);

  const handleRegister = useCallback(async () => {
    setError("");
    if (!privacyPolicyAccepted) {
      setError(t("privacyNotAccepted"));
      return;
    }
    if (!email || !password || !username) {
      setError(t("fillAllFields"));
      return;
    }
    if (!isValidUsername(username)) {
      setError(t("invalidUsername"));
      return;
    }
    if (zxcvbn(password).score < 3) {
      setError(t("weakPassword"));
      return;
    }
    try {
      if (await isUsernameTaken(username)) {
        setError(t("usernameTaken"));
        return;
      }
      const userCredential = await register(email, password);
      const uid = userCredential.user.uid;
      await createUserProfile(uid, username);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("unknownError"));
    }
  }, [email, password, username]);

  const handleSignIn = useCallback(async () => {
    setError("");
    if (!email || !password) {
      setError(t("missingEmailPassword"));
      return;
    }
    try {
      const creds = await login(email, password);
      await updateLastConnection(creds.user.uid);
      resetForm();
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("unknownError"));
    }
  }, [email, password]);

  const handleSignOut = useCallback(async () => {
    await logout();
    setUserProfile(null);
  }, []);

  const toggleAuthMode = () => {
    setError("");
    setAuthMode(authMode === "signIn" ? "register" : "signIn");
  };

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        error,
        authMode,
        email,
        setEmail,
        password,
        setPassword,
        username,
        setUsername,
        privacyPolicyAccepted,
        setPrivacyPolicyAccepted,
        handleRegister,
        handleSignIn,
        handleSignOut,
        toggleAuthMode,
        isAuthenticated: !!userProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
