import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { getProfile } from "../services/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        setUser(null);
        return;
      }
      const data = await getProfile();
      setUser(data);
    } catch (err) {
      setError(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => loadUser();

  return { user, loading, error, refresh };
}