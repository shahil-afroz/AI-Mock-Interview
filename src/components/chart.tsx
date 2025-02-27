"use client"; // This is a client component

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Define the expected data structure based on your API response
interface Answer {
  id: string;
  userId: string;
  question: string;
  userAnswer: string;
  createdAt: string;
  Intervieweefeedback: string;
  Intervieweerating: number;
  correctAnswer: string;
  mockInterviewId: string;
}

interface Rating {
  jobPosition: string;
  answers: Answer[];
}

interface ApiResponse {
  ratings: Rating[];
}

const RatingsChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(
          "/api/getAllRating?userId=user_2tWjtbVGS2lU3JVTjGO0x7L4qmF"
        );
        console.log("response:", response);
        if (!response.ok) {
          throw new Error("Failed to fetch ratings");
        }
        const data: ApiResponse = await response.json();

        // Process the data to extract jobPosition and ratings
        const labels: string[] = [];
        const ratings: number[] = [];

        data.ratings.forEach((rating, index) => {
          const label = `${rating.jobPosition} #${index + 1}`;
          labels.push(label);
          const ratingValue =
            rating.answers.length > 0 ? rating.answers[0].Intervieweerating : 0;
          ratings.push(ratingValue);
        });

        // Set up Chart.js data with gradient
        const ctx = document.createElement("canvas").getContext("2d");
        const gradient = ctx?.createLinearGradient(0, 0, 0, 400);
        gradient?.addColorStop(0, "rgba(75, 192, 192, 0.8)");
        gradient?.addColorStop(1, "rgba(75, 192, 192, 0.2)");

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Interviewer Rating",
              data: ratings,
              fill: true, // Fill area under the line
              backgroundColor: gradient, // Gradient fill
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              tension: 0.4, // Smooth curves
              pointBackgroundColor: "rgba(255, 255, 255, 1)", // White points
              pointBorderColor: "rgba(75, 192, 192, 1)",
              pointBorderWidth: 2,
              pointRadius: 5, // Larger points
              pointHoverRadius: 8, // Larger on hover
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 14,
            family: "Arial",
          },
          color: "#333",
        },
      },
      title: {
        display: true,
        text: "Interviewer Ratings by Job Position",
        font: {
          size: 20,
          family: "Arial",
          weight: "bold" as const,
        },
        color: "#333",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5, // Assuming ratings are out of 5
        title: {
          display: true,
          text: "Rating",
          font: {
            size: 14,
            family: "Arial",
          },
          color: "#666",
        },
        grid: {
          color: "rgba(200, 200, 200, 0.3)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Job Position",
          font: {
            size: 14,
            family: "Arial",
          },
          color: "#666",
        },
        grid: {
          display: false, // Hide X-axis grid lines for cleaner look
        },
      },
    },
    animation: {
      duration: 1500, // Smooth animation
      easing: "easeInOutQuart" as const,
    },
  };

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!chartData) return <div className="text-center text-gray-500">No data available</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default RatingsChart;
