import { Button } from "@mui/material";
import Chart from "chart.js/auto";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  clearBuilds,
  dockerSystemPrune,
  resetGlobalBuildStatus,
} from "../api/nanoContext";
import { NanoToolbar } from "../components/NanoToolbar";

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

const sampleMemory: ServerMemoryStats = {
  maxMemory: 500,
  memoryStats: [
    {
      used: 70,
      date: now.subtract(1, "hours").toDate(),
    },
    {
      used: 50,
      date: now.subtract(2, "hours").toDate(),
    },
    {
      used: 63,
      date: now.subtract(3, "hours").toDate(),
    },
    {
      used: 57,
      date: now.subtract(4, "hours").toDate(),
    },
    {
      used: 55,
      date: now.subtract(5, "hours").toDate(),
    },
    {
      used: 55,
      date: now.subtract(6, "hours").toDate(),
    },
    {
      used: 54,
      date: now.subtract(7, "hours").toDate(),
    },
    {
      used: 50,
      date: now.subtract(8, "hours").toDate(),
    },
    {
      used: 88,
      date: now.subtract(9, "hours").toDate(),
    },
    {
      used: 50,
      date: now.subtract(10, "hours").toDate(),
    },
    {
      used: 50,
      date: now.subtract(11, "hours").toDate(),
    },
    {
      used: 50,
      date: now.subtract(12, "hours").toDate(),
    },
    {
      used: 50,
      date: now.subtract(13, "hours").toDate(),
    },
    {
      used: 50,
      date: now.subtract(14, "hours").toDate(),
    },
  ],
};

type ServerStorageStats = {
  free: number;
  used: number;
};

type ServerCpuStats = {
  cpuPercentages: number[];
  timestamps: String[];
};

type ServerMemoryStats = {
  memoryStats: ServerMemoryInfo[];
  maxMemory: number;
};

type ServerMemoryInfo = {
  used: number;
  date: Date;
};

export const ServerStatsPage = () => {
  return (
    <div className="flex gap-20 items-center flex-col mt-20">
      <NanoToolbar>
        <Button variant="outlined" className="text-yellow-500">
          Refresh statistics
        </Button>
        <Button
          variant="outlined"
          className="text-yellow-500"
          onClick={async () => {
            await dockerSystemPrune();
            toast("success");
          }}
        >
          Run docker system prune
        </Button>
        <Button
          variant="outlined"
          className="text-yellow-500"
          onClick={async () => {
            await clearBuilds();
            toast("success");
          }}
        >
          Clear builds
        </Button>
        <Button
          variant="outlined"
          className="text-yellow-500"
          onClick={async () => {
            await resetGlobalBuildStatus();
            toast("Success");
          }}
        >
          Reset global build status
        </Button>
      </NanoToolbar>
      <ChartsArea />
    </div>
  );
};

export default ServerStatsPage;

function ChartsArea() {
  useChartData();
  useCpuChartData();
  useMemoryChartData();
  return (
    <div className="flex gap-20 items-center">
      <div className="w-[400px] flex flex-col items-center">
        <canvas id="cpu-chart"></canvas>
        <h2 className="text-xl font-bold">Cpu usage</h2>
      </div>
      <div className="w-[400px] flex flex-col items-center">
        <canvas id="memory-chart"></canvas>
        <h2 className="text-xl font-bold">Memory usage</h2>
      </div>
      <div className="w-[300px] flex flex-col items-center">
        <canvas id="acquisitions"></canvas>
        <h2 className="text-xl font-bold">Storage</h2>
      </div>
    </div>
  );
}

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
            backgroundColor: ["#2bbd7e", "#c4001d"],
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
        scales: {
          y: {
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, ticks) {
                return value + "%";
              },
            },
          },
        },
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

function useMemoryChartData() {
  const [memoryData, setMemoryData] = useState<ServerMemoryStats>(sampleMemory);

  useEffect(() => {
    const canvasRef = document.querySelector(
      "#memory-chart"
    ) as HTMLCanvasElement;
    if (!canvasRef) {
      toast("No canvas found");
      return;
    }

    const chart = new Chart(canvasRef, {
      type: "line",
      options: {
        color: "#ecebeb",
        scales: {
          y: {
            suggestedMax: memoryData.maxMemory,
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, ticks) {
                return value + " MB";
              },
            },
            max: memoryData.maxMemory,
          },
        },
      },
      data: {
        labels: memoryData.memoryStats.map((m) =>
          dayjs(m.date).format("HH:mm")
        ),
        datasets: [
          {
            label: "Memory over time",
            data: [...memoryData.memoryStats.map((m) => m.used)],
            tension: 0.1,
            fill: false,
          },
        ],
      },
    });

    return () => {
      chart.destroy();
    };
  }, [memoryData]);
}
