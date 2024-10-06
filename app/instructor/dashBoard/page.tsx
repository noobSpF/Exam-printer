'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { getUserEmailFromCookies } from '@/utils/cookies/cookieUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SubjectData {
  SubID: string;
  SubName: string;
  Term: string;
  Instructor: string;
  StudentAmount: number;
  DueDate: string;
  Status: string;
}

export default function InstructorPage() {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [subject, setSubject] = useState<string>('All subject');
  const [term, setTerm] = useState<string>('All term');
  const [dueDate, setDueDate] = useState<string>(''); 
  const [status, setStatus] = useState<string>('All status');
  const [instructor, setInstructor] = useState<string>('All instructor');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const email = await getUserEmailFromCookies();
        console.log('Retrieved email from cookies:', email);

        if (!email) {
          setError('No email found in cookies');
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('username')
          .eq('Email', email)
          .single();

        if (userError || !userData) {
          console.error('Error fetching user data:', userError);
          setError('Error fetching user data.');
          return;
        }

        const username = userData.username;

        const { data: subjectData, error: subjectError } = await supabase
          .from('Subject')
          .select('SubID, SubName, Term, Instructor, StudentAmount')
          .eq('Instructor', username);

        if (subjectError) {
          console.error('Error fetching subjects:', subjectError);
          setError('Error fetching subjects.');
          return;
        }

        const transformedData = await Promise.all(
          subjectData.map(async (subject) => {
            const { data: examData, error: examError } = await supabase
              .from('Exam')
              .select('DueDate, Status')
              .eq('SubID', subject.SubID)
              .single();

            if (examError) {
              console.error(`Error fetching exam for subject ${subject.SubID}:`, examError);
            }

            return {
              SubID: subject.SubID,
              SubName: subject.SubName,
              Term: subject.Term,
              Instructor: subject.Instructor,
              StudentAmount: subject.StudentAmount,
              DueDate: examData?.DueDate || 'No due date',
              Status: examData?.Status || 'No status',
            };
          })
        );

        setSubjects(transformedData);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleProfile = () => {
    router.push('/instructor/profile');
  };

  const handleApplyFilters = async () => {
    try {
      setLoading(true);
  
      // Start with the Exam query if status filter is applied
      let subIDs;
      if (status !== 'All status') {
        const { data: examData, error: examError } = await supabase
          .from('Exam')
          .select('SubID')
          .eq('Status', status);
  
        if (examError) {
          console.error('Error fetching exams:', examError);
          setError('Error applying filters.');
          return;
        }
  
        subIDs = examData.map(exam => exam.SubID);
      }
  
      // Now query the Subject table
      let query = supabase
        .from('Subject')
        .select('SubID, SubName, Term, Instructor, StudentAmount');
  
      // Apply filters
      if (subject !== 'All subject') {
        query = query.eq('SubID', subject);
      }
      if (term !== 'All term') {
        query = query.eq('Term', term);
      }
      if (instructor !== 'All instructor') {
        query = query.eq('Instructor', instructor);
      }
      if (subIDs) {
        query = query.in('SubID', subIDs);
      }
  
      const { data: subjectData, error: subjectError } = await query;
  
      if (subjectError) {
        console.error('Error fetching filtered subjects:', subjectError);
        setError('Error fetching filtered subjects.');
        return;
      }
  
      // Transform data
      const transformedData = await Promise.all(
        subjectData.map(async (subject) => {
          const { data: examData } = await supabase
            .from('Exam')
            .select('DueDate, Status')
            .eq('SubID', subject.SubID)
            .single();
  
          return {
            SubID: subject.SubID,
            SubName: subject.SubName,
            Term: subject.Term,
            Instructor: subject.Instructor,
            StudentAmount: subject.StudentAmount,
            DueDate: examData?.DueDate || 'No due date',
            Status: examData?.Status || 'No status',
          };
        })
      );
  
      setSubjects(transformedData);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
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
            <li className="text-xl px-4 py-2 bg-gray-700 text-cyan-400 text-center">
              My exam
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
                    {`${subj.SubID} - ${subj.SubName}`}
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
        <main className="bg-gray-100 flex-grow">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4">Subject</th>
                    <th className="py-2 px-4">View Exam</th>
                    <th className="py-2 px-4">Term</th>
                    <th className="py-2 px-4">Instructor</th>
                    <th className="py-2 px-4">Due Date</th>
                    <th className="py-2 px-4">Student Amount</th>
                    <th className="py-2 px-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {subjects.map((subject, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 text-center">
                        {`${subject.SubID} ${subject.SubName}`}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <button
                          className={`px-4 rounded-lg ${
                            subject.Status === 'Not Submitted' ||
                            subject.Status === 'Submitted' ||
                            subject.Status === 'Issue'
                              ? 'bg-blue-500 text-white hover:bg-blue-700'
                              : 'bg-gray-500 text-white cursor-not-allowed'
                          }`}
                          disabled={
                            subject.Status !== 'Not Submitted' &&
                            subject.Status !== 'Submitted' &&
                            subject.Status !== 'Issue'
                          }
                          onClick={() =>
                            router.push(
                              `/instructor/addExam?subId=${subject.SubID}`
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faPlus} className="mr-2" />{' '}
                          Exam
                        </button>
                      </td>

                      <td className="py-2 px-4 text-center">{subject.Term}</td>
                      <td className="py-2 px-4 text-center">
                        {subject.Instructor}
                      </td>

                      <td className="py-2 px-4 text-center">
                        {subject.DueDate}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {subject.StudentAmount}
                      </td>
                      <td
                        className={`py-2 px-4 text-center ${
                          subject.Status === 'Not Submitted'
                            ? 'text-red-500'
                            : subject.Status === 'Printed'
                              ? 'text-green-500'
                              : subject.Status === 'Submitted'
                                ? 'text-cyan-500'
                                : subject.Status === 'Issue'
                                  ? 'text-yellow-500'
                                  : subject.Status === 'Ready to print'
                                    ? 'text-blue-600'
                                    : 'text-gray-500'
                        }`}
                      >
                        {subject.Status}
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
