import AddMockInterview from './_components/AddMockInterview'

function page() {

  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl'>Dashboard</h2>
        <h1 className='text-gray-700'>Create and Start your AI Mock Interview</h1>
        <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
          <AddMockInterview/>



        </div>
        <div>
            {/* <AllInterview/> */}
          </div>


    </div>
  )
}

export default page
