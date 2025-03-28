'use client'
import React, { createContext, useContext, useState, useEffect } from "react";
import { Profession } from "../types/profession"; // Убедитесь, что у вас есть тип Profession

// Типы данных для контекста
interface ProfessionContextType {
  professions: Profession[]; // Массив профессий
  loading: boolean; // Состояние загрузки
  error: string | null; // Ошибка при загрузке данных
  fetchProfessions: () => void; // Функция для получения профессий
}

// Контекст с пустыми значениями по умолчанию
const ProfessionContext = createContext<ProfessionContextType | undefined>(undefined);

// Провайдер контекста
export const ProfessionProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для получения профессий
  const fetchProfessions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/profession");
      if (!response.ok) {
        throw new Error("Ошибка при загрузке профессий");
      }
      const data = await response.json();
      setProfessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessions(); // Запрашиваем профессии при монтировании компонента
  }, []);

  return (
    <ProfessionContext.Provider
      value={{ professions, loading, error, fetchProfessions }}
    >
      {children}
    </ProfessionContext.Provider>
  );
};

// Хук для использования контекста
export const useProfessionContext = (): ProfessionContextType => {
  const context = useContext(ProfessionContext);
  if (!context) {
    throw new Error("useProfessionContext должен использоваться внутри ProfessionProvider");
  }
  return context;
};
