
import React, { useMemo, useState } from 'react';
import { TimeEntry, FormDiscipline } from '../types';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, DoughnutController } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import KpiCard from './KpiCard';
import ChartBarIcon from './icons/ChartBarIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController
);

interface DashboardProps {
  entries: TimeEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  const [selectedProject, setSelectedProject] = useState('ALL');

  const projectOptions = useMemo(() => {
    return Array.from(new Set(entries.map(entry => entry.projectName)));
  }, [entries]);

  const { totalHours, totalProjects, totalEntries, projectData, disciplineData, filteredEntries } = useMemo(() => {
    const filteredEntries = selectedProject === 'ALL'
      ? entries
      : entries.filter(entry => entry.projectName === selectedProject);

    if (!filteredEntries || filteredEntries.length === 0) {
      return { totalHours: 0, totalProjects: 0, totalEntries: 0, projectData: { labels: [], datasets: [] }, disciplineData: { labels: [], datasets: [] }, filteredEntries: [] };
    }

    const totalHours = filteredEntries.reduce((acc, entry) => acc + entry.hours, 0);
    const uniqueProjects = new Set(filteredEntries.map(entry => entry.projectName));
    const totalEntries = filteredEntries.length;

    // Data for Bar chart (Project vs Hours)
    const projectHours: { [key: string]: number } = {};
    filteredEntries.forEach(entry => {
      projectHours[entry.projectName] = (projectHours[entry.projectName] || 0) + entry.hours;
    });
    
    const projectLabels = Object.keys(projectHours);
    const projectHoursData = Object.values(projectHours);
    
    const projectData = {
      labels: projectLabels,
      datasets: [
        {
          label: '투입 시간 (h)',
          data: projectHoursData,
          backgroundColor: 'rgba(79, 70, 229, 0.7)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };

    // Data for Doughnut chart (Discipline vs Hours)
    const disciplineHours: { [key in FormDiscipline]?: number } = {};
    filteredEntries.forEach(entry => {
        disciplineHours[entry.discipline] = (disciplineHours[entry.discipline] || 0) + entry.hours;
    });

    const disciplineLabels = Object.keys(disciplineHours);
    const disciplineHoursData = Object.values(disciplineHours);
    
    const disciplineData = {
      labels: disciplineLabels,
      datasets: [
        {
          label: '투입 시간 (h)',
          data: disciplineHoursData,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(249, 115, 22, 1)',
            'rgba(139, 92, 246, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return { totalHours, totalProjects: uniqueProjects.size, totalEntries, projectData, disciplineData, filteredEntries };
  }, [entries, selectedProject]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        font: {
            size: 16,
            weight: 'bold' as const,
        },
        padding: {
            top: 10,
            bottom: 20
        },
        color: '#334155'
      },
    },
     maintainAspectRatio: false,
  };

  const barChartOptions = {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: {
            ...chartOptions.plugins.title,
            text: '프로젝트별 투입 시간',
        },
      },
  };
  const doughnutChartOptions = {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: {
            ...chartOptions.plugins.title,
            text: '공종별 시간 분포',
        },
      },
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">대시보드</h2>
        <div className="flex items-center gap-2">
            <label htmlFor="projectFilter" className="text-sm font-medium text-gray-700 whitespace-nowrap">프로젝트 선택:</label>
            <div className="relative">
                <select
                    id="projectFilter"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="appearance-none w-48 pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                    <option value="ALL">모든 프로젝트</option>
                    {projectOptions.map(proj => <option key={proj} value={proj}>{proj}</option>)}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KpiCard
          title="참여 프로젝트"
          value={`${totalProjects} 개`}
          icon={<BriefcaseIcon className="w-8 h-8 text-blue-500" />}
        />
        <KpiCard
          title="총 투입 시간"
          value={`${totalHours.toFixed(1)} 시간`}
          icon={<ChartBarIcon className="w-8 h-8 text-indigo-500" />}
        />
        <KpiCard
          title="총 기록 수"
          value={`${totalEntries} 건`}
          icon={<DocumentTextIcon className="w-8 h-8 text-emerald-500" />}
        />
      </div>

      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-slate-50 p-4 rounded-lg shadow-inner">
              <div style={{ position: 'relative', height: '400px' }}>
                <Bar options={barChartOptions} data={projectData} />
              </div>
          </div>
          <div className="lg:col-span-2 bg-slate-50 p-4 rounded-lg shadow-inner flex items-center justify-center">
              <div style={{ position: 'relative', height: '400px', width: '100%' }}>
                <Doughnut options={doughnutChartOptions} data={disciplineData} />
              </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-16 bg-slate-50 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold">데이터가 없습니다</h3>
            <p className="mt-2 text-sm">
                {selectedProject === 'ALL' 
                    ? '업무 시간을 기록하여 분석을 시작하세요.'
                    : `'${selectedProject}' 프로젝트에 대한 기록이 없습니다.`}
            </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
