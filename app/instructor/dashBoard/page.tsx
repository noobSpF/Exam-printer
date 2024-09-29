'use client'; // Required for client-side rendering

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client creation
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define types for your data
interface ExamData {
  Subject: string;
  Term: string;
  DueDate: string;
  Instructor: string;
  Status: string;
  AmountStudent: number;
}

export default function MyExamPage() {
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter states
  const [subject, setSubject] = useState<string>('All subject');
  const [term, setTerm] = useState<string>('All term');
  const [dueDate, setDueDate] = useState<string>(''); // This will be a date string
  const [status, setStatus] = useState<string>('All status');
  const [instructor, setInstructor] = useState<string>('All instructor');

  // Fetch exam data
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data, error } = await supabase.from('Exam') // Fetch data from your 'Exam' table
          .select(`
            SubID, 
            Status, 
            ExamDate, 
            Instructor, 
            AmountStudent
          `);

        if (error) {
          console.error('Error fetching exams:', error);
        } else {
          const transformedExams = data.map((exam: any) => ({
            Subject: exam.SubID, // Assuming SubID holds the subject identifier
            Term: 'Midterm', // This is static; adjust based on your data
            DueDate: new Date(exam.ExamDate).toLocaleDateString(), // Format date
            Instructor: exam.Instructor, // Assuming Instructor field holds the name
            Status: exam.Status === 'Not Submitted' ? 'Not Submitted' : 'Issue', // Custom logic for status
            AmountStudent: exam.AmountStudent,
          }));
          setExams(transformedExams);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // Handle filter application
  const handleApplyFilters = () => {
    // TODO: Apply filters to the fetched data
    // You can use the states like `subject`, `term`, `dueDate`, `status`, and `instructor` to filter the data
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 bg-gray-900 text-center">
          <h1 className="text-2xl font-bold">Exam Printer</h1>
          <p className="text-sm mt-1">ระบบจัดพิมพ์ข้อสอบ</p>
          <p className="text-xs">คณะวิทยาศาสตร์ ม.อ.</p>
        </div>
        <nav className="mt-10 flex-grow">
          <ul>
            <li className="px-4 py-2 bg-gray-700">My exam</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        <div className="flex justify-between items-center p-4 bg-gray-100">
          <h2 className="text-3xl font-bold text-gray-800">Semester: 1/2567</h2>

          {/* User Icon */}
          <div className="relative">
            <button className="w-10 h-10 bg-gray-900 text-white rounded-full flex justify-center items-center">
              👤
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="p-6 bg-white border-b">
          <h2 className="text-2xl font-bold mb-4">Filter by</h2>
          <div className="flex space-x-4">
            {/* Subject Filter */}
            <div className="flex flex-col">
              <label className="text-gray-600">Subject</label>
              <select
                className="border p-2 rounded-lg"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option>All subject</option>
                {/* Add other subject options dynamically if needed */}
              </select>
            </div>

            {/* Term Filter */}
            <div className="flex flex-col">
              <label className="text-gray-600">Term</label>
              <select
                className="border p-2 rounded-lg"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              >
                <option>All term</option>
                <option>Midterm</option>
                <option>Final</option>
              </select>
            </div>

            {/* Due Date Filter */}
            <div className="flex flex-col">
              <label className="text-gray-600">Due date</label>
              <input
                type="date"
                className="border p-2 rounded-lg"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-col">
              <label className="text-gray-600">Status</label>
              <select
                className="border p-2 rounded-lg"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>All status</option>
                <option>Not Submitted</option>
                <option>Issue</option>
              </select>
            </div>

            {/* Instructor Filter */}
            <div className="flex flex-col">
              <label className="text-gray-600">Instructor</label>
              <select
                className="border p-2 rounded-lg"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              >
                <option>All instructor</option>
                {/* Dynamically load instructor names */}
              </select>
            </div>

            {/* Apply Button */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={handleApplyFilters}
            >
              Apply
            </button>
          </div>
        </div>

        {/* Table Section */}
        <main className="p-6 bg-gray-100 flex-grow">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My exam</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4">Subject</th>
                  <th className="py-2 px-4">Term</th>
                  <th className="py-2 px-4">Due Date</th>
                  <th className="py-2 px-4">Instructor</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Amount Student</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4">{exam.Subject}</td>
                    <td className="py-2 px-4">{exam.Term}</td>
                    <td className="py-2 px-4">{exam.DueDate}</td>
                    <td className="py-2 px-4">{exam.Instructor}</td>
                    <td
                      className={`py-2 px-4 ${
                        exam.Status === 'Not Submitted'
                          ? 'text-red-500'
                          : 'text-yellow-500'
                      }`}
                    >
                      {exam.Status}
                    </td>
                    <td className="py-2 px-4">{exam.AmountStudent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
}
