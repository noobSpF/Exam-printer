'use client'; // Ensure the component is treated as a Client Component

import { useState } from 'react';
import { signInAction } from './actions';
import { useRouter } from 'next/navigation'; // To handle redirects on success

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const result = await signInAction(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      // Redirect to the protected route after a successful login
      router.push('/protected');
    }
  };

  return (
    <div className="min-h-screen flex flex-row">
      {/* Left Side - Image */}
      <div className="w-2/5 bg-gray-100 flex items-center justify-center">
        <img
          src="/assets/login.png"
          alt="Login Illustration"
          className=" h-auto"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-3/5 flex items-center justify-center bg-grey">
        <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-lg lg:max-w-xl">
          <h1 className="text-3xl font-semibold mb-4 text-center text-purple-700">
            Exam printer
          </h1>
          <p className="text-sm text-gray-600 mb-6 text-center">
            ระบบจัดพิมพ์ข้อสอบ
            <br />
            คณะวิทยาศาสตร์ มหาวิทยาลัยสงขลานครินทร์
          </p>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col gap-2 relative">
              <div className="flex items-center">
                {/* Email Icon */}
                <img
                  src="/assets/email.png"
                  alt="Email Icon"
                  className="w-5 h-5 mr-2"
                />
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
              </div>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                required
                className="p-3 border rounded-md border-gray-300 w-full pl-10 focus:outline-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2 relative">
              <div className="flex items-center">
                {/* Password Icon */}
                <img
                  src="/assets/key.png"
                  alt="Password Icon"
                  className="w-5 h-5 mr-2"
                />
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="********"
                  required
                  className="p-3 border rounded-md border-gray-300 w-full pl-10 focus:outline-purple-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-purple-600"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? '👁️' : '🔒'}
                </span>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="rounded-sm text-purple-600"
              />
              <label htmlFor="remember" className="text-sm">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-purple-600 text-white py-3 rounded-md text-center hover:bg-purple-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
