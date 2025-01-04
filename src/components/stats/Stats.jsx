'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion' // Импортируем motion для анимации
import CardDataStats from '@/src/components/CardDataStats'; // Импортируем компонент CardDataStats
import { useSession } from 'next-auth/react';
import ManagerSelector from '@/src/components/ManagerSelect/ManagerSelect';

const Stats = () => {
  const [managerStats, setManagerStats] = useState(null)
  const [selectedManagerId, setSelectedManagerId] = useState(null)
  const [stats, setStats] = useState(null)

  const session = useSession();

  useEffect(() => {
    // Получаем общую статистику с использованием fetch
    if (session.data.managerRole === 'admin') {
      fetch('/api/admin/stats') // Важно: указываем правильный путь для вашего API
        .then((response) => {
          if (!response.ok) {
            throw new Error('Ошибка при получении статистики')
          }
          return response.json()
        })
        .then((data) => setStats(data)) // Сохраняем данные в состояние
        .catch((error) => console.error(error))
    }
  }, [])

  useEffect(() => {
    // Получаем статистику для выбранного менеджера или текущего менеджера
    if (session.data.managerRole === 'admin' && selectedManagerId) {
      // Для админа: получаем статистику для выбранного менеджера
      fetch(`/api/manager/${selectedManagerId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Ошибка при получении статистики менеджера')
          }
          return response.json()
        })
        .then((data) => {
          setManagerStats(data) // Сохраняем статистику для выбранного менеджера
        })
        .catch((error) => console.error(error))
    }

    if (session.data.managerRole === 'manager') {
      // Для менеджера: автоматически загружаем статистику для текущего менеджера
      fetch(`/api/manager/${session.data.managerId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Ошибка при получении статистики для текущего менеджера')
          }
          return response.json()
        })
        .then((data) => {
          setManagerStats(data) // Сохраняем статистику для текущего менеджера
        })
        .catch((error) => console.error(error))
    }
  }, [selectedManagerId, session.data.managerRole, session.data.managerId])

  const handleManagerSelection = (managerId) => {
    setSelectedManagerId(managerId) // Обновляем выбранного менеджера
  }

  const getDataForCard = (managerStatsField, totalStatsField) => {
    return managerStats
      ? managerStats.manager[managerStatsField]?.length || 0
      : stats?.[totalStatsField] || 0
  }

  const useCountUp = (target) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const end = target;
      const duration = 2; // Время анимации в секундах
      const stepTime = 50; // Интервал обновления в миллисекундах
      const stepCount = (end - start) / (duration * 1000 / stepTime);

      const interval = setInterval(() => {
        start += stepCount;
        if (start >= end) {
          start = end;
          clearInterval(interval);
        }
        setCount(Math.floor(start));
      }, stepTime);

      return () => clearInterval(interval);
    }, [target]);

    return count;
  }

  if (!session) {
    return <div>Загрузка...</div>; // Показываем загрузку, если сессия ещё не получена
  }

  if (session.data.managerRole !== 'admin' && session.data.managerRole !== 'manager') {
    return <div>У вас нет доступа к этим данным.</div>; // Для пользователей, не являющихся админами или менеджерами
  }

  return (
    <div>
      <h1>Админ Панель</h1>

      {/* Если роль admin, показываем селектор для выбора менеджеров */}
      {session.data.managerRole === 'admin' && (
        <ManagerSelector 
          managers={stats?.managers || []} 
          onManagerSelect={handleManagerSelection} 
        />
      )}

      <div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <CardDataStats title="Всего кандидатов" >
            <span>👥</span>
            <motion.div
              key={getDataForCard('candidates', 'totalCandidates')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-md font-semibold">{useCountUp(getDataForCard('candidates', 'totalCandidates'))}</span>
            </motion.div>
          </CardDataStats>

          <CardDataStats title="Всего партнёров">
            <span>📦</span>
            <motion.div
              key={getDataForCard('partners', 'totalPartners')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className='text-sm font-semibold'>{useCountUp(getDataForCard('partners', 'totalPartners'))}</span>
            </motion.div>
          </CardDataStats>

          <CardDataStats title="Всего пользователей">
            <span>🧑‍💻</span>
            <motion.div
              key={getDataForCard('tasks', 'totalUsers')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <span className='text-sm font-semibold'>{useCountUp(getDataForCard('tasks', 'totalUsers'))}</span>
          </CardDataStats>
        </div>
      </div>
    </div>
  )
}

export default Stats
