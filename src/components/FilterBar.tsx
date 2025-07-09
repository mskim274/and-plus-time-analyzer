
import React from 'react';
import { Discipline } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface FilterBarProps {
    selectedFilter: Discipline;
    onFilterChange: (filter: Discipline) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ selectedFilter, onFilterChange }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-lg mb-8 flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-gray-800">기록 목록</h3>
            <div className="flex items-center gap-4">
                <label htmlFor="disciplineFilter" className="text-sm font-medium text-gray-700">공종 필터:</label>
                <div className="relative">
                    <select
                        id="disciplineFilter"
                        value={selectedFilter}
                        onChange={(e) => onFilterChange(e.target.value as Discipline)}
                        className="appearance-none w-48 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    >
                        {Object.values(Discipline).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default FilterBar;