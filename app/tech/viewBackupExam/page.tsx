'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';
import LayoutTech2 from '@/components/LayoutTech2';

interface BackupExamData {
  BackupID: string;
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
  StudentAmount: string;
  Instructor: string;
}

export default function BackupExamPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  const backupID = searchParams.get('examId');

  const [examData, setExamData] = useState<BackupExamData | null>(null);

  // Fetch backup exam details based on BackupID
  useEffect(() => {
    const fetchBackupExamData = async () => {
      if (!backupID) return;

      console.log('Fetching backup exam data for BackupID:', backupID);

      try {
        const { data: examData, error: examError } = await supabase
          .from('Backup')
          .select(
            'BackupID, ExamDate, ExamTime, ExamRoom, AnswerSheet, Note, Calculator, Ruler, Description, Status, SubID, SubName, Section, Major, Credit, StudentAmount, Instructor'
          )
          .eq('BackupID', backupID)
          .single();

        if (examError) {
          console.error('Error fetching backup exam details:', examError);
          return;
        }

        console.log('Fetched exam data:', examData);

        // Only proceed if status is "Ready to print", "Printed", or "Backed up"
        if (
          examData.Status !== 'Ready to print' &&
          examData.Status !== 'Printed' &&
          examData.Status !== 'Backed up'
        ) {
          alert('This backup exam is not ready to be viewed.');
          router.push('/tech/printExam');
          return;
        }

        setExamData(examData);
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    fetchBackupExamData();
  }, [backupID, router]);
  return (
    <LayoutTech2>
      <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">
          View Backup Exam
        </h1>

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
                <p className="p-2 border rounded">{examData.StudentAmount}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700">ผู้ออกข้อสอบ</label>
                <p className="p-2 border rounded">{examData.Instructor}</p>
              </div>
            </div>

            <div className="mb-6 mt-8">
              <label className="block font-bold mb-4 text-xl">
                อุปกรณ์ที่ใช้และคำแนะนำผู้คุมสอบเพิ่มเติม
              </label>

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

              <div className="mb-4">
                <p>
                  <strong>ข้อเสนอแนะอื่นๆ:</strong> {examData.Description}
                </p>
              </div>
            </div>

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
                  //   onClick={handleMarkAsPrinted}
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
