'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Supabase client creation
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define types for your data
interface BackupData {
  Subject: string;
  Subjectname: string;
  Term: string;
  DueDate: string;
  Instructor: string;
  Status: string;
  Semester: string; // Add Semester to handle filtering
}

export default function ExamOfficerPage() {
  const [exams, setExams] = useState<BackupData[]>([]);
  const [subjects, setSubjects] = useState<
    { SubID: string; SubName: string; Instructor: string }[]
  >([]); // Subjects state
  const [loading, setLoading] = useState<boolean>(true);

  // Filter states
  const [subject, setSubject] = useState<string>('All subject');
  const [term, setTerm] = useState<string>('All term');
  const [dueDate, setDueDate] = useState<string>(''); // This will be a date string
  const [status, setStatus] = useState<string>('All status');
  const [instructor, setInstructor] = useState<string>('All instructor');
  const [semester, setSemester] = useState<string>('1/2567'); // State for semester filter

  const router = useRouter();

  // Fetch subjects and exam data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const defaultSemester = '1/2567'; // Set default semester here

        // Fetch exam data for the default semester
        const { data: examsData, error: examsError } = await supabase
          .from('Backup')
          .select('*')
          .eq('Semester', defaultSemester); // Add semester filter here

        // Fetch subjects with "Backed up" status for the default semester
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('Backup')
          .select('SubID, SubName, Instructor')
          .eq('Status', 'Backed up')
          .eq('Semester', defaultSemester); // Add semester filter here

        // Log the fetched data for debugging
        console.log('Fetched exams data:', examsData);
        console.log('Fetched subjects data:', subjectsData);

        if (examsError || subjectsError) {
          console.error(
            'Error fetching exams or subjects:',
            examsError || subjectsError
          );
        } else {
          // Transform and set data
          const transformedExams = examsData.map((exam: any) => ({
            Subject: exam.SubID,
            Subjectname: exam.SubName,
            Term: exam.Term,
            DueDate: exam.DueDate,
            Instructor: exam.Instructor,
            Status: exam.Status,
            Semester: exam.Semester, // Capture Semester in the transformation
          }));

          setExams(transformedExams);
          setSubjects(subjectsData); // Set the subjects
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProfile = () => {
    router.push('/exam-officer/profile'); // Navigate to Add User page
  };

  const handleDashBoard = () => {
    router.push('/exam-officer/dashBoard'); // Navigate to dashboard page
  };

  // Handle filter application
  const handleApplyFilters = async () => {
    try {
      console.log('Applying filters with:', {
        subject,
        term,
        dueDate,
        instructor,
      });

      let query = supabase.from('Backup').select('*');

      // Apply subject filter
      if (subject !== 'All subject') {
        query = query.eq('SubID', subject);
      }

      // Apply term filter
      if (term !== 'All term') {
        query = query.eq('Term', term);
      }

      // Apply dueDate filter
      if (dueDate) {
        query = query.eq('DueDate', dueDate);
      }

      // Apply instructor filter
      if (instructor !== 'All instructor') {
        query = query.eq('Instructor', instructor);
      }

      // Apply semester filter
      if (semester) {
        query = query.eq('Semester', semester);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching filtered exams:', error);
        return;
      }

      // Log the filtered data
      const filteredExams = data.map(
        (exam: any): BackupData => ({
          Subject: exam.SubID,
          Subjectname: exam.SubName,
          Term: exam.Term,
          DueDate: exam.DueDate,
          Instructor: exam.Instructor,
          Status: exam.Status,
          Semester: exam.Semester, // Capture Semester in the transformation
        })
      );

      // Set filtered data to the exams state
      setExams(filteredExams);
    } catch (err) {
      console.error('Error applying filters:', err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="lg:w-48 w-full bg-gray-800 text-white flex flex-col">
        <div className="p-4 bg-gray-900 text-center">
          <h1 className="text-2xl font-bold">Exam Printer</h1>
        </div>
        <nav className="mt-10 flex-grow">
          <ul>
            <li
              className="text-xl px-4 py-2 text-center cursor-pointer hover:bg-gray-600"
              onClick={handleDashBoard}
            >
              All exam
            </li>
            <li className="text-xl px-4 py-2 bg-gray-700 text-cyan-400 text-center">
              Backup exam
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        <div className="flex flex-col lg:flex-row justify-between items-center p-4 bg-gray-100">
          <h3 className="text-lg lg:text-xl mt-1 text-center lg:text-left">
            Exam printer ระบบจัดพิมพ์ข้อสอบ <br />
            คณะวิทยาศาสตร์ มหาวิทยาลัยสงขลานครินทร์
          </h3>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 text-center lg:text-left">
            Semester: {semester}
          </h2>

          {/* User Icon */}
          <div className="relative mt-4 lg:mt-0">
            <button
              className="w-10 h-10 bg-gray-300 text-white rounded-full flex justify-center items-center"
              onClick={handleProfile}
            >
              👤
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="p-6 bg-white border-b">
          <h2 className="text-2xl font-bold mb-4 text-center lg:text-left">
            Filter by
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Subject Filter */}
            <div className="flex flex-col">
              <label className="text-gray-600">Subject</label>
              <select
                className="border p-2 rounded-lg"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="All subject">All subject</option>
                {subjects.map((subjz) => (
                  <option key={subjz.SubID} value={subjz.SubID}>
                    {subjz.SubID} {subjz.SubName}
                  </option>
                ))}
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
                <option>Finalterm</option>
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
            {/* Instructor Filter */}
            <div className="flex flex-col">
              <label className="text-gray-600">Instructor</label>
              <select
                className="border p-2 rounded-lg"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              >
                <option value="All instructor">All instructor</option>
                {Array.from(
                  new Set(subjects.map((subj) => subj.Instructor))
                ).map((instructor) => (
                  <option key={instructor} value={instructor}>
                    {instructor}
                  </option>
                ))}
              </select>
            </div>

            {/* Apply Button */}
            <div className="flex flex-col justify-end">
              <button
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-500 w-1/2"
                onClick={handleApplyFilters}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <main className=" bg-gray-100 flex-grow">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4">Subject</th>
                    <th className="py-2 px-4">View exam</th>
                    <th className="py-2 px-4">Term</th>
                    <th className="py-2 px-4">Due Date</th>
                    <th className="py-2 px-4">Instructor</th>
                    <th className="py-2 px-4">Semester</th>{' '}
                    {/* Display Semester */}
                    <th className="py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 text-center">
                        {`${exam.Subject} ${exam.Subjectname}`}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <button className="bg-blue-500 text-white px-4 rounded-lg">
                          exam
                        </button>
                      </td>
                      <td className="py-2 px-4 text-center">{exam.Term}</td>
                      <td className="py-2 px-4 text-center">{exam.DueDate}</td>
                      <td className="py-2 px-4 text-center">
                        {exam.Instructor}
                      </td>
                      <td className="py-2 px-4 text-center">{exam.Semester}</td>{' '}
                      {/* Show Semester */}
                      <td
                        className={`py-2 px-4 text-center ${
                          exam.Status === 'Not Submitted'
                            ? 'text-red-500'
                            : exam.Status === 'Printed'
                              ? 'text-green-500'
                              : exam.Status === 'Submitted'
                                ? 'text-blue-500'
                                : exam.Status === 'Issue'
                                  ? 'text-yellow-500'
                                  : exam.Status === 'Backed up'
                                    ? 'text-purple-600'
                                    : 'text-gray-500'
                        }`}
                      >
                        {exam.Status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
