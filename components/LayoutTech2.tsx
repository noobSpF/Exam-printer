import { useRouter } from 'next/navigation';

export default function LayoutTech2({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleProfile = () => {
    router.push('/tech/profile'); // Navigate to profile page
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
            <li
              className="text-xl px-4 py-2  text-center cursor-pointer hover:bg-gray-600"
              onClick={() => router.push('/tech/dashBoard')}
            >
              All exam
            </li>
            <li
              className="text-xl px-4 py-2 text-center  bg-gray-700 text-cyan-400 "
              onClick={() => router.push('/tech/printExam')}
            >
              Print exam
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

        <main className="bg-gray-100 flex-grow">{children}</main>
      </div>
    </div>
  );
}
