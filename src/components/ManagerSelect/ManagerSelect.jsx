'use client'
import { useSession } from '@/src/context/SessionContext';
import React from 'react'



const ManagerSelector = ({managers, onManagerSelect}) => {
    const session = useSession();
    if (!session  || session.data.managerRole !== 'admin') {
        return <div>У вас нет доступа к этим данным.</div>;
      }
  return (
    <div>
      <select onChange={(e) => onManagerSelect(e.target.value)} defaultValue="">
        <option value="">Выберите менеджера</option>
        {managers.map((manager) => (
          <option key={manager.id} value={manager.id}>
            {manager.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ManagerSelector
