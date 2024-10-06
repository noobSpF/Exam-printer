'use client'; // This marks the component as a Client Component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import { createClient } from '@supabase/supabase-js'; // Supabase client

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AddNewSubject() {
  const router = useRouter();

  // State for form inputs
  const [subjectID, setSubjectID] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [credit, setCredit] = useState('');
  const [major, setMajor] = useState('');
  const [section, setSection] = useState('');
  const [studentAmount, setStudentAmount] = useState('');
  const [term, setTerm] = useState('Midterm');
  const [instructors, setInstructors] = useState<
    { UserID: any; username: any }[]
  >([]); // For the list of instructors
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [semester, setSemester] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch instructors from the Users table
  useEffect(() => {
    const fetchInstructors = async () => {
      const { data, error } = await supabase
        .from('Users') // Make sure this table matches your database
        .select('UserID, username')
        .eq('Role', 'Instructor'); // Filter by role Instructor

      if (error) {
        console.error('Error fetching instructors:', error);
      } else {
        setInstructors(data || []); // Set the fetched instructors
      }
    };

    fetchInstructors();
  }, []);

  const handleBackupExam = () => {
    router.push('/exam-officer/backupExam'); // Navigate to backup exam page
  };

  const handleProfile = () => {
    router.push('/exam-officer/profile'); // Navigate to Add User page
  };

  // Helper function to check if the due date is in the future
  const isDueDateInFuture = (date: string) => {
    const today = new Date();
    const selectedDate = new Date(date);
    return selectedDate > today; // Ensure the selected date is after today
  };

  // Handle Add Subject button
  const handleAddSubject = async () => {
    // Ensure the form is properly filled out before submission
    if (
      !subjectID ||
      !subjectName ||
      !credit ||
      !major ||
      !semester ||
      !section ||
      !studentAmount ||
      !term ||
      !selectedInstructor ||
      !dueDate
    ) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    // Validate if the due date is in the future
    if (!isDueDateInFuture(dueDate)) {
      setErrorMessage('Due date must be in the future.');
      return;
    }

    try {
      // Format the due date to be compatible with the timestamp type in the database
      const formattedDueDate = new Date(dueDate).toISOString(); // Converts to YYYY-MM-DDTHH:MM:SS.sssZ

      // Insert the new subject into the 'Subject' table
      const { data: subjectData, error: subjectError } = await supabase
        .from('Subject') // Insert into the 'Subject' table
        .insert([
          {
            SubID: subjectID, // Subject Identifier
            SubName: subjectName, // Subject Name
            Credit: credit, // Credit
            Major: major, // Major
            Section: section, // Section
            StudentAmount: studentAmount, // Number of Students
            Term: term, // Midterm or Final

            Instructor: selectedInstructor, // Username of selected instructor
          },
        ]);

      // Handle potential error during subject insertion
      if (subjectError) {
        console.error('Error adding subject:', subjectError);
        alert('Error adding subject. Please try again.');
        return;
      }

      // Insert the due date into the 'Exam' table, linked to the subject
      const { data: examData, error: examError } = await supabase
        .from('Exam') // Insert into the 'Exam' table
        .insert([
          {
            SubID: subjectID, // Use the same SubID to link the Exam and Subject
            DueDate: formattedDueDate, // Formatted due date
            Status: 'Not Submitted',
            Semester: semester, // Set status as "Not Submitted"
          },
        ]);

      // Handle potential error during exam insertion
      if (examError) {
        console.error('Error adding due date to Exam:', examError);
        alert('Error adding due date. Please try again.');
        return;
      }

      // Success message
      alert('Subject and due date added successfully');
      router.push('/exam-officer/dashboard'); // Redirect to the dashboard after successful addition
    } catch (err) {
      console.error('Unexpected error:', err); // Log any unexpected errors
      alert('An unexpected error occurred. Please try again.');
    }
  };

  // Handle Cancel button
  const handleCancel = () => {
    router.push('/exam-officer/dashboard'); // Navigate back to the dashboard
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full sm:w-48 bg-gray-800 text-white flex flex-col">
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
      <div className="flex-grow px-6 sm:px-16 pt-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Add new subject
        </h2>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <form>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
            {/* Subject Input */}
            <div className="flex flex-col">
              <label className="text-gray-600">SubjectID</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                value={subjectID}
                onChange={(e) => setSubjectID(e.target.value)} // Capture input value
              />
            </div>

            {/* SubjectName Input */}
            <div className="flex flex-col">
              <label className="text-gray-600">SubjectName</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)} // Capture input value
              />
            </div>

            {/* Credit Input */}
            <div className="flex flex-col">
              <label className="text-gray-600">Credit</label>
              <input
                className="border p-2 rounded-lg"
                type="number"
                min="1"
                max="12"
                value={credit}
                onChange={(e) => setCredit(e.target.value)} // Capture input value
              />
            </div>

            {/* Major Input */}
            <div className="flex flex-col">
              <label className="text-gray-600">Major</label>
              <select
                className="border p-2 rounded-lg"
                value={major}
                onChange={(e) => setMajor(e.target.value)} // Capture selected major
              >
                <option value="">Select Major</option>
                <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                <option value="จุลชีววิทยา">จุลชีววิทยา</option>
                <option value="ชีววิทยา">ชีววิทยา</option>
                <option value="ฟิสิกส์">ฟิสิกส์</option>
                <option value="วัสดุศาสตร์">วัสดุศาสตร์</option>
                <option value="วิทยาการคอมพิวเตอร์">วิทยาการคอมพิวเตอร์</option>
                <option value="วิทยาศาสตร์พอลิเมอร์">
                  วิทยาศาสตร์พอลิเมอร์
                </option>
                <option value="สถิติ">สถิติ</option>
                <option value="เคมี-ชีววิทยาประยุกต์">
                  เคมี-ชีววิทยาประยุกต์
                </option>
                <option value="เคมี">เคมี</option>
                <option value="เทคโนโลยีชีวภาพ">เทคโนโลยีชีวภาพ</option>
                <option value="เทคโนโลยีสารสนเทศและการสื่อสาร">
                  เทคโนโลยีสารสนเทศและการสื่อสาร
                </option>
                <option value="เทคโนโลยีสารสนเทศ (ต่อเนื่อง)">
                  เทคโนโลยีสารสนเทศ (ต่อเนื่อง)
                </option>
              </select>
            </div>

            {/* Section Input */}
            <div className="flex flex-col">
              <label className="text-gray-600">Section</label>
              <input
                className="border p-2 rounded-lg"
                type="number"
                value={section}
                min="1"
                max="12"
                onChange={(e) => setSection(e.target.value)} // Capture section input
              />
            </div>

            {/* Student Amount Input */}
            <div className="flex flex-col">
              <label className="text-gray-600">Student Amount</label>
              <input
                className="border p-2 rounded-lg"
                type="number"
                value={studentAmount}
                min="1"
                onChange={(e) => setStudentAmount(e.target.value)} // Capture number of students
              />
            </div>

            {/* Term Input */}
            <div className="flex flex-col">
              <label className="text-gray-600">Term</label>
              <select
                className="border p-2 rounded-lg"
                value={term}
                onChange={(e) => setTerm(e.target.value)} // Capture selected term
              >
                <option value="Midterm">Midterm</option>
                <option value="Finalterm">Finalterm</option>
              </select>
            </div>

            {/* Instructor Dropdown */}
            <div className="flex flex-col">
              <label className="text-gray-600">Instructor</label>
              <select
                className="border p-2 rounded-lg"
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)} // Capture selected instructor
              >
                <option value="">Select Instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.UserID} value={instructor.username}>
                    {instructor.username}
                  </option>
                ))}
              </select>
            </div>
            {/* Semester Input */}
            <div className="flex flex-col">
              <label className="text-gray-600">Semester</label>
              <select
                className="border p-2 rounded-lg"
                value={semester}
                onChange={(e) => setSemester(e.target.value)} // Capture selected term
              >
                <option value="">Select Semester</option>
                <option value="1/2567">1/2567</option>
                <option value="2/2567">2/2567</option>
                <option value="3/2567">3/2567</option>
                <option value="1/2568">1/2568</option>
                <option value="2/2568">2/2568</option>
                <option value="3/2568">3/2568</option>
              </select>
            </div>

            {/* Due Date Input */}
            <div className="flex flex-col">
              <label className="text-gray-600">Due date</label>
              <input
                className="border p-2 rounded-lg"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)} // Capture date value
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center space-x-4 mt-12">
            <button
              type="button"
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-300 mr-4"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg focus:outline-none hover:bg-blue-300 ml-4"
              onClick={handleAddSubject}
            >
              Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
