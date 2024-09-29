'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

// Supabase client creation
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface User {
  UserID: number; // Use UserID instead of UserKey
  username: string;
  Role: string;
  Email: string;
  CreatedAt: string; // Ensure that the CreatedAt field is included
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter(); // Initialize router

  // Fetch users from Supabase
  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from('Users').select('*');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data as User[]);
      }
    }
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user? This action cannot be undone.'
    );
    if (confirmed) {
      await supabase.from('Users').delete().eq('UserID', userId);
      setUsers(users.filter((user) => user.UserID !== userId));
    }
  };

  const handleAddUser = () => {
    router.push('/addUser'); // Navigate to Add User page
  };
  const handleEditUser = (userId: number) => {
    router.push(`/editUser/${userId}`);
  };

  return (
    <div className="p-10 bg-orange-100 min-h-screen">
      <h1 className="text-4xl font-bold text-purple-700 mb-6">Exam printer</h1>
      <p className="text-xl mb-2">
        ระบบจัดพิมพ์ข้อสอบ <br /> คณะวิทยาศาสตร์ มหาวิทยาลัยสงขลานครินทร์
      </p>

      <div className="mt-8">
        <h2 className="text-5xl mb-4 font-bold">Admin</h2>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddUser}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-400"
          >
            + Add User
          </button>
        </div>

        <table className="w-full table-auto bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Email</th>
              <th className="p-3">Add Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.UserID} className="border-b">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.Role}</td>
                <td className="p-3">{user.Email}</td>
                <td className="p-3">
                  {new Date(user.CreatedAt).toLocaleDateString('th-TH', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </td>
                <td className="p-3 flex space-x-2">
                  <button
                    className="text-black"
                    onClick={() => handleEditUser(user.UserID)}
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.UserID)}
                    className="text-red-500"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
