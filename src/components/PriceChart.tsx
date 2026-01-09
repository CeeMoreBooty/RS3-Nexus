import { useEffect, useState, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { priceService } from '../services/priceService';
import { PriceHistory } from '../types';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceChartProps {
  itemName: string;
  days: number;
}

function PriceChart({ itemName, days }: PriceChartProps) {
  const [history, setHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    const data = await priceService.getPriceHistory(itemName, days);
    setHistory(data);
    setLoading(false);
  }, [itemName, days]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  if (loading) {
    return <div className="spinner" style={{ margin: '2rem auto' }}></div>;
  }

  const chartData = {
    labels: history.map(h => format(new Date(h.timestamp), 'MMM dd')),
    datasets: [
      {
        label: 'Price (gp)',
        data: history.map(h => h.price),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${itemName} - ${days} Day Price History`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `Price: ${context.parsed.y.toLocaleString()} gp`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: any) => `${value.toLocaleString()} gp`,
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default PriceChart;
