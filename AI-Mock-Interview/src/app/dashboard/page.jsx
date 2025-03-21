'use client';
import AddMockInterview from './_components/AddMockInterview'
import Footer from './_components/Footer'
import AllInterviews from './_components/allInterviews'
import { useState, useEffect } from 'react';

function Page() {
  const [showInterviews, setShowInterviews] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasInterviews, setHasInterviews] = useState(false);

  const toggleInterviews = () => {
    setShowInterviews(!showInterviews);

    if (!showInterviews) {
      setLoading(true);
    }
  };

  useEffect(() => {
    if (showInterviews) {

      const timer = setTimeout(() => {

        const hasAnyInterviews = true;

        setHasInterviews(hasAnyInterviews);
        setLoading(false);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [showInterviews]);

  return (
    <div className='min-h-screen flex flex-col relative'>

      <div className='flex flex-col md:flex-row flex-1'>

        <div
          className='w-full md:w-1/2 min-h-screen relative'
          style={{
            backgroundColor: "#232a34",
            color: "#01a1e8",
            backgroundImage: "url('./Dashboard.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className='absolute inset-0 bg-black bg-opacity-60'></div>
          <div className='relative z-10 p-10'>
            <div className='text-center mb-10 mt-10'>
              <h2 className='font-bold text-4xl mb-4'>Dashboard</h2>
              <h1 className='text-gray-400 text-xl'>Create and Start your AI Mock Interview</h1>
              <p className='mt-4 max-w-xl mx-auto text-gray-300'>
                Prepare for your next job interview with our AI-powered mock interviews.
                Practice responding to common interview questions and receive instant feedback.
              </p>
            </div>
            <div className='max-w-md mx-auto'>
              <AddMockInterview />
            </div>
            <div className='py-10 flex justify-center'>
              <button
                onClick={toggleInterviews}
                className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transform transition duration-300 hover:scale-105 shadow-lg'
              >
                View My Interviews
              </button>
            </div>
          </div>
        </div>
        <div
          className='w-full md:w-1/2 min-h-screen relative'
          style={{
            backgroundImage: "url('./img2.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >

          <div className='absolute inset-0 bg-black bg-opacity-50'></div>

          <div className='relative z-10 p-10 flex flex-col items-center justify-center h-full'>
            <h2 className='font-bold text-4xl mb-4 text-white'>Battle Royale</h2>
            <p className='text-gray-200 text-xl mb-8 text-center max-w-md'>
              Challenge your friends to interview battles and see who performs better!
            </p>

            <button className='bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl transform transition duration-300 hover:scale-105 shadow-lg'>
              Start Battle
            </button>
          </div>
        </div>
      </div>
      {showInterviews && (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
          <div
            className='rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto relative backdrop-blur-md shadow-xl'
            style={{ backgroundColor: 'rgba(100, 130, 170, 0.7)' }}
          >
            <button
              onClick={toggleInterviews}
              className='absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 transition-all hover:scale-110'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className='text-2xl font-bold text-center mb-6 pt-2 text-white'>My Interviews</h2>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
              </div>
            ) : (
              <div className='pt-4'>
                {hasInterviews ? (
                  <AllInterviews />
                ) : (
                  <div className="text-center py-16">
                    <p className="text-white text-lg">No interviews found. Create your first interview!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <Footer className='relative z-10' />
    </div>
  );
}
export default Page;