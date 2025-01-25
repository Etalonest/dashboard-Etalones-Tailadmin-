import { useState, useEffect } from 'react';
import { createHandleChange } from '@/src/utils/handlePartnerChange'; // Импортируем вспомогательную функцию для обработки изменений
import { Candidate } from '../types/candidate';
import { Document } from '../types/candidate';
const useCandidateData = (candidate: Candidate) => {
  const [name, setName] = useState(candidate?.name || '');
  const [phone, setPhone] = useState(candidate?.phone || '');
  const [additionalPhones, setAdditionalPhones] = useState(candidate?.additionalPhones || []);
  const [ageNum, setAgeNum] = useState(candidate?.ageNum || '');
  const [status, setStatus] = useState(candidate?.status || '');
  const [partners, setPartners] = useState(candidate?.partners || '');
  const [citizenship, setCitizenship] = useState(candidate?.citizenship || '');
  const [leaving, setLeaving] = useState(candidate?.leaving || '');
  const [dateArrival, setDateArrival] = useState(candidate?.dateArrival || '');
  const [drivePermis, setDrivePermis] = useState(candidate?.drivePermis || []);
  const [cardNumber, setCardNumber] = useState(candidate?.cardNumber || '');
  const [workHours, setWorkHours] = useState(candidate?.workHours || '');
  const [locations, setLocations] = useState(candidate?.locations || '');
  const [professions, setProfessions] = useState(candidate?.professions || []);
  const [documents, setDocuments] = useState<Document[]>(candidate?.documents || []);
  const [langue, setLangue] = useState(candidate?.langue || []);
  const [manager, setManager] = useState(candidate?.manager || '');
  const [comment, setComment] = useState(candidate?.comment || []);

  // Генерация обработчиков для каждого поля
  const handleChangeName = createHandleChange(setName);
  const handleChangePhone = createHandleChange(setPhone);
  const handleChangeAdditionalPhones = createHandleChange(setAdditionalPhones);
  const handleChangeAge = createHandleChange(setAgeNum);
  const handleChangeStatus = createHandleChange(setStatus);
  const handleChangePartners = createHandleChange(setPartners);
  const handleChangeCitizenship = createHandleChange(setCitizenship);
  const handleChangeLeaving = createHandleChange(setLeaving);
  const handleChangeDateArrival = createHandleChange(setDateArrival);
  const handleChangeDrivePermis = createHandleChange(setDrivePermis);
  const handleChangeCardNumber = createHandleChange(setCardNumber);
  const handleChangeWorkHours = createHandleChange(setWorkHours);
  const handleChangeLocations = createHandleChange(setLocations);
  const handleChangeProfessions = createHandleChange(setProfessions);
  const handleChangeDocuments = createHandleChange(setDocuments);
  const handleChangeLangue = createHandleChange(setLangue);
  const handleChangeManager = createHandleChange(setManager);
  const handleChangeComment = createHandleChange(setComment);

  useEffect(() => {
    if (candidate) {
      setName(candidate.name || '');
      setPhone(candidate.phone || '');
      setAdditionalPhones(candidate.additionalPhones || []);
      setAgeNum(candidate.ageNum || '');
      setStatus(candidate.status || '');
      setPartners(candidate.partners || '');
      setCitizenship(candidate.citizenship || '');
      setLeaving(candidate.leaving || '');
      setDateArrival(candidate.dateArrival || '');
      setDrivePermis(candidate.drivePermis || []);
      setCardNumber(candidate.cardNumber || '');
      setWorkHours(candidate.workHours || '');
      setLocations(candidate.locations || '');
      setProfessions(candidate.professions || []);
      setDocuments(candidate.documents || []);
      setLangue(candidate.langue || []);
      setManager(candidate.manager || '');
      setComment(candidate.comment || []);
    }
  }, [candidate]);

  return {
    name,
    phone,
    additionalPhones,
    ageNum,
    status,
    partners,
    citizenship,
    leaving,
    dateArrival,
    drivePermis,
    cardNumber,
    workHours,
    locations,
    professions,
    documents,
    langue,
    manager,
    comment,
    handleChangeName,
    handleChangePhone,
    handleChangeAdditionalPhones,
    handleChangeAge,
    handleChangeStatus,
    handleChangePartners,
    handleChangeCitizenship,
    handleChangeLeaving,
    handleChangeDateArrival,
    handleChangeDrivePermis,
    handleChangeCardNumber,
    handleChangeWorkHours,
    handleChangeLocations,
    handleChangeProfessions,
    handleChangeDocuments,
    handleChangeLangue,
    handleChangeManager,
    handleChangeComment,
  };
};

export default useCandidateData;
