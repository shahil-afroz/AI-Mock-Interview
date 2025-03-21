import { LightbulbIcon, LucideVolume2, LucidePauseCircle, LucidePlayCircle, LucideStopCircle } from 'lucide-react';
import React, { useState } from 'react';

function InterviewQuestions({ mockInterviewQuestion, activeQuestionIndex,setActiveQuestionIndex }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechInstance, setSpeechInstance] = useState(null);


  const texttoSpeech = (text) => {
    if ('speechSynthesis' in window) {
      if (speechInstance) {
        window.speechSynthesis.cancel();
      }
      const speech = new SpeechSynthesisUtterance(text);
      setSpeechInstance(speech);
      speech.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(speech);
      setIsSpeaking(true);
      setIsPaused(false);
    } else {
      alert('Your browser does not support text-to-speech functionality.');
    }
  };

  const pauseSpeech = () => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeech = () => {
    if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    mockInterviewQuestion && (
      <div className='p-6 bg-white border rounded-lg shadow-lg max-w-4xl mx-auto'>
        {/* Question Navigation */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8'
        >

          {mockInterviewQuestion.map((_, index) => (
            <button
              key={index}
              onClick={()=>setActiveQuestionIndex(index)}
              className={`py-2 px-4 rounded-full text-xs md:text-sm text-center cursor-pointer transition-colors duration-200
              ${activeQuestionIndex === index
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
            >
              Question #{index + 1}
            </button>
          ))}
        </div>

        {/* Active Question Display */}
        <h2 className='text-xl md:text-2xl font-semibold mb-6 text-gray-800'>
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>

        {/* Text-to-Speech Controls */}
        <div className='flex gap-4 items-center mb-10'>
          <button
            onClick={() => texttoSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
            className='p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200 shadow-md'
          >
            <LucideVolume2 size={24} />
          </button>

          {isSpeaking && !isPaused && (
            <button
              onClick={pauseSpeech}
              className='p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors duration-200 shadow-md'
            >
              <LucidePauseCircle size={24} />
            </button>
          )}

          {isPaused && (
            <button
              onClick={resumeSpeech}
              className='p-3 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors duration-200 shadow-md'
            >
              <LucidePlayCircle size={24} />
            </button>
          )}

          {isSpeaking && (
            <button
              onClick={stopSpeech}
              className='p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200 shadow-md'
            >
              <LucideStopCircle size={24} />
            </button>
          )}
        </div>

        {/* Note Section */}
        <div className='border rounded-lg p-6 bg-blue-50 shadow-inner'>
          <h2 className='flex gap-2 items-center text-violet-600 text-lg font-semibold mb-3'>
            <LightbulbIcon />
            <strong>Note:</strong>
          </h2>
          <p className='text-gray-700 text-sm leading-relaxed'>
            Click on <strong>Record Answer</strong> when you want to answer the question.
            At the end of the interview, we will provide feedback along with the correct answers
            for each question and your responses to evaluate efficiently.
          </p>
        </div>
      </div>
    )
  );
}

export default InterviewQuestions;
