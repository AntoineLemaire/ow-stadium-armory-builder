import { useState, useEffect, useCallback, ReactNode } from "react";
import zxcvbn from "zxcvbn";
import { UserProfile } from "../models/user-profile";
import {
  login,
  logout,
  onAuthChange,
  register,
} from "../components/firebase/auth";
import {
  createUserProfile,
  getUserProfile,
  isUsernameTaken,
  updateLastConnection,
} from "../components/firebase/firestore";
import AuthForm from "../components/common/auth-form";
import { useNavigate } from "react-router-dom";

interface UseAuthStateReturn {
  userProfile: UserProfile | null;
  authMode: "signIn" | "register";
  authContent: ReactNode;
  handleSignOut: () => Promise<void>;
}

const useAuthState = (): UseAuthStateReturn => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const [authMode, setAuthMode] = useState<"signIn" | "register">("signIn");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

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
    setAuthMode("signIn");
  };

  const isValidUsername = (name: string) => /^[a-zA-Z0-9_]{3,15}$/.test(name);

  const handleRegister = useCallback(async () => {
    setError("");
    if (!email || !password || !username) {
      setError("Please fill all fields.");
      return;
    }
    if (!isValidUsername(username)) {
      setError(
        "Username must be 3-15 characters, letters, numbers, or underscores."
      );
      return;
    }
    if (zxcvbn(password).score < 3) {
      setError("Password is not strong enough.");
      return;
    }
    try {
      if (await isUsernameTaken(username)) {
        setError("Username is already taken.");
        return;
      }
      const userCredential = await register(email, password);
      const uid = userCredential.user.uid;
      await createUserProfile(uid, username);
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    }
  }, [email, password, username]);

  const handleSignIn = useCallback(async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    try {
      const creds = await login(email, password);
      await updateLastConnection(creds.user.uid);
      resetForm();
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
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

  // Compose the auth form UI with props and handlers
  const authContent = (
    <AuthForm
      authMode={authMode}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      username={username}
      setUsername={setUsername}
      error={error}
      onSignIn={handleSignIn}
      onRegister={handleRegister}
      onToggleMode={toggleAuthMode}
    />
  );

  return { userProfile, authMode, authContent, handleSignOut };
};

export default useAuthState;
