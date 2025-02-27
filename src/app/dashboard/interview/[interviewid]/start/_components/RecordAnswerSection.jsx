import { Button } from "@/components/ui/button";
import { chatSession } from "@/lib/AI/GeminiAIModel";
import { Loader2, Mic, PauseCircleIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewid }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      setUserAnswer(""); // Clear previous answer
      setIsRecording(true);
      audioChunksRef.current = [];

      // Release previous audio URL if it exists
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
        setAudioURL(null);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm' // Using webm for better browser compatibility
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        // Create a proper audio blob with the correct MIME type
        const audioFile = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioFile);

        // Create and store audio URL for playback
        const url = URL.createObjectURL(audioFile);
        setAudioURL(url);

        await transcribeAudio(audioFile);
      };

      // Request data at regular intervals to ensure timing information is preserved
      mediaRecorderRef.current.start(100); // Collect data every 100ms
      toast.success("Recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error("Could not access microphone. Please check permissions.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsRecording(false);
      mediaRecorderRef.current.stop();

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      toast.info("Recording stopped");
    }
  };

  const transcribeAudio = async (audioFile) => {
    if (!audioFile) return;
    console.log("audioFile:", audioFile);
    setIsTranscribing(true);
    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      if (data.transcript) {
        setUserAnswer(data.transcript);
        toast.success("Audio transcribed successfully");
      } else {
        toast.error(data.error || "Failed to transcribe audio");
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast.error("Error processing your audio. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const updateAnswerToDB = async () => {
    if (userAnswer.length <= 10) {
      toast.warning("Answer is too short to be saved");
      return;
    }

    setLoading(true);
    try {
      const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}.
      Give rating, feedback for improvement, and correct answer in JSON format.`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const responseText = result.response.text();

      // More robust JSON extraction
      let jsonData;
      try {
        // Try to parse the whole response first
        jsonData = JSON.parse(responseText);
      } catch {
        // If that fails, try to extract JSON from code blocks
        const jsonMatch = responseText.match(/```(?:json)?([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonData = JSON.parse(jsonMatch[1].trim());
        } else {
          // Last attempt: clean the string and try again
          const cleanedResponse = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
          jsonData = JSON.parse(cleanedResponse);
        }
      }

      const mockUserAns = {
        mockInterviewId: interviewid,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        userAnswer,
        feedback: jsonData,
      };

      const response = await fetch(`/api/mock/${interviewid}/ans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockUserAns),
      });

      if (response.ok) {
        toast.success("Answer saved successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error while saving your answer");
      }
    } catch (error) {
      console.error("Error saving answer:", error);
      toast.error(error.message || "Error while saving your answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <Image src="/webcam1.png" alt="webcam background" width={200} height={100} className="absolute z-0 opacity-50" />
        <Webcam mirrored={true} className="relative z-10 rounded-lg" style={{ width: "100%", height: 300 }} />
      </div>

      <Button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isTranscribing}
        className={`px-6 py-3 text-lg font-semibold rounded-full shadow-md ${
          isRecording ? "bg-red-600 hover:bg-red-700" : "bg-violet-600 hover:bg-violet-700"
        }`}
      >
        {isRecording ? (
          <><PauseCircleIcon className="mr-2" /> Stop Recording</>
        ) : (
          <><Mic className="mr-2" /> Start Recording</>
        )}
      </Button>

      {isTranscribing && (
        <div className="flex items-center justify-center text-violet-700">
          <Loader2 className="animate-spin mr-2" />
          <span>Transcribing your answer...</span>
        </div>
      )}

      {audioURL && (
        <div className="w-full max-w-2xl">
          <audio src={audioURL} controls className="w-full" />
        </div>
      )}

      {userAnswer && (
        <div className="p-4 w-full max-w-2xl bg-gray-100 border border-gray-300 rounded-lg shadow-inner">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Recorded Answer:</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{userAnswer}</p>
        </div>
      )}

      <Button
        onClick={updateAnswerToDB}
        disabled={loading || !userAnswer || userAnswer.length <= 10}
        className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-md"
      >
        {loading ? (
          <><Loader2 className="animate-spin mr-2" /> Processing...</>
        ) : (
          "Save My Answer"
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
