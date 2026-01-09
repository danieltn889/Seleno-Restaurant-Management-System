// src/hooks/useUsers.js
import { useState } from "react";

let usersData = [
  { id: 1, firstname: "John", lastname: "Doe", email: "john@mail.com", user_role: "Admin", user_status: "active", user_phone: "0780019550" },
  { id: 2, firstname: "Jane", lastname: "Smith", email: "jane@mail.com", user_role: "Staff", user_status: "active", user_phone: "0780098765" },
];

export default function useUsers() {
  const [users, setUsers] = useState(usersData);

  const listUsers = () => Promise.resolve(users);

  const addUser = (user) => {
    const newUser = { ...user, id: users.length + 1 };
    const newUsers = [...users, newUser];
    setUsers(newUsers);
    usersData = newUsers;
    return Promise.resolve(newUser);
  };

  const updateUser = (id, updated) => {
    const newUsers = users.map((u) => (u.id === id ? { ...u, ...updated } : u));
    setUsers(newUsers);
    usersData = newUsers;
    return Promise.resolve(updated);
  };

  const deleteUser = (id) => {
    const newUsers = users.filter((u) => u.id !== id);
    setUsers(newUsers);
    usersData = newUsers;
    return Promise.resolve();
  };

  const getUserById = (id) => {
    const user = users.find((u) => u.id === Number(id));
    return Promise.resolve(user);
  };

  return { users, listUsers, addUser, updateUser, deleteUser, getUserById };
}
