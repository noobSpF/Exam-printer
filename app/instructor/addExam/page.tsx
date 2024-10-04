'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getUserEmailFromCookies } from '@/utils/cookies/cookieUtils';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';

interface InstructorData {
  name: string;
  email: string;
  phone: string;
  rol: string;
}

export default function AddExamPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const subId = searchParams.get('subId'); // Get SubID from query param

  const [formData, setFormData] = useState<{
    subject: string;
    code: string;
    examDate: string;
    examTime: string;
    examRoom: string;
    section: string;
    examAuthor: string;
    phoneNumber: string;
    officeRoom: string;
    numStudents: string;
    answerSheet: boolean;
    attachment: File | null;
    SubID: string;
    SubName: string;
    major: string;
    credit: string;
    noteAllowed: boolean;
    calculatorAllowed: boolean;
    rulerAllowed: boolean;
    otherEquipment: string;
    userID: string;
    examID: string;
    email: string;
    username: string;
  }>({
    subject: '',
    code: '',
    examDate: '',
    examTime: '',
    examRoom: '',
    section: '',
    examAuthor: '',
    phoneNumber: '',
    officeRoom: '',
    numStudents: '',
    answerSheet: false,
    attachment: null,
    SubID: '',
    SubName: '',
    major: '',
    userID: '',
    examID: '',
    email: '',
    username: '',
    noteAllowed: false,
    calculatorAllowed: false,
    rulerAllowed: false,
    otherEquipment: '',
    credit: '',
  });

  const [instructor, setInstructor] = useState<InstructorData | null>(null);

  // Fetch instructor data from the profile (email cookies)
  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const email = await getUserEmailFromCookies(); // Assume async cookie function
        if (!email) return;

        const { data, error } = await supabase
          .from('Users')
          .select('username, Email, Tel, UserID') // Fetch UserID along with other details
          .eq('Email', email)
          .single();

        if (error) {
          console.error('Error fetching instructor data:', error);
        } else {
          setInstructor({
            name: data.username,
            email: data.Email,
            phone: data.Tel,
            rol: 'Instructor',
          });

          // Set instructor details into formData
          setFormData((prevData) => ({
            ...prevData,
            email: data.Email,
            examAuthor: data.username,
            phoneNumber: data.Tel,
            userID: data.UserID,
          }));
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    fetchInstructor();
  }, []);

  // Fetch subject data based on SubID
  useEffect(() => {
    if (subId) {
      const fetchSubjectData = async () => {
        const { data, error } = await supabase
          .from('Subject')
          .select('SubID, SubName, Section, Major, Credit')
          .eq('SubID', subId)
          .single();

        if (error) {
          console.error('Error fetching subject data:', error);
        } else {
          setFormData((prevData) => ({
            ...prevData,
            subject: data.SubName,
            code: data.SubID,
            section: data.Section,
            major: data.Major,
            credit: data.Credit,
          }));
        }
      };

      fetchSubjectData();
    }
  }, [subId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.examDate || !formData.examTime || !formData.examRoom) {
      alert('Please fill in all required fields.');
      return;
    }

    let attachmentUrl = '';

    // Handle file upload if a file is attached
    if (formData.attachment) {
      const file = formData.attachment;
      const { data, error } = await supabase.storage
        .from('exam-files')
        .upload(`exams/${file.name}`, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file');
        return;
      }

      attachmentUrl = data.path;
    }

    // Check if the exam already exists based on SubID
    const { data: existingExam, error: examFetchError } = await supabase
      .from('Exam')
      .select('ExamID')
      .eq('SubID', formData.code)
      .limit(1);

    if (examFetchError) {
      console.error('Error fetching exam data:', examFetchError);
      alert('Error fetching exam data');
      return;
    }

    let examID;
    if (existingExam && existingExam.length > 0) {
      examID = existingExam[0].ExamID;

      // Update existing exam
      const { error: updateError } = await supabase
        .from('Exam')
        .update({
          ExamDate: formData.examDate,
          ExamTime: formData.examTime,
          ExamRoom: formData.examRoom,
          AnswerSheet: formData.answerSheet,
          Note: formData.noteAllowed,
          Calculator: formData.calculatorAllowed,
          Ruler: formData.rulerAllowed,
          Description: formData.otherEquipment,
          attachmentUrl: attachmentUrl || null,
          Status: 'Submitted',
        })
        .eq('ExamID', examID);

      if (updateError) {
        console.error('Error updating exam data:', updateError);
        alert('Failed to update exam data');
        return;
      }
    } else {
      // Insert new exam
      const { data: newExam, error: insertError } = await supabase
        .from('Exam')
        .insert({
          SubID: formData.code,
          ExamDate: formData.examDate,
          ExamTime: formData.examTime,
          ExamRoom: formData.examRoom,
          AnswerSheet: formData.answerSheet,
          Note: formData.noteAllowed,
          Calculator: formData.calculatorAllowed,
          Ruler: formData.rulerAllowed,
          Description: formData.otherEquipment,
          attachmentUrl: attachmentUrl || null,
          Status: 'Submitted',
        })
        .select('ExamID')
        .single();

      if (insertError) {
        console.error('Error inserting exam data:', insertError);
        alert('Failed to insert exam data');
        return;
      }

      examID = newExam.ExamID;
    }

    // Check if there's an existing Submit record for this ExamID
    const { data: existingSubmit, error: submitFetchError } = await supabase
      .from('Submit')
      .select('SubmitID')
      .eq('ExamID', examID)
      .maybeSingle();

    if (submitFetchError) {
      console.error('Error fetching submit data:', submitFetchError);
      alert('Error fetching submit data');
      return;
    }

    if (existingSubmit) {
      // Update the record in the Submit table
      const { error: submitUpdateError } = await supabase
        .from('Submit')
        .update({
          Email: formData.email,
          Username: formData.examAuthor,
          Tel: formData.phoneNumber,
          OfficeRoom: formData.officeRoom,
        })
        .eq('SubmitID', existingSubmit.SubmitID);

      if (submitUpdateError) {
        console.error('Error updating submit data:', submitUpdateError);
        alert('Failed to update submit data');
        return;
      }
    } else {
      // Insert a new record into Submit table
      const { error: submitInsertError } = await supabase
        .from('Submit')
        .insert({
          ExamID: examID,
          Email: formData.email,
          Username: formData.examAuthor,
          Tel: formData.phoneNumber,
          OfficeRoom: formData.officeRoom,
        });

      if (submitInsertError) {
        console.error('Error submitting to Submit table:', submitInsertError);
        alert('Failed to submit data to the Submit table');
        return;
      }
    }
    alert('เพิ่มข้อสอบสำเร็จ');
    router.push('/instructor/dashBoard');
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({ ...formData, attachment: file });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  return (
    <Layout>
      <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Add Exam</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-center">
              {formData.code} {formData.subject} ตอน {formData.section} สาขา{' '}
              {formData.major} {formData.credit} หน่วยกิต
            </h2>
          </div>

          {/* Subject and Code */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700">วิชา</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>

            <div>
              <label className="block text-gray-700">รหัสวิชา</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>
          </div>

          {/* Exam Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700">วันที่สอบ</label>
              <input
                type="date"
                name="examDate"
                value={formData.examDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700">เวลาสอบ</label>
              <input
                type="time"
                name="examTime"
                value={formData.examTime}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Other Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">ห้องสอบ</label>
              <input
                type="text"
                name="examRoom"
                value={formData.examRoom}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700">ตอน</label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-700">ผู้ออกข้อสอบ</label>
              <input
                type="text"
                name="examAuthor"
                value={formData.examAuthor} // Filled with profile username
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>

            <div>
              <label className="block text-gray-700">โทรศัพท์มือถือ</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber} // Filled with profile phone number
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>

            <div>
              <label className="block text-gray-700">ห้องทำงาน</label>
              <input
                type="text"
                name="officeRoom"
                value={formData.officeRoom}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Equipment Section */}
          <div className="mb-6 mt-8">
            <label className="block text-gray-700 mb-2">
              อุปกรณ์ที่ใช้หรือคำแนะนำผู้คุมสอบเพิ่มเติม
            </label>

            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="answerSheet"
                  checked={formData.answerSheet}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2">ต้องการกระดาษคำตอบหรือไม่</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="noteAllowed"
                  checked={formData.noteAllowed}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2">นำตำราเข้าห้องสอบได้</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="calculatorAllowed"
                  checked={formData.calculatorAllowed}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2">นำเครื่องคิดเลขเข้าห้องสอบได้</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="rulerAllowed"
                  checked={formData.rulerAllowed}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2">
                  ห้ามนำไม้บรรทัดมีสูตรคณิตศาสตร์เข้าสอบ
                </span>
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">ข้อเสนอแนะ:อื่นๆ</label>
              <textarea
                name="otherEquipment"
                value={formData.otherEquipment}
                onChange={handleInputChange}
                className="w-full p-2 border rounded h-24"
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="mb-6">
            <label className="block text-gray-700">Attachment</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
              accept="application/pdf"
            />
            <p className="text-gray-600 text-sm mt-1">
              Maximum file size: 50MB | Type of file: Pdf
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="bg-red-500 text-white font-bold py-2 px-4 rounded"
              onClick={() => router.push('/instructor/dashBoard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
