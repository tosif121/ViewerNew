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

    const endpoint = 'StudyID';
    const requestBody = {
      StudyInstanceUID: studyInstanceUIDs,
      username: User,
    };

    const props = {
      header: true,
    };

    const postDataProps: PostDataProps = {
      end_point: endpoint,
      body: requestBody,
      call_back: handleResponse,
      props,
    };

    postDatatoServer(postDataProps);
  }, []);

  const studyInfoTable = () => {
    const renderInfo = (value: string | undefined, label?: string): React.ReactNode => {
      if (value && value !== 'NA') {
        return <div>{label ? `${label}: ${value}` : value}</div>;
      }
      return null;
    };

    return (
      <div className="mb-2 text-white">
        <div className="self-start text-[13px] font-bold">
          <div className="flex items-center gap-3">{renderInfo(tableData?.patientID)}</div>
          <div className="flex items-center gap-3">
            {renderInfo(tableData?.name)}
            {renderInfo(tableData?.PatientAge)}
            {renderInfo(tableData?.PatientSex)}
          </div>
          {renderInfo(
            tableData?.study ? tableData.study : tableData?.bodyPart ? tableData.bodyPart : '-'
          )}
        </div>
      </div>
    );
  };

  return <>{tableData ? studyInfoTable() : <p>Loading...</p>}</>;
};

export default PatientInformation;
