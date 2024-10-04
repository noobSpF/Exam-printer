'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPrint } from '@fortawesome/free-solid-svg-icons';
import LayoutTech2 from '@/components/LayoutTech2';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ExamData {
  ExamID: string;
  Subject: string;
  Subjectname: string;
  Term: string;
  DueDate: string;
  Instructor: string;
  Status: string;
  AmountStudent: number;
  File: string;
}
interface SubjectData {
  SubID: string;
  SubName: string;
  Instructor: string;
}

export default function PrintExamPage() {
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const [subject, setSubject] = useState<string>('');
  const [term, setTerm] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [instructor, setInstructor] = useState<string>('');

  const [subjects, setSubjects] = useState<SubjectData[]>([]);

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
  // Fetch exams with status "Ready to print"
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data, error } = await supabase
          .from('Exam')
          .select(
            `
            ExamID,
            SubID,
            DueDate,
            Status,
            Subject:SubID ( SubName, Instructor, Term, StudentAmount ),
            attachmentUrl
          `
          )
          .in('Status', ['Ready to print', 'Printed', 'Backed up']); // Filter exams with multiple statuses

        if (error) {
          console.error('Error fetching exams:', error);
        } else {
          // Map the fetched data to your component's format
          const transformedExams = data.map((exam: any) => ({
            ExamID: exam.ExamID,
            Subject: exam.SubID,
            Subjectname: exam.Subject?.SubName || '',
            Term: exam.Subject?.Term || '',
            DueDate: exam.DueDate,
            Instructor: exam.Subject?.Instructor || '',
            Status: exam.Status,
            AmountStudent: exam.Subject?.StudentAmount || 0,
            File: exam.attachmentUrl,
          }));
          setExams(transformedExams); // Store the transformed data
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchExams();
  }, []);

  // Handle exam review or print
  const handlePrintExam = async (ExamID: string) => {
    console.log(ExamID);
    const { data: examData, error: examError } = await supabase
      .from('Exam')
      .select('attachmentUrl')
      .eq('ExamID', ExamID)
      .single();

    if (examError) {
      console.error('Error fetching exam data:', examError);
      alert('Error fetching exam data');
      return;
    }

    console.log(examData);

    // Check if there is an attachment URL (exam file)
    if (!examData?.attachmentUrl) {
      alert('No exam file available for printing.');
      return;
    }

    // Download the exam file from Supabase storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('exam-files')
      .download(examData.attachmentUrl);

    if (fileError) {
      console.error('Error downloading exam file:', fileError);
      alert('Error downloading exam file');
      return;
    }

    // Create a URL for the downloaded file and open it in a new tab
    const fileURL = URL.createObjectURL(fileData);
    const printWindow = window.open(fileURL, '_blank');
    if (printWindow) {
      printWindow.focus();
      printWindow.print();
      const { error: updateError } = await supabase
        .from('Exam')
        .update({ Status: 'Printed' })
        .eq('ExamID', ExamID);

      if (updateError) {
        console.error('Error updating exam status:', updateError);
        alert('Failed to update exam status');
        return;
      }
    } else {
      console.error('Error opening exam file for printing.');
    }
  };

  return (
    <LayoutTech2>
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
              {Array.from(new Set(subjects.map((subj) => subj.Instructor))).map(
                (instructor) => (
                  <option key={instructor} value={instructor}>
                    {instructor}
                  </option>
                )
              )}
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
                  <th className="py-2 px-4">Print</th> {/* New Print Column */}
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
                          exam.Status !== 'Ready to print' &&
                          exam.Status !== 'Printed' &&
                          exam.Status !== 'Backed up'
                            ? 'bg-gray-500 text-white cursor-not-allowed' // Gray button for other statuses
                            : 'bg-blue-500 text-white hover:bg-blue-700' // Blue button for allowed statuses
                        }`}
                        disabled={
                          exam.Status !== 'Ready to print' &&
                          exam.Status !== 'Printed' &&
                          exam.Status !== 'Backed up'
                        } // Disable button when the status is not allowed
                        onClick={async () => {
                          if (
                            exam.Status !== 'Ready to print' &&
                            exam.Status !== 'Printed' &&
                            exam.Status !== 'Backed up'
                          ) {
                            return; // Prevent click event if the status is not allowed
                          }

                          // Navigate to the viewExam page with the fetched ExamID
                          router.push(`/tech/viewExam?examId=${exam.ExamID}`);
                        }}
                      >
                        {(exam.Status === 'Ready to print' ||
                          exam.Status === 'Printed' ||
                          exam.Status === 'Backed up') && (
                          <FontAwesomeIcon icon={faEye} className="mr-2" />
                        )}
                        Exam
                      </button>
                    </td>

                    <td className="py-2 px-4 text-center">{exam.Term}</td>
                    <td className="py-2 px-4 text-center">{exam.DueDate}</td>
                    <td className="py-2 px-4 text-center">{exam.Instructor}</td>
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
                    <td className="py-2 px-4 text-center">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        onClick={() => handlePrintExam(exam.ExamID)}
                      >
                        <FontAwesomeIcon icon={faPrint} className="mr-2" />
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </LayoutTech2>
  );
}
