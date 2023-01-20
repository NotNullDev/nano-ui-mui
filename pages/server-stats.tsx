import Chart from "chart.js/auto";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type ServerStorageStats = {
  free: number;
  used: number;
};

type ServerCpuStats = {
  cpuPercentages: number[];
};

type ServerMemoryInfo = {
  total: number;
  used: number;
  date: Date;
};

type ServerMemoryStats = {
  memoryInfo: ServerMemoryInfo[];
};

export const ServerStatsPage = () => {
  const [chartData, setChartData] = useState<ServerStorageStats>({
    free: 45,
    used: 55,
  });

  useEffect(() => {
    const canvasRef = document.querySelector(
      "#acquisitions"
    ) as HTMLCanvasElement;
    if (!canvasRef) {
      toast("No canvas found");
      return;
    }

    const chart = new Chart(canvasRef, {
      type: "pie",
      options: {
        color: "#ecebeb",
      },
      data: {
        labels: ["Free", "Used"],
        datasets: [
          {
            label: "Storage",
            data: [chartData?.free, chartData?.used],
            backgroundColor: ["#166534", "#991b1b"],
          },
        ],
      },
    });

    return () => {
      chart.destroy();
    };
  }, [chartData]);

  return (
    <div>
      <div className="w-[400px] flex flex-col items-center">
        <h2 className="text-xl font-bold">Storage usage</h2>
        <canvas id="acquisitions"></canvas>
      </div>
    </div>
  );
};

export default ServerStatsPage;
