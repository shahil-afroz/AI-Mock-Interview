import { CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { io, Socket } from 'socket.io-client';

// Register the necessary components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface UserScore {
  score: number;
  name: string;
}

interface ScoresData {
  [userId: string]: UserScore;
}

const InterviewStandingsGraph = ({ groupId }: { groupId: string }) => {
  // Initialize with localStorage if available
  const [scores, setScores] = useState<ScoresData>(() => {
    const savedScores = localStorage.getItem(`scores_${groupId}`);
    return savedScores ? JSON.parse(savedScores) : {};
  });
  const [socketStatus, setSocketStatus] = useState<string>("disconnected");
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  // Save scores to localStorage when they change
  useEffect(() => {
    if (Object.keys(scores).length > 0) {
      localStorage.setItem(`scores_${groupId}`, JSON.stringify(scores));
    }
  }, [scores, groupId]);

  useEffect(() => {
    console.log("Component mounted with groupId:", groupId);

    // Create socket connection
    const socket: Socket = io('https://ai-mock-interview-wpaa.onrender.com', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      transports: ['websocket', 'polling'] // Try both transports
    });

    setSocketInstance(socket);

    // Fetch initial scores from the server
    const fetchInitialScores = async () => {
      try {
        const response = await fetch(`/api/interview-groups/${groupId}/scores`);
        if (!response.ok) {
          throw new Error(`Failed to fetch scores: ${response.status}`);
        }
        const initialScores = await response.json();
        console.log("Initial scores fetched:", initialScores);

        // Only update if we got valid scores and merge with existing
        if (initialScores && Object.keys(initialScores).length > 0) {
          setScores(prevScores => ({...prevScores, ...initialScores}));
        }
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    // Socket connection status events
    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket.id);
      setSocketStatus("connected");

      // Join the specific room for this group AFTER connection
      socket.emit('join-group', groupId);
      console.log('Emitted join-group for:', groupId);

      // Fetch initial scores after connection established
      fetchInitialScores();
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setSocketStatus("disconnected");
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setSocketStatus("error: " + error.message);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnection attempt ${attempt}`);
      setSocketStatus(`reconnecting: attempt ${attempt}`);
    });

    socket.io.on("reconnect", () => {
      console.log("Reconnected to server");
      setSocketStatus("reconnected");
      // Rejoin the group after reconnection
      socket.emit('join-group', groupId);
    });

    // Listen for score updates
    socket.on('score-update', (updatedScores) => {
      console.log("★ Received score update:", updatedScores);
      setScores(prevScores => {
        // Create a proper merged object with both previous and new scores
        const newScores = {...prevScores};

        // Only merge valid score data
        if (updatedScores && typeof updatedScores === 'object') {
          Object.keys(updatedScores).forEach(userId => {
            if (updatedScores[userId] &&
                typeof updatedScores[userId].score === 'number') {
              newScores[userId] = updatedScores[userId];
            }
          });
        }

        console.log("Updated scores state:", newScores);
        return newScores;
      });
    });

    return () => {
      console.log('Cleaning up socket connection');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('score-update');
      socket.disconnect();
      setSocketInstance(null);
    };
  }, [groupId]); // Only re-run if groupId changes

  // Manual reconnection function
  const handleReconnect = () => {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance.connect();
      setSocketStatus("reconnecting...");
    }
  };

  // Transform the nested data structure for the chart
  const chartData = {
    labels: Object.values(scores).map(user => user.name),
    datasets: [
      {
        label: 'Participant Scores',
        data: Object.values(scores).map(user => user.score),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 500
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div>
      <h3>Interview Standings</h3>
      <div style={{
        color: socketStatus === "connected" ? "green" :
               socketStatus === "reconnected" ? "green" :
               socketStatus.includes("reconnecting") ? "orange" : "red",
        marginBottom: "10px"
      }}>
        Socket Status: {socketStatus}
        {socketStatus !== "connected" && socketStatus !== "reconnected" && (
          <button
            onClick={handleReconnect}
            style={{ marginLeft: "10px", padding: "2px 8px" }}
          >
            Reconnect
          </button>
        )}
      </div>
      {Object.keys(scores).length === 0 ? (
        <p>Loading data...</p>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default InterviewStandingsGraph;
