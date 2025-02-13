import { useState, useEffect } from 'react';
import { createHandleChange } from '@/src/utils/handlePartnerChange'; 
import { Document } from '@/src/types/candidate';

const usePartnerData = (partner: any) => {
  const [selectName, setSelectName] = useState(partner?.name || '');
  const [selectPhone, setSelectPhone] = useState(partner?.phone || '');
  const [selectViber, setSelectViber] = useState(partner?.viber || '');
  const [selectTelegram, setSelectTelegram] = useState(partner?.telegram || '');
  const [selectWhatsapp, setSelectWhatsapp] = useState(partner?.whatsapp || '');
  const [selectEmail, setSelectEmail] = useState(partner?.email || '');
  const [selectCompanyName, setSelectCompanyName] = useState(partner?.companyName || '');
  const [selectNumberDE, setSelectNumberDE] = useState(partner?.numberDE || '');
  const [selectLocation, setSelectLocation] = useState(partner?.location || '');
  const [selectSite, setSelectSite] = useState(partner?.site || '');
  const [contract, setContract] = useState<{ [key: string]: string }>({
    typeC: partner?.contract?.typeC || '',
    sum: partner?.contract?.sum || '',
  });
  const [documents, setDocuments] = useState<Document[]>(partner?.documents || []);
  
  const handleChangeName = createHandleChange(setSelectName);
  const handleChangePhone = createHandleChange(setSelectPhone);
  const handleChangeViber = createHandleChange(setSelectViber);
  const handleChangeTelegram = createHandleChange(setSelectTelegram);
  const handleChangeWhatsapp = createHandleChange(setSelectWhatsapp);
  const handleChangeEmail = createHandleChange(setSelectEmail);
  const handleChangeCompanyName = createHandleChange(setSelectCompanyName);
  const handleChangeNumberDE = createHandleChange(setSelectNumberDE);
  const handleChangeLocation = createHandleChange(setSelectLocation);
  const handleChangeSite = createHandleChange(setSelectSite);
  const handleChangeContract = createHandleChange(setContract);
  const handleChangeDocuments = createHandleChange(setDocuments);

  useEffect(() => {
    if (partner) {
      setSelectName(partner.name || '');
      setSelectPhone(partner.phone || '');
      setSelectViber(partner.viber || '');
      setSelectTelegram(partner.telegram || '');
      setSelectWhatsapp(partner.whatsapp || '');
      setSelectEmail(partner.email || '');
      setSelectCompanyName(partner.companyName || '');
      setSelectNumberDE(partner.numberDE || '');
      setSelectLocation(partner.location || '');
      setSelectSite(partner.site || '');
      setDocuments(partner.documents || []);
      setContract({ 
        typeC: partner.contract?.typeC || '',
        sum: partner.contract?.sum || '',
        salaryWorker: partner.contract?.salaryWorker || '',
      });    }
  }, [partner]);

  return {
    selectName,
    selectPhone,
    selectViber,
    selectTelegram,
    selectWhatsapp,
    selectEmail,
    selectCompanyName,
    selectNumberDE,
    selectLocation,
    selectSite,
    contract,
    documents,
    handleChangeName,
    handleChangePhone,
    handleChangeViber,
    handleChangeTelegram,
    handleChangeWhatsapp,
    handleChangeEmail,
    handleChangeCompanyName,
    handleChangeNumberDE,
    handleChangeLocation,
    handleChangeSite,
    handleChangeContract,
    handleChangeDocuments,

  };
};

export default usePartnerData;
