import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/API";

interface AuthContextData {
  userRole: "client" | "barber" | null;
  loading: boolean;
  signIn: (role: "client" | "barber", token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userRole, setUserRole] = useState<"client" | "barber" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorage() {
      try {
        const clientToken = await AsyncStorage.getItem("@client:token");
        const barberToken = await AsyncStorage.getItem("@barber:token");

        if (clientToken) {
          api.defaults.headers.common["Authorization"] =
            `Bearer ${clientToken}`;
          setUserRole("client");
        } else if (barberToken) {
          api.defaults.headers.common["Authorization"] =
            `Bearer ${barberToken}`;
          setUserRole("barber");
        }
      } catch {
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    }
    loadStorage();
  }, []);

  const signIn = async (role: "client" | "barber", token: string) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUserRole(role); // Isso atualiza o App.tsx instantaneamente
  };

  const signOut = async () => {
    setUserRole(null);
    await AsyncStorage.multiRemove([
      "@client:token",
      "@client:user",
      "@barber:token",
      "@barber:user",
    ]);
  };

  return (
    <AuthContext.Provider value={{ userRole, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
