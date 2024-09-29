'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Supabase client creation
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditUser({ params }: { params: { id: string } }) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tel, setTel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [firstnameError, setFirstnameError] = useState(false);
  const [lastnameError, setLastnameError] = useState(false);
  const [roleError, setRoleError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [telError, setTelError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = parseInt(params.id, 10); // แปลง params.id เป็น integer

      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('UserID', userId)
        .single();

      if (error) {
        console.error('Error fetching user:', error.message);
      } else if (data) {
        const names = data.username.split(' ');
        setFirstname(names[0]);
        setLastname(names[1]);
        setRole(data.Role);
        setEmail(data.Email);
        setPassword(data.Password); // อาจจะไม่ควรแสดงรหัสผ่านในกรณีจริง
        setTel(data.Tel);
      }
    };

    fetchUser();
  }, [params.id]);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // If form is already being submitted, return to prevent double submission
    if (isSubmitting) return;

    setFirstnameError(false);
    setLastnameError(false);
    setRoleError(false);
    setEmailError(false);
    setPasswordError(false);
    setTelError(false);

    let valid = true;
    if (!firstname) {
      setFirstnameError(true);
      valid = false;
    }
    if (!lastname) {
      setLastnameError(true);
      valid = false;
    }
    if (!role) {
      setRoleError(true);
      valid = false;
    }
    if (!email) {
      setEmailError(true);
      valid = false;
    }
    if (!password) {
      setPasswordError(true);
      valid = false;
    }
    if (!tel || tel.length !== 10 || !/^\d{10}$/.test(tel)) {
      setTelError(true);
      valid = false;
    }

    if (!valid) return;

    setIsSubmitting(true); // Set isSubmitting to true to disable the form

    try {
      // Update user data in Supabase
      const userId = parseInt(params.id, 10);
      const { error } = await supabase
        .from('Users')
        .update({
          username: `${firstname} ${lastname}`,
          Role: role,
          Email: email,
          Tel: tel,
          Password: password, // อัปเดตรหัสผ่านด้วย (ถ้ามีการเปลี่ยนแปลง)
        })
        .eq('UserID', userId);

      if (error) {
        console.error('Error updating user:', error.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsSubmitting(false); // Always reset isSubmitting when the process completes
    }
  };

  return (
    <div className="p-10 bg-orange-100 min-h-screen">
      <h1 className="text-4xl font-bold text-purple-700 mb-6">Edit User</h1>
      <form onSubmit={handleUpdateUser} className="mt-8 space-y-6 px-32">
        <h2 className="text-5xl mb-4 font-bold">Edit User</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstname" className="block mb-2">
              Firstname
            </label>
            <input
              type="text"
              id="firstname"
              placeholder="Firstname"
              className={`p-3 border ${firstnameError ? 'border-red-500' : 'border-gray-300'} rounded-md w-full`}
              value={firstname}
              onChange={(e) => {
                setFirstname(e.target.value);
                if (e.target.value) setFirstnameError(false);
              }}
              maxLength={50}
            />
            {firstnameError && (
              <p className="text-red-500 mt-1">Please enter a first name</p>
            )}
          </div>

          <div>
            <label htmlFor="lastname" className="block mb-2">
              Lastname
            </label>
            <input
              type="text"
              id="lastname"
              placeholder="Lastname"
              className={`p-3 border ${lastnameError ? 'border-red-500' : 'border-gray-300'} rounded-md w-full`}
              value={lastname}
              onChange={(e) => {
                setLastname(e.target.value);
                if (e.target.value) setLastnameError(false);
              }}
              maxLength={50}
            />
            {lastnameError && (
              <p className="text-red-500 mt-1">Please enter a last name</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="role" className="block mb-2">
            Role
          </label>
          <select
            id="role"
            className={`p-3 border ${roleError ? 'border-red-500' : 'border-gray-300'} rounded-md w-1/2`}
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              if (e.target.value) setRoleError(false);
            }}
          >
            <option value="">Select Role</option>
            <option value="Instructor">Instructor</option>
            <option value="ExamOfficer">Exam Officer</option>
            <option value="TechUnit">Tech Unit</option>
            <option value="Admin">Admin</option>
          </select>
          {roleError && (
            <p className="text-red-500 mt-1">Please select a role</p>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="tel" className="block mb-2">
            Telephone
          </label>
          <input
            type="tel"
            id="tel"
            placeholder="Enter 10-digit telephone number"
            className={`p-3 border ${telError ? 'border-red-500' : 'border-gray-300'} rounded-md w-1/2`}
            value={tel}
            onChange={(e) => {
              setTel(e.target.value);
              if (/^\d{10}$/.test(e.target.value)) {
                setTelError(false);
              }
            }}
            maxLength={10}
          />
          {telError && (
            <p className="text-red-500 mt-1">
              Please enter a valid 10-digit telephone number
            </p>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className={`p-3 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md w-1/2`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value) setEmailError(false);
            }}
          />
          {emailError && (
            <p className="text-red-500 mt-1">Please enter an email</p>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className={`p-3 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md w-1/2`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value) setPasswordError(false);
            }}
            maxLength={30}
          />
          {passwordError && (
            <p className="text-red-500 mt-1">Please enter a password</p>
          )}
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            type="button"
            className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-400"
            onClick={() => router.push('/dashboard')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-700 text-white px-8 py-3 rounded-full hover:bg-blue-400"
            disabled={isSubmitting} // Disable button when submitting
          >
            {isSubmitting ? 'Submitting...' : 'Update User'}
          </button>
        </div>
      </form>
    </div>
  );
}
