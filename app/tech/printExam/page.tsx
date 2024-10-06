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
  isBackup: boolean; // Flag to distinguish between Exam and Backup
}
interface SubjectData {
  SubID: string;
  SubName: string;
  Instructor: string;
}

export default function PrintExamPage() {
  const [exams, setExams] = useState<ExamData[]>([]);
  const [backupExams, setBackupExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const [subject, setSubject] = useState<string>('All subject');
  const [term, setTerm] = useState<string>('All term');
  const [dueDate, setDueDate] = useState<string>('');
  const [status, setStatus] = useState<string>('All status');
  const [instructor, setInstructor] = useState<string>('All instructor');

  const [subjects, setSubjects] = useState<SubjectData[]>([]);

  const handleApplyFilters = () => {
    // Create a filter object based on current state
    const filters = {
      subject,
      term,
      dueDate,
      status: 'Ready to print', // Set default status filter
      instructor,
    };

    // Fetch exams based on filters
    fetchExams(filters);
  };

  const fetchExams = async (filters: any = {}) => {
    try {
      // Fetch exams from 'Exam' table
      let examQuery = supabase
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
        .in('Status', ['Ready to print', 'Printed']); // Only non-backup statuses

      // Fetch data from 'Backup' table
      let backupQuery = supabase
        .from('Backup')
        .select(
          `
        BackupID,
        SubID,
        DueDate,
        Status,
        SubName,
        Instructor,
        Term,
        StudentAmount,
        attachmentUrl
      `
        )
        .in('Status', ['Backed up']); // Only 'Backed up' exams in 'Backup' table

      // Apply filters to both queries
      if (filters.subject && filters.subject !== 'All subject') {
        examQuery = examQuery.eq('SubID', filters.subject);
        backupQuery = backupQuery.eq('SubID', filters.subject);
      }
      if (filters.term && filters.term !== 'All term') {
        examQuery = examQuery.eq('Term', filters.term);
        backupQuery = backupQuery.eq('Term', filters.term);
      }
      if (filters.dueDate) {
        examQuery = examQuery.eq('DueDate', filters.dueDate);
        backupQuery = backupQuery.eq('DueDate', filters.dueDate);
      }
      if (filters.instructor && filters.instructor !== 'All instructor') {
        examQuery = examQuery.eq('Instructor', filters.instructor);
        backupQuery = backupQuery.eq('Instructor', filters.instructor);
      }

      // Execute both queries
      const { data: examData, error: examError } = await examQuery;
      const { data: backupData, error: backupError } = await backupQuery;

      // Log results for debugging
      console.log('Exam data fetched:', examData);
      console.log('Backup data fetched:', backupData);

      // Handle any errors
      if (examError) {
        console.error('Error fetching exam data:', examError);
      }
      if (backupError) {
        console.error('Error fetching backup data:', backupError);
      }

      // Transform the data for the Exam table
      const transformedExams = (examData || []).map((item: any) => ({
        ExamID: item.ExamID,
        Subject: item.SubID,
        Subjectname: item.Subject?.SubName || '',
        Term: item.Subject?.Term || '',
        DueDate: item.DueDate,
        Instructor: item.Subject?.Instructor || '',
        Status: item.Status,
        AmountStudent: item.Subject?.StudentAmount || 0,
        File: item.attachmentUrl,
        isBackup: false,
      }));

      // Transform the data for the Backup table
      const transformedBackupExams = (backupData || []).map((item: any) => ({
        ExamID: item.BackupID,
        Subject: item.SubID,
        Subjectname: item.SubName || '', // Use SubName from the Backup table
        Term: item.Term || '', // Use Term from the Backup table
        DueDate: item.DueDate,
        Instructor: item.Instructor || '', // Use Instructor from the Backup table
        Status: item.Status,
        AmountStudent: item.StudentAmount || 0,
        File: item.attachmentUrl,
        isBackup: true,
      }));

      setExams(transformedExams); // Store exam data in one state
      setBackupExams(transformedBackupExams); // Store backup data in a separate state
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
    fetchExams(); // Fetch exams initially without filters
  }, []);

  // Handle exam review or print
  const handlePrintExam = async (ExamID: string, isBackup: boolean) => {
    let table = isBackup ? 'Backup' : 'Exam';
    const { data: examData, error: examError } = await supabase
      .from(table)
      .select('attachmentUrl')
      .eq(isBackup ? 'BackupID' : 'ExamID', ExamID)
      .single();

    if (examError) {
      console.error('Error fetching exam data:', examError);
      alert('Error fetching exam data');
      return;
    }

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

      // Update the exam status to "Printed" only if the current status is "Ready to print"
      const { error: updateError } = await supabase
        .from(table)
        .update({ Status: 'Printed' })
        .eq(isBackup ? 'BackupID' : 'ExamID', ExamID)
        .eq('Status', 'Ready to print'); // Ensure the current status is "Ready to print"

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

      {/* Exam Table Section */}
      <main className="bg-gray-100 flex-grow">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-auto">
            <h3 className="text-2xl  mt-4">Exam</h3>
            <table className="min-w-full bg-white shadow-md rounded-lg mb-8">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4">Subject</th>
                  <th className="py-2 px-4">View exam</th>
                  <th className="py-2 px-4">Term</th>
                  <th className="py-2 px-4">Due Date</th>
                  <th className="py-2 px-4">Instructor</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Print</th>
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
                          exam.Status !== 'Printed'
                            ? 'bg-gray-500 text-white cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-700'
                        }`}
                        disabled={
                          exam.Status !== 'Ready to print' &&
                          exam.Status !== 'Printed'
                        }
                        onClick={() =>
                          router.push(`/tech/viewExam?examId=${exam.ExamID}`)
                        }
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
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
                        onClick={() => handlePrintExam(exam.ExamID, false)}
                      >
                        <FontAwesomeIcon icon={faPrint} className="mr-2" />
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Backup Table Section */}
            <h3 className="text-2xl mt-4">Backup</h3>
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4">Subject</th>
                  <th className="py-2 px-4">View exam</th>
                  <th className="py-2 px-4">Term</th>
                  <th className="py-2 px-4">Due Date</th>
                  <th className="py-2 px-4">Instructor</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Print</th>
                </tr>
              </thead>

              <tbody>
                {backupExams.map((exam, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 text-center">
                      {`${exam.Subject} ${exam.Subjectname}`}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        className={`px-4 rounded-lg ${
                          exam.Status !== 'Backed up'
                            ? 'bg-gray-500 text-white cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-700'
                        }`}
                        disabled={exam.Status !== 'Backed up'}
                        onClick={() =>
                          router.push(
                            `/tech/viewBackupExam?examId=${exam.ExamID}&isBackup=${exam.isBackup}`
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        Exam
                      </button>
                    </td>
                    <td className="py-2 px-4 text-center">{exam.Term}</td>
                    <td className="py-2 px-4 text-center">{exam.DueDate}</td>
                    <td className="py-2 px-4 text-center">{exam.Instructor}</td>
                    <td
                      className={`py-2 px-4 text-center ${
                        exam.Status === 'Backed up'
                          ? 'text-purple-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {exam.Status}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        onClick={() => handlePrintExam(exam.ExamID, true)}
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
