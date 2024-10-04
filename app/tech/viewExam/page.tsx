'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';
import LayoutTech2 from '@/components/LayoutTech2';

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
  attachmentUrl: string;
  StudentAmount: string;
  ExamAuthor: string;
  PhoneNumber: string;
  OfficeRoom: string;
}

export default function ViewExamPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const examID = searchParams.get('examId');

  const [examData, setExamData] = useState<ExamData | null>(null);

  // Fetch exam details based on ExamID
  useEffect(() => {
    const fetchExamData = async () => {
      if (!examID) return;

      try {
        // Fetch exam details from the Exam table
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

        // Only proceed if status is "Ready to print", "Printed", or "Backed up"
        if (
          examData.Status !== 'Ready to print' &&
          examData.Status !== 'Printed' &&
          examData.Status !== 'Backed up'
        ) {
          alert('This exam is not ready to be viewed.');
          router.push('/tech/printExam');
          return;
        }

        // Fetch related subject data from Subject table
        const { data: subjectData, error: subjectError } = await supabase
          .from('Subject')
          .select('SubName, Section, Major, Credit, StudentAmount')
          .eq('SubID', examData.SubID)
          .single();

        if (subjectError) {
          console.error('Error fetching subject details:', subjectError);
          return;
        }

        // Fetch additional details from Submit table (instructor details)
        const { data: submitData, error: submitError } = await supabase
          .from('Submit')
          .select('Username, Tel, OfficeRoom')
          .eq('ExamID', examID)
          .single();

        if (submitError) {
          console.error('Error fetching submit data:', submitError);
          return;
        }

        // Combine data and update state
        setExamData({
          ...examData,
          SubName: subjectData?.SubName || '',
          Section: subjectData?.Section || '',
          Major: subjectData?.Major || '',
          Credit: subjectData?.Credit || '',
          StudentAmount: subjectData?.StudentAmount || '',
          ExamAuthor: submitData?.Username || '',
          PhoneNumber: submitData?.Tel || '',
          OfficeRoom: submitData?.OfficeRoom || '',
        });
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    fetchExamData();
  }, [examID, router]);

  const handlePrintExam = async () => {
    if (!examID || !examData) return;

    try {
      if (examData.Status === 'Ready to print') {
        const { error: updateError } = await supabase
          .from('Exam')
          .update({ Status: 'Printed' })
          .eq('ExamID', examID);

        if (updateError) {
          console.error('Error updating exam status:', updateError);
          alert('Failed to update exam status');
        } else {
          setExamData((prevData) => {
            if (prevData) {
              return { ...prevData, Status: 'Printed' };
            }
            return prevData;
          });
          alert('Exam status updated to Printed');
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An error occurred while updating the status');
    }
  };

  return (
    <LayoutTech2>
      <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">View Exam</h1>

        {!examData ? (
          <p>Loading exam details...</p>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-center">
              {examData.SubID} {examData.SubName} ตอน {examData.Section} สาขา{' '}
              {examData.Major} {examData.Credit} หน่วยกิต
            </h2>

            {/* Exam Information */}
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
                <p className="p-2 border rounded">{examData.StudentAmount}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700">ผู้ออกข้อสอบ</label>
                <p className="p-2 border rounded">{examData.ExamAuthor}</p>
              </div>
              <div>
                <label className="block text-gray-700">โทรศัพท์มือถือ</label>
                <p className="p-2 border rounded">{examData.PhoneNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700">ห้องทำงาน</label>
                <p className="p-2 border rounded">{examData.OfficeRoom}</p>
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
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-300"
                onClick={() => router.push('/tech/printExam')}
              >
                Back
              </button>
              {examData.Status === 'Ready to print' && (
                <button
                  type="button"
                  className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-300"
                  onClick={handlePrintExam}
                >
                  Mark as Printed
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </LayoutTech2>
  );
}
