import React, { useState, useEffect } from 'react';
import { postDatatoServer } from '../utils/services';

interface TableData {
  patientID?: string;
  name?: string;
  PatientSex?: string;
  PatientAge?: string;
  study?: string;
  bodyPart?: string;
}

interface PostDataProps {
  end_point: string;
  body: {
    StudyInstanceUID: string | null;
    username: string | null;
  };
  call_back: (responseData: any) => void;
  props: {
    header: boolean;
  };
}

const PatientInformation: React.FC = () => {
  const [tableData, setTableData] = useState<TableData | null>(null);

  useEffect(() => {
    const url = window.location.href;
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const studyInstanceUIDs = urlParams.get('StudyInstanceUIDs');
    const User = urlParams.get('UserName');

    const handleResponse = (responseData: any) => {
      if (responseData.status === 'success') {
        setTableData(responseData.response[0]);
      } else {
        console.error('Error:', responseData.error);
      }
    };

    const postDataProps: PostDataProps = {
      end_point: 'StudyID',
      body: { StudyInstanceUID: studyInstanceUIDs, username: User },
      call_back: handleResponse,
      props: { header: true },
    };

    postDatatoServer(postDataProps);
  }, []);

  const renderInfo = (value?: string, label?: string) => {
    if (value && value !== 'NA') {
      return (
        <div className="text-sm font-medium md:text-[13px]">
          {label ? `${label}: ${value}` : value}
        </div>
      );
    }
    return null;
  };

  if (!tableData) return <p className="text-sm text-white md:text-[13px]">Loading...</p>;

  return (
    <div className="inline-block rounded-lg bg-black/40 p-2 text-xs font-bold text-white shadow-lg backdrop-blur-sm md:max-w-xs md:p-3 md:text-[13px]">
      <div className="flex flex-col gap-1 text-center md:text-left">
        {renderInfo(tableData?.patientID, 'ID')}
        <div className="flex flex-wrap justify-center gap-2 md:justify-start">
          {renderInfo(tableData?.name)}
          {renderInfo(tableData?.PatientAge)}
          {renderInfo(tableData?.PatientSex)}
        </div>
        {renderInfo(tableData?.study || tableData?.bodyPart || '-', 'Study')}
      </div>
    </div>
  );
};

export default PatientInformation;
