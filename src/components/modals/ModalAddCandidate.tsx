'use client'
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
// import Axios from "axios";
import { useSession } from 'next-auth/react';
import SelectGroupTwo from '../SelectGroup/SelectGroupTwo';
import MultiSelect from '../FormElements/MultiSelect';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import CheckboxFive from '../Checkboxes/CheckboxFive';
import CheckboxFour from '../Checkboxes/CheckboxFour';
import CheckboxOne from '../Checkboxes/CheckboxOne';
import CheckboxThree from '../Checkboxes/CheckboxThree';
import CheckboxTwo from '../Checkboxes/CheckboxTwo';
import DatePickerOne from '../FormElements/DatePicker/DatePickerOne';
import DatePickerTwo from '../FormElements/DatePicker/DatePickerTwo';
import SwitcherFour from '../Switchers/SwitcherFour';
import SwitcherOne from '../Switchers/SwitcherOne';
import SwitcherThree from '../Switchers/SwitcherThree';
import SwitcherTwo from '../Switchers/SwitcherTwo';
import DefaultInput from '../inputs/DefaultInput/DefaultInput';



const ModalAddCandidate = () => {
    

    return (
      <>
      <h1>Добавить кандидата</h1>
      <div className='flex flex-wrap gap-3'> …
      <DefaultInput />
      <DefaultInput />
      <DefaultInput />
<MultiSelect id="multiSelect" />
      <DefaultInput />
      <DefaultInput />
      <DefaultInput />
      <DefaultInput />
      <DefaultInput />
      <DefaultInput />
<MultiSelect id="multiSelect" />
      <DefaultInput />
      <DefaultInput />
      <DefaultInput />

      </div>
    </>
      
    );
};

export default ModalAddCandidate;