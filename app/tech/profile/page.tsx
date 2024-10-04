'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getUserEmailFromCookies } from '@/utils/cookies/cookieUtils';
import { useRouter } from 'next/navigation';

interface InstructorData {
  name: string;
  email: string;
  phone: string;
  rol: string;
}

function App() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();
  const [instructor, setInstructor] = useState<InstructorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const email = await getUserEmailFromCookies(); // Use await here if it's async
        console.log('Retrieved email from cookies:', email);

        if (!email) {
          setError('No email found in cookies');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('Users')
          .select('username, Email, Tel, Role')
          .ilike('Email', email);

        console.log('Data:', data);
        console.log('Error:', error);
        if (error) {
          setError('Error fetching instructor data: ' + error.message);
        } else if (data.length === 0) {
          setError('No instructor found with the provided email.');
        } else if (data.length > 1) {
          setError(
            'Multiple instructors found with the provided email. Please contact support.'
          );
        } else {
          setInstructor({
            name: data[0].username || 'Unknown',
            email: data[0].Email || 'Unknown',
            phone: data[0].Tel || 'Unknown',
            rol: data[0].Role || 'Unknown',
          });
        }
      } catch (err) {
        setError('Unexpected error occurred: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, []);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error}</p>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left side (Profile Info) */}
      <div
        style={{
          backgroundColor: '#FDE7CE',
          width: '40%',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '50%',
            width: '100px',
            height: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Placeholder for Profile Image */}
          <span style={{ fontSize: '4rem', color: '#000' }}>👤</span>
        </div>
        <h2 style={{ marginTop: '1rem' }}>{instructor?.name}</h2>
        <p style={{ marginTop: '1rem' }}>{instructor?.rol}</p>
      </div>

      {/* Right side (Contact Info) */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          width: '60%',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>📧</span>
            <span>Email:</span>
            <span>{instructor?.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>📞</span>
            <span>Phone:</span>
            <span>{instructor?.phone}</span>
          </div>
        </div>
        <button
          style={{
            marginTop: '2rem',
            backgroundColor: '#6A52D6',
            color: '#fff',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={async () => {
            // Call logout function
            const { error } = await supabase.auth.signOut();
            if (error) {
              console.error('Error logging out:', error.message);
            } else {
              // On successful logout, redirect to the sign-in page
              router.push('/sign-in'); // Update this path if necessary
              console.log('Successful logging out:');
            }
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;
``;
