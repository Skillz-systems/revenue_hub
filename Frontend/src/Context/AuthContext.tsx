// import React, { createContext, useContext, useState, ReactNode } from "react";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import { hasTokenExpired } from '../Utils/client';

// interface AuthContextType {
//     user: any;
//     login: (userData: any) => void;
//     logout: () => void;
// }

// interface AuthProviderProps {
//     children: ReactNode;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//     const [user, setUser] = useState<any | null>(null);
//     const navigate = useNavigate();

//     // Function to login a user
//     const login = (userData: any) => {
//         // Save token to cookies
//         Cookies.set("token", userData.data.token, { expires: 7 }); // Token expires in 7 days
//         setUser(userData);
//         console.log("Token:", userData.data.token)
//         console.log("User:", user)
//         navigate("/");
//     };

//     // Function to logout a user
//     const logout = () => {
//         // Remove token from cookies
//         Cookies.remove("token");
//         setUser(null);
//     };

//     // React.useEffect(() => {
//     //     const token = Cookies.get("token");
//     //     if (token && !hasTokenExpired(token)) {
//     //         setUser({ data: { token } });
//     //     }
//     // }, []);

//     return (
//         <AuthContext.Provider value={{ user, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // Custom hook to access authentication context
// export const useAuth = (): AuthContextType => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be used within an AuthProvider");
//     }
//     return context;
// };