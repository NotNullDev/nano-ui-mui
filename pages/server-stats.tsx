import Chart from "chart.js/auto";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const sampleStorage: ServerStorageStats = {
  free: 45,
  used: 55,
};

const now = dayjs().startOf("hour");
const a = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 40, 32, 84, 35];
const sampleCpu: ServerCpuStats = {
  cpuPercentages: a,
  timestamps: a.map((a, idx) => now.subtract(idx, "hours").format("HH:mm")),
};

type ServerStorageStats = {
  free: number;
  used: number;
};

type ServerCpuStats = {
  cpuPercentages: number[];
  timestamps: String[];
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
  useChartData();
  useCpuChartData();

  return (
    <div className="flex gap-20 items-center">
      <div className="w-[400px] flex flex-col items-center">
        <canvas id="acquisitions"></canvas>
        <h2 className="text-xl font-bold">Memory usage</h2>
      </div>
      <div className="w-[400px] flex flex-col items-center">
        <canvas id="cpu-chart"></canvas>
        <h2 className="text-xl font-bold">Cpu usage</h2>
      </div>
    </div>
  );
};

export default ServerStatsPage;

function useChartData() {
  const [chartData, setChartData] = useState<ServerStorageStats>(sampleStorage);

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
            label: "Storage usage",
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
}

function useCpuChartData() {
  const [cpuData, setCpuData] = useState<ServerCpuStats>(sampleCpu);

  useEffect(() => {
    const canvasRef = document.querySelector("#cpu-chart") as HTMLCanvasElement;
    if (!canvasRef) {
      toast("No canvas found");
      return;
    }

    const chart = new Chart(canvasRef, {
      type: "line",
      options: {
        color: "#ecebeb",
      },
      data: {
        labels: cpuData?.timestamps,
        datasets: [
          {
            label: "Cpu over time",
            data: [...cpuData?.cpuPercentages],
            tension: 0.1,
            fill: false,
          },
        ],
      },
    });

    return () => {
      chart.destroy();
    };
  }, [cpuData]);
}
