import AddMockInterview from './_components/AddMockInterview'
import Footer from './_components/Footer'

function page() {
  return (
    <div 
      className='min-h-screen relative' 
      style={{ 
        backgroundColor: "#232a34", 
        color: "#01a1e8",
        backgroundImage: "url('./Dashboard.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Overlay to ensure text is readable */}
      <div className='absolute inset-0 bg-black bg-opacity-60'></div>

      {/* Content container */}
      <div className='relative z-10 p-10'>
        {/* Centered Heading */}
        <div className='text-center mb-20 mt-10'>
          <h2 className='font-bold text-5xl mb-4'>Dashboard</h2>
          <h1 className='text-gray-400 text-xl'>Create and Start your AI Mock Interview</h1>
          <p className='mt-4 max-w-2xl mx-auto text-gray-300'>
            Prepare for your next job interview with our AI-powered mock interviews.
            Practice responding to common interview questions and receive instant feedback.
          </p>
        </div>
        
        {/* Add Mock Interview Component */}
        <div className='max-w-md mx-auto'>
          <AddMockInterview />
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-3 my-5 gap-4 py-10'>
          {/* This area will hold interview cards */}
        </div>
        
        <div className='py-10'>
          {/* <AllInterview/> */}
        </div>
        
        <Footer/>
      </div>
    </div>
  )
}

export default page