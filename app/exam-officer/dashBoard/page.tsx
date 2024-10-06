'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { AiOutlineDelete } from 'react-icons/ai'; // Import delete icon
import { AiOutlineCloudUpload } from 'react-icons/ai';
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
}

export default function ExamOfficerPage() {
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter states
  const [subject, setSubject] = useState<string>('All subject');
  const [subjects, setSubjects] = useState<
    { SubID: string; SubName: string; Instructor: string }[]
  >([]);
  const [subjectname, setSubjectname] = useState<string>('All subjectName');
  const [term, setTerm] = useState<string>('All term');
  const [dueDate, setDueDate] = useState<string>(''); // This will be a date string
  const [status, setStatus] = useState<string>('All status');
  const [instructor, setInstructor] = useState<string>('All instructor');

  const router = useRouter();

  // Fetch exam data
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data, error } = await supabase.rpc('get_exam_details'); // Fetch data from your 'Exam' table

        if (error) {
          console.error('Error fetching exams:', error);
        } else {
          const transformedExams = data.map((exam: any) => ({
            Subject: exam.SubID,
            Subjectname: exam.SubName, // Assuming SubID holds the subject identifier
            Term: exam.Term, // This is static; adjust based on your data
            DueDate: exam.DueDate, // Format date
            Instructor: exam.Instructor, // Assuming Instructor field holds the name
            Status: exam.Status, // Custom logic for status
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

  // Function to handle subject deletion
  const handleDeleteSubject = async (subjectId: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this subject and all related exam data?'
    );

    if (!confirmDelete) return;

    try {
      // Delete related records from the 'Submit' table
      const { error: submitError } = await supabase
        .from('Submit')
        .delete()
        .eq('SubID', subjectId);

      if (submitError) {
        console.error('Error deleting related submit records:', submitError);
        alert('Failed to delete related submit records. Please try again.');
        return;
      }

      // Delete related exams from the 'Exam' table
      const { error: examError } = await supabase
        .from('Exam')
        .delete()
        .eq('SubID', subjectId);

      if (examError) {
        console.error('Error deleting related exams:', examError);
        alert('Failed to delete related exams. Please try again.');
        return;
      }

      // Delete the subject from the 'Subject' table
      const { error: subjectError } = await supabase
        .from('Subject')
        .delete()
        .eq('SubID', subjectId);

      if (subjectError) {
        console.error('Error deleting subject:', subjectError);
        alert('Failed to delete subject. Please try again.');
      } else {
        alert('Subject and related exams deleted successfully.');
        setExams((prevExams) =>
          prevExams.filter((exam) => exam.Subject !== subjectId)
        );
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred while deleting the subject.');
    }
  };

  const handleProfile = () => {
    router.push('/exam-officer/profile'); // Navigate to Add User page
  };
  const handleBackupExam = () => {
    router.push('/exam-officer/backupExam'); // Navigate to backup exam page
  };

  // Handle filter application
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
  const handleBackup = async (exam: ExamData) => {
    const confirmBackup = window.confirm(
      'Are you sure you want to back up this exam and remove it from the system?'
    );

    if (!confirmBackup) return;

    try {
      // Step 1: Fetch the ExamID associated with the SubID (exam.Subject)
      const { data: examData, error: examFetchError } = await supabase
        .from('Exam')
        .select('ExamID') // Assuming ExamID is in the Exam table
        .eq('SubID', exam.Subject)
        .single();

      if (examFetchError || !examData) {
        console.error('Error fetching ExamID:', examFetchError);
        alert('Failed to fetch ExamID for backup. Please try again.');
        return;
      }

      const examId = examData.ExamID;

      // Step 2: Update the exam status to 'Backed up'
      const { error: updateError } = await supabase
        .from('Exam')
        .update({ Status: 'Backed up' })
        .eq('SubID', exam.Subject);

      if (updateError) {
        console.error('Error backing up exam:', updateError);
        alert('Failed to back up the exam. Please try again.');
        return;
      }

      // Step 3: Delete related records from the 'Submit' table using the fetched ExamID
      const { error: submitError } = await supabase
        .from('Submit')
        .delete()
        .eq('ExamID', examId); // Use the fetched ExamID here

      if (submitError) {
        console.error('Error deleting related submit records:', submitError);
        alert('Failed to delete related submit records. Please try again.');
        return;
      }

      // Step 4: Delete the exam from the 'Exam' table
      const { error: deleteExamError } = await supabase
        .from('Exam')
        .delete()
        .eq('SubID', exam.Subject);

      // Step 5: Delete the subject from the 'Subject' table
      const { error: deleteSubjectError } = await supabase
        .from('Subject')
        .delete()
        .eq('SubID', exam.Subject);

      if (deleteExamError || deleteSubjectError) {
        console.error(
          'Error deleting exam/subject:',
          deleteExamError || deleteSubjectError
        );
        alert(
          'Failed to delete exam or subject after backup. Please try again.'
        );
        return;
      }

      alert('Exam successfully backed up and removed.');

      // Remove the backed-up exam from the displayed list
      setExams((prevExams) =>
        prevExams.filter((e) => e.Subject !== exam.Subject)
      );
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred while backing up the exam.');
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
              All exam
            </li>
            <li
              className="text-xl px-4 py-2 text-center cursor-pointer hover:bg-gray-600"
              onClick={handleBackupExam}
            >
              Backup exam
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
                    {subj.SubName}
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
                    <th className="py-2 px-4">Delete</th>
                    <th className="py-2 px-4">Backup</th>
                  </tr>
                </thead>
                <td colSpan={12} className="text-center py-4">
                  <button
                    className="border-2 border-dashed border-gray-400 px-6 py-2 rounded-lg text-gray-500"
                    onClick={() => router.push('/exam-officer/addSubject')} // Navigate to the Add Subject page
                  >
                    + Add Subject
                  </button>
                </td>
                <tbody>
                  {exams
                    .filter((exam) => exam.Status !== 'Backed up') // Exclude exams with "Backed up" status
                    .map((exam, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 text-center">
                          {`${exam.Subject} ${exam.Subjectname}`}
                        </td>
                        <td className="py-2 px-4 text-center">
                          <button
                            className={`px-4 rounded-lg ${
                              exam.Status === 'Not Submitted'
                                ? 'bg-gray-500 text-white cursor-not-allowed' // Gray button for "Not Submitted" status
                                : 'bg-blue-500 text-white  cursor-not-allowed' // Blue button for other statuses
                            }`}
                            disabled={exam.Status === 'Not Submitted'} // Disable button when status is "Not Submitted"
                          >
                            Exam
                          </button>
                        </td>
                        <td className="py-2 px-4 text-center">{exam.Term}</td>
                        <td className="py-2 px-4 text-center">
                          {exam.DueDate}
                        </td>
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
                                      : exam.Status === 'Backed up'
                                        ? 'text-purple-600'
                                        : 'text-gray-500'
                          }`}
                        >
                          {exam.Status}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {exam.Status === 'Not Submitted' && (
                            <button
                              className="text-red-400 hover:text-red-700"
                              onClick={() => handleDeleteSubject(exam.Subject)}
                            >
                              <AiOutlineDelete size={20} />
                            </button>
                          )}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {exam.Status === 'Printed' && (
                            <button
                              className="text-blue-500 hover:text-blue-700 mr-4 justify-center"
                              onClick={() => handleBackup(exam)}
                            >
                              <AiOutlineCloudUpload size={30} />
                            </button>
                          )}
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
