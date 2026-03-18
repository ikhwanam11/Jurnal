import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

import { Header } from './components/Header';
import { ViewToggle } from './components/ViewToggle';
import { Calendar } from './components/Calendar';
import { WeeklySchedule } from './components/WeeklySchedule';
import { Modal } from './components/Modal';
import { DayModalContent } from './components/DayModalContent';
import { LessonModalContent } from './components/LessonModalContent';
import { HolidayList } from './components/HolidayList';

import { fetchSchedule, fetchHolidays, fetchSpecialPeriods, fetchLessonData } from './services/dataService';
import { LessonData, ScheduleData, HolidaysData, SpecialPeriod } from './types';
import { CONFIG } from './utils/config';
import './index.css';

export default function App() {
  // State for calendar navigation
  const [currentDate, setCurrentDate] = useState(CONFIG.DEFAULT_MONTH);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // State for view mode
  const [viewMode, setViewMode] = useState<'calendar' | 'weekly'>('calendar');

  // State for modals
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // State for data
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [holidays, setHolidays] = useState<HolidaysData | null>(null);
  const [specialPeriods, setSpecialPeriods] = useState<SpecialPeriod[] | null>(null);

  // State for lesson data
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [scheduleData, holidaysData, specialPeriodsData] = await Promise.all([
          fetchSchedule(),
          fetchHolidays(),
          fetchSpecialPeriods(),
        ]);
        
        setSchedule(scheduleData);
        setHolidays(holidaysData);
        setSpecialPeriods(specialPeriodsData);
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };

    loadData();
  }, []);

  // Handlers
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDayModalOpen(true);
  };

  const handleSubjectClick = async (subject: string) => {
    if (!selectedDate) return;
    
    setSelectedSubject(subject);
    setIsLessonModalOpen(true);
    
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLessonData(subject, selectedDate);
      setLessonData(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data pembelajaran');
      setLessonData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
  };

  const handleViewModeChange = (mode: 'calendar' | 'weekly') => {
    setViewMode(mode);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 -mt-10 relative z-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-4 md:p-8">
          <ViewToggle
            viewMode={viewMode}
            currentDate={currentDate}
            onViewModeChange={handleViewModeChange}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
          />

          <AnimatePresence mode="wait">
            {viewMode === 'calendar' ? (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Calendar
                  currentDate={currentDate}
                  selectedDate={selectedDate}
                  schedule={schedule}
                  holidays={holidays}
                  specialPeriods={specialPeriods}
                  onDateClick={handleDateClick}
                />
                <HolidayList
                  currentDate={currentDate}
                  holidays={holidays}
                  specialPeriods={specialPeriods}
                />
              </motion.div>
            ) : (
              <motion.div
                key="weekly"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <WeeklySchedule
                  schedule={schedule}
                  onSubjectClick={(subject) => {
                    if (selectedDate) {
                      handleSubjectClick(subject);
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        title={selectedDate ? format(selectedDate, 'EEEE, d MMMM yyyy', { locale: id }) : 'Jadwal'}
      >
        <DayModalContent
          selectedDate={selectedDate || new Date()}
          schedule={schedule}
          holidays={holidays}
          specialPeriods={specialPeriods}
          onSubjectClick={handleSubjectClick}
        />
      </Modal>

      <Modal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        title={`Rincian: ${selectedSubject || ''}`}
      >
        <LessonModalContent
          loading={loading}
          error={error}
          lessonData={lessonData}
        />
      </Modal>
    </div>
  );
}
