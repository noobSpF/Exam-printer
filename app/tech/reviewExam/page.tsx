'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';
import LayoutTech from '@/components/LayoutTech';

interface ExamData {
  ExamID: string;
  ExamDate: string;
  ExamTime: string;
  ExamRoom: string;
  AnswerSheet: boolean;
  Note: boolean;
  Calculator: boolean;
  Ruler: boolean;
  Description: string;
  Status: string;
  SubID: string;
  SubName: string;
  Section: string;
  Major: string;
  Credit: string;
  attachmentUrl: string; // Add this to handle the attachment
  StudentAmount: string; // Add this to handle the number of students
  ExamAuthor: string;
  PhoneNumber: string;
  OfficeRoom: string;
}

export default function ReviewExamPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const examID = searchParams.get('examId'); // Get the exam ID from the query params

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [comments, setComments] = useState<string>(''); // To handle examiner comments
  const [isApproved, setIsApproved] = useState<boolean | null>(null); // Track if the exam is approved or not
  const [isFileApproved, setIsFileApproved] = useState<boolean | null>(null); // Track if the file is approved or not

  // Fetch exam details based on ExamID
  useEffect(() => {
    const fetchExamData = async () => {
      if (!examID) return; // Exit early if no examID

      try {
        // Fetch the exam details from the Exam table
        const { data: examData, error: examError } = await supabase
          .from('Exam')
          .select(
            'ExamID, ExamDate, ExamTime, ExamRoom, AnswerSheet, Note, Calculator, Ruler, Description, Status, SubID, attachmentUrl'
          )
          .eq('ExamID', examID)
          .single();

        if (examError) {
          console.error('Error fetching exam details:', examError);
          return;
        }

        // Fetch the related subject data from the Subject table
        const { data: subjectData, error: subjectError } = await supabase
          .from('Subject')
          .select('SubName, Section, Major, Credit, StudentAmount')
          .eq('SubID', examData.SubID)
          .single();

        if (subjectError) {
          console.error('Error fetching subject details:', subjectError);
          return;
        }

        // Fetch additional data from the Submit table (for instructor details)
        const { data: submitData, error: submitError } = await supabase
          .from('Submit')
          .select('Username, Tel, OfficeRoom')
          .eq('ExamID', examID)
          .single();

        if (submitError) {
          console.error('Error fetching submit data:', submitError);
          return;
        }

        // Combine the data and update the state
        setExamData({
          ...examData,
          SubName: subjectData?.SubName || '',
          Section: subjectData?.Section || '',
          Major: subjectData?.Major || '',
          Credit: subjectData?.Credit || '',
          StudentAmount: subjectData?.StudentAmount || '', // Add number of students
          ExamAuthor: submitData?.Username || '', // Add exam author
          PhoneNumber: submitData?.Tel || '', // Add phone number
          OfficeRoom: submitData?.OfficeRoom || '', // Add office room
        });
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    fetchExamData();
  }, [examID]);

  // Handle comment submission, status change, and email notification
  const handleSubmit = async () => {
    if (isApproved === null || isFileApproved === null) {
      alert('ได้โปรดเช็คความถูกต้องของข้อสอบและไฟล์ข้อสอบ.');
      return;
    }

    const updatedStatus =
      isApproved && isFileApproved ? 'Ready to print' : 'Issue';

    try {
      // Update exam status
      const { error: updateError } = await supabase
        .from('Exam')
        .update({ Status: updatedStatus })
        .eq('ExamID', examID);

      if (updateError) {
        console.error('Error updating exam status:', updateError);
        alert('Failed to update exam status');
        return;
      }

      // Send email notification if the status is "Issue"
      if (updatedStatus === 'Issue') {
        // Fetch instructor email from Submit table
        const { data: submitData, error: submitError } = await supabase
          .from('Submit')
          .select('Email')
          .eq('ExamID', examID)
          .single();

        if (submitError || !submitData) {
          console.error('Error fetching instructor email:', submitError);
          alert('Failed to fetch instructor email');
          return;
        }

        // Send email using a hypothetical sendEmailNotification function
        const emailResponse = await sendEmailNotification(
          submitData.Email,
          comments
        );

        if (!emailResponse.success) {
          alert('Failed to send email notification');
        }
      }

      alert('Exam status updated successfully.');
      router.push('/tech/dashBoard'); // Redirect to dashboard after submission
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred.');
    }
  };

  // Function to send email (replace this with a real email service)
  const sendEmailNotification = async (email: string, comments: string) => {
    try {
      // Add your email sending logic here
      return { success: true }; // return success when email sent
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false };
    }
  };

  return (
    <LayoutTech>
      <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Review Exam</h1>

        {!examData ? (
          <p>Loading exam details...</p>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-center">
              {examData.SubID} {examData.SubName} ตอน {examData.Section} สาขา{' '}
              {examData.Major} {examData.Credit} หน่วยกิต
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700">วันที่สอบ</label>
                <p className="p-2 border rounded">{examData.ExamDate}</p>
              </div>
              <div>
                <label className="block text-gray-700">เวลาสอบ</label>
                <p className="p-2 border rounded">{examData.ExamTime}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700">ห้องสอบ</label>
                <p className="p-2 border rounded">{examData.ExamRoom}</p>
              </div>
              <div>
                <label className="block text-gray-700">จำนวนนักศึกษา</label>
                <p className="p-2 border rounded">
                  {examData.StudentAmount}
                </p>{' '}
                {/* Display number of students */}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700">ผู้ออกข้อสอบ</label>
                <p className="p-2 border rounded">{examData.ExamAuthor}</p>{' '}
                {/* Display exam author */}
              </div>
              <div>
                <label className="block text-gray-700">โทรศัพท์มือถือ</label>
                <p className="p-2 border rounded">
                  {examData.PhoneNumber}
                </p>{' '}
                {/* Display phone number */}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700">ห้องทำงาน</label>
                <p className="p-2 border rounded">{examData.OfficeRoom}</p>{' '}
                {/* Display office room */}
              </div>
            </div>

            {/* Equipment Section */}
            <div className="mb-6 mt-8">
              <label className="block font-bold mb-4 text-xl">
                อุปกรณ์ที่ใช้และคำแนะนำผู้คุมสอบเพิ่มเติม
              </label>

              {/* Answer Sheet */}
              <div className="mb-4">
                <p>
                  <strong>ต้องการกระดาษคำตอบหรือไม่:</strong>{' '}
                  <span
                    className={
                      examData.AnswerSheet ? 'text-green-500' : 'text-red-500'
                    }
                  >
                    {examData.AnswerSheet ? 'Yes' : 'No'}
                  </span>
                </p>
              </div>

              {/* Note Allowed */}
              <div className="mb-4">
                <p>
                  <strong>นำตำราเข้าห้องสอบได้:</strong>{' '}
                  <span
                    className={
                      examData.Note ? 'text-green-500' : 'text-red-500'
                    }
                  >
                    {examData.Note ? 'Yes' : 'No'}
                  </span>
                </p>
              </div>

              {/* Calculator Allowed */}
              <div className="mb-4">
                <p>
                  <strong>นำเครื่องคิดเลขเข้าห้องสอบได้:</strong>{' '}
                  <span
                    className={
                      examData.Calculator ? 'text-green-500' : 'text-red-500'
                    }
                  >
                    {examData.Calculator ? 'Yes' : 'No'}
                  </span>
                </p>
              </div>

              {/* Ruler Allowed */}
              <div className="mb-4">
                <p>
                  <strong>ห้ามนำไม้บรรทัดมีสูตรคณิตศาสตร์เข้าสอบ:</strong>{' '}
                  <span
                    className={
                      examData.Ruler ? 'text-green-500' : 'text-red-500'
                    }
                  >
                    {examData.Ruler ? 'Yes' : 'No'}
                  </span>
                </p>
              </div>

              {/* Other Equipment/Notes */}
              <div className="mb-4">
                <p>
                  <strong>ข้อเสนอแนะอื่นๆ:</strong> {examData.Description}
                </p>
              </div>

              {/* File Download */}
              <div className="mb-4">
                <p>
                  <strong>Attachment:</strong>{' '}
                  {examData.attachmentUrl ? (
                    <a
                      href={`https://rbndbkylkuioxuclyhan.supabase.co/storage/v1/object/public/exam-files/${examData.attachmentUrl}`}
                      className="text-blue-500 underline"
                      download
                    >
                      Download Exam File
                    </a>
                  ) : (
                    <span className="text-gray-500">No File Available</span>
                  )}
                </p>
              </div>
            </div>

            {/* Approval and Comments Section */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">ความคิดเห็นผู้ตรวจสอบ</h3>
              <div className="mb-4 flex items-center">
                <label className="mr-4">รายละเอียดข้อสอบถูกต้องหรือไม่</label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="false"
                      checked={isApproved === false}
                      onChange={() => setIsApproved(false)}
                      className="mr-2"
                    />
                    ไม่ถูกต้อง
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="true"
                      checked={isApproved === true}
                      onChange={() => setIsApproved(true)}
                      className="mr-2"
                    />
                    ถูกต้อง
                  </label>
                </div>
              </div>
              <div className="mb-4 flex items-center">
                <label className="mr-4">ไฟล์ข้อสอบถูกต้องหรือไม่</label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="false"
                      checked={isFileApproved === false}
                      onChange={() => setIsFileApproved(false)}
                      className="mr-2"
                    />
                    ไม่ถูกต้อง
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="true"
                      checked={isFileApproved === true}
                      onChange={() => setIsFileApproved(true)}
                      className="mr-2"
                    />
                    ถูกต้อง
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  ความคิดเห็นผู้ตรวจสอบเพิ่มเติม
                </label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="เพิ่มความคิดเห็นของคุณที่นี่"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-300"
                onClick={() => router.push('/tech/dashBoard')}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-300"
                onClick={handleSubmit}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        )}
      </div>
    </LayoutTech>
  );
}
