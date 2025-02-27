import AddMockInterview from './_components/AddMockInterview'
import Footer from './_components/Footer'

function page() {
  return (
    <div className='p-10 min-h-screen' style={{ backgroundColor: "#232a34", color: "#01a1e8" }}>
      <div className='flex flex-col md:flex-row items-center justify-between gap-8 mb-20'>
        {/* Left side - AI Interview Info */}
        <div className='md:w-1/2'>
          <h2 className='font-bold text-3xl mb-2'>Dashboard</h2>
          <h1 className='text-gray-400'>Create and Start your AI Mock Interview</h1>
          <p className='mt-4'>
            Prepare for your next job interview with our AI-powered mock interviews.
            Practice responding to common interview questions and receive instant feedback.
          </p>
        </div>
        
        {/* Middle - Image */}
        <div className='flex justify-center'>
          <img 
            src="./Job.webp" 
            alt="Interview illustration" 
            className='h-[40vh] w-auto' 
          />
        </div>
        
        {/* Right side - AddNew component */}
        <div className='md:w-1/2'>
          <AddMockInterview />
        </div>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-3 my-5 gap-4 py-10'>
        {/* This area will hold interview cards */}
      </div>
      
      <div className='py-10'>
        {/* <AllInterview/> */}
      </div>
      <Footer/>
    </div>
  )
}

export default page