'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { AiOutlineDelete } from 'react-icons/ai'; // Import delete icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
// Supabase client creation
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define types for your data
interface ExamData {
  Subject: string;
  Subjectname: string;
  Term: string;
  DueDate: string;
  Instructor: string;
  Status: string;
  AmountStudent: number;
  ExamID: string; // Add ExamID property
}
interface SubjectData {
  SubID: string;
  SubName: string;
  Instructor: string;
}

export default function TechUnitPage() {
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter states
  const [subject, setSubject] = useState<string>('All subject');
  const [subjectname, setSubjectname] = useState<string>('All subjectName');
  const [term, setTerm] = useState<string>('All term');
  const [dueDate, setDueDate] = useState<string>(''); // This will be a date string
  const [status, setStatus] = useState<string>('All status');
  const [instructor, setInstructor] = useState<string>('All instructor');

  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const router = useRouter();

  // Fetch exam data
  // Fetch exam data
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data, error } = await supabase.rpc('get_exam_details'); // Fetch data from your 'Exam' table

        if (error) {
          console.error('Error fetching exams:', error);
        } else {
          console.log('Exam data:', data); // Log the fetched data
          const transformedExams = data.map((exam: any) => ({
            Subject: exam.SubID,
            Subjectname: exam.SubName, // Assuming SubID holds the subject identifier
            Term: exam.Term, // This is static; adjust based on your data
            DueDate: exam.DueDate, // Format date
            Instructor: exam.Instructor, // Assuming Instructor field holds the name
            Status: exam.Status, // Custom logic for status
            AmountStudent: exam.AmountStudent,
            ExamID: exam.ExamID, // Ensure ExamID is being fetched
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

  const handleProfile = () => {
    router.push('/tech/profile'); // Navigate to Add User page
  };
  const handlePrintExam = () => {
    router.push('/tech/printExam'); // Navigate to backup exam page
  };
  //TODO
  const handleApplyFilters = () => {
    // Create a filter object based on current state
    const filters = {
      subject,
      term,
      dueDate,
      status,
      instructor,
    };

    // Fetch exams based on filters
    fetchExams(filters);
  };
  const fetchExams = async (filters: any = {}) => {
    try {
      // Initial query
      let query = supabase.rpc('get_exam_details');

      // Apply filters
      if (filters.subject && filters.subject !== 'All subject') {
        query = query.eq('SubID', filters.subject);
      }
      if (filters.term && filters.term !== 'All term') {
        query = query.eq('Term', filters.term);
      }
      if (filters.dueDate) {
        query = query.eq('DueDate', filters.dueDate);
      }
      if (filters.status && filters.status !== 'All status') {
        query = query.eq('Status', filters.status);
      }
      if (filters.instructor && filters.instructor !== 'All instructor') {
        query = query.eq('Instructor', filters.instructor);
      }

      // Fetch data with applied filters
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching exams:', error);
      } else {
        const transformedExams = data.map((exam: any) => ({
          Subject: exam.SubID,
          Subjectname: exam.SubName,
          Term: exam.Term,
          DueDate: exam.DueDate,
          Instructor: exam.Instructor,
          Status: exam.Status,
          AmountStudent: exam.AmountStudent,
          ExamID: exam.ExamID,
        }));
        setExams(transformedExams);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects and instructors from the Subject table
  useEffect(() => {
    const fetchSubjectsAndInstructors = async () => {
      try {
        const { data, error } = await supabase
          .from('Subject')
          .select('SubID, SubName, Instructor');

        if (error) {
          console.error('Error fetching subjects and instructors:', error);
        } else {
          setSubjects(data); // Store fetched subjects
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    fetchSubjectsAndInstructors();
  }, []);
  //TODO
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="lg:w-48 w-full bg-gray-800 text-white flex flex-col">
        <div className="p-4 bg-gray-900 text-center">
          <h1 className="text-2xl font-bold">Exam Printer</h1>
        </div>
        <nav className="mt-10 flex-grow">
          <ul>
            <li className="text-xl px-4 py-2 bg-gray-700 text-cyan-400 text-center">
              All exam
            </li>
            <li
              className="text-xl px-4 py-2 text-center cursor-pointer hover:bg-gray-600"
              onClick={handlePrintExam}
            >
              Print exam
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col ">
        <div className="flex flex-col lg:flex-row justify-between items-center p-4 bg-gray-100">
          <h3 className="text-lg lg:text-xl mt-1 text-center lg:text-left">
            Exam printer ระบบจัดพิมพ์ข้อสอบ <br />
            คณะวิทยาศาสตร์ มหาวิทยาลัยสงขลานครินทร์
          </h3>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 text-center lg:text-left">
            Semester: 1/2567
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
                {subjects.map((subj) => (
                  <option key={subj.SubID} value={subj.SubID}>
                    {subj.SubID} - {subj.SubName}
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
                <option>Printed</option>
                <option>Submitted</option>
                <option>Issue</option>
                <option>Ready to print</option>
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
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
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
                        <button
                          className={`px-4 rounded-lg ${
                            exam.Status !== 'Submitted'
                              ? 'bg-gray-500 text-white cursor-not-allowed' // Gray button for statuses other than "Submitted"
                              : 'bg-blue-500 text-white hover:bg-blue-700' // Blue button for "Submitted" status
                          }`}
                          disabled={exam.Status !== 'Submitted'} // Disable button when status is not "Submitted"
                          onClick={async () => {
                            if (exam.Status !== 'Submitted') {
                              return; // Prevent click event if the status is not "Submitted"
                            }

                            // Fetch the ExamID using the SubID
                            const { data, error } = await supabase
                              .from('Exam')
                              .select('ExamID')
                              .eq('SubID', exam.Subject) // Assuming exam.Subject is the SubID
                              .single(); // Fetch a single exam record

                            if (error || !data) {
                              console.error('Error fetching ExamID:', error);
                              return;
                            }

                            const examID = data.ExamID;

                            // Navigate to the reviewExam page with the fetched ExamID
                            router.push(`/tech/reviewExam?examId=${examID}`);
                          }}
                        >
                          {exam.Status === 'Submitted' && (
                            <FontAwesomeIcon icon={faEye} className="mr-2" />
                          )}
                          Exam
                        </button>
                      </td>

                      <td className="py-2 px-4 text-center">{exam.Term}</td>
                      <td className="py-2 px-4 text-center">{exam.DueDate}</td>
                      <td className="py-2 px-4 text-center">
                        {exam.Instructor}
                      </td>
                      <td
                        className={`py-2 px-4 text-center ${
                          exam.Status === 'Not Submitted'
                            ? 'text-red-500'
                            : exam.Status === 'Printed'
                              ? 'text-green-500'
                              : exam.Status === 'Submitted'
                                ? 'text-cyan-500'
                                : exam.Status === 'Issue'
                                  ? 'text-yellow-500'
                                  : exam.Status === 'Ready to print'
                                    ? 'text-blue-600'
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
        </main>{' '}
      </div>
    </div>
  );
}
