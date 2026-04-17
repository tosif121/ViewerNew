import React, { useState, useEffect } from 'react';
import { downloadFileServer, getDataFromServer, postDatatoServer } from '../utils/services';
import Modal from './Modal';
import axios from 'axios';
import TemplateSelector from './TemplateSelector';
import moment from 'moment';
import TemplateCreateModal from './TemplateCreateModal';
import toast, { Toaster } from 'react-hot-toast';
import AdminTemplate from './AdminTemplate';

// Import icons as modules or use placeholder
const fileIcon = '/assets/svgs/file.png';
const filesIcon = '/assets/svgs/files.png';

const CustomEditor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [templateModal, setTemplateModal] = useState(false);
  const [saveTemp, setSaveTemp] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateTemplate, setUpdateTemplate] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [headerImage, setHeaderImage] = useState('');
  const [footerImage, setFooterImage] = useState('');
  const [signImage, setSignImage] = useState('');
  const [verified, setVerified] = useState('');
  const [unverified, setUnverified] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [tempAdmin, setTempAdmin] = useState([]);
  const [adminTempModal, setAdminTempModal] = useState(false);
  const [selected, setSelected] = useState('pdf');

  const url = window.location.href;
  const urlParams = new URLSearchParams(url.split('?')[1]);
  const studyInstanceUIDs = urlParams.get('StudyInstanceUIDs');
  const User = urlParams.get('UserName');

  useEffect(() => {
    const handleResponse = (responseData: any) => {
      if (responseData.status === 'success') {
        const dataArray = responseData.response;

        // tableData is the first item
        const patientData = dataArray[0];

        // admin data is either the one containing 'type' or simply the last element in the array
        const adminData =
          dataArray.find((item: any) => item.type) || dataArray[dataArray.length - 1];

        console.log('--- DEBUG: StudyID API Response ---');
        console.log('tableData:', patientData);
        console.log('admin data:', adminData);

        setTableData(patientData);
        setAdmin(adminData);
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

    postDatatoServer({
      end_point: endpoint,
      body: requestBody,
      call_back: handleResponse,
      props,
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
    if (!token) {
      // Redirect to login page
      window.location.href = '/login';
    }
  }, []);

  const escapeXmlChars = (str: string): string => {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const escapeHtmlContent = (str: string): string => {
    if (!str) return '';
    // Only escape ampersands that aren't part of HTML entities
    return str.replace(/&(?![a-zA-Z0-9#]{1,6};)/g, '&amp;');
  };

  const getStudyInfoTableHtml = () => {
    const formattedDate = tableData?.Date
      ? moment(tableData.Date, 'D/M/YYYY, h:mm:ss a').format('DD-MMMM-YYYY')
      : '';

    return `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem; text-align: center; font-size: 12px; color: black; border: 1px solid black;">
        <thead style="border-bottom: 1px solid black; font-weight: 500;">
          <tr>
            <th style="border: 1px solid black; padding: 0.2rem;">Patient ID</th>
            <th style="border: 1px solid black; padding: 0.2rem;">Patient Name</th>
            <th style="border: 1px solid black; padding: 0.2rem;">Date</th>
            <th style="border: 1px solid black; padding: 0.2rem;">${tableData?.study ? 'Study' : tableData?.bodyPart ? 'Body Part' : '-'}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid black; padding: 0.2rem;">${escapeXmlChars(tableData?.patientID || '')}</td>
            <td style="border: 1px solid black; padding: 0.2rem;">${escapeXmlChars(tableData?.name || '')}</td>
            <td style="border: 1px solid black; padding: 0.2rem;">${escapeXmlChars(formattedDate)}</td>
            <td style="border: 1px solid black; padding: 0.2rem;">${escapeXmlChars(tableData?.study ? tableData.study : tableData?.bodyPart ? tableData.bodyPart : '-')}</td>
          </tr>
        </tbody>
        <thead style="border-bottom: 1px solid black; font-weight: 500;">
          <tr>
            <th style="border: 1px solid black; padding: 0.2rem;">Gender</th>
            <th style="border: 1px solid black; padding: 0.2rem;">Modality</th>
            <th style="border: 1px solid black; padding: 0.2rem;">Age</th>
            <th style="border: 1px solid black; padding: 0.2rem;">Ref Doctor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid black; padding: 0.2rem;">${escapeXmlChars(tableData?.PatientSex || '')}</td>
            <td style="border: 1px solid black; padding: 0.2rem;">${escapeXmlChars(tableData?.modality || '')}</td>
            <td style="border: 1px solid black; padding: 0.2rem;">${escapeXmlChars(tableData?.PatientAge || '')}</td>
            <td style="border: 1px solid black; padding: 0.2rem;">${escapeXmlChars(tableData?.ReferringPhysicianName || '')}</td>
          </tr>
        </tbody>
      </table>
    `;
  };

  const convertImageToBase64 = async (imageUrl: string): Promise<string | null> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    const userName = currentUser?.name;

    const fetchImage = async (
      imageType: string,
      setImage: (url: string) => void,
      customName: string | null = null
    ) => {
      try {
        const namePrefix =
          admin?.type === 'Doctor' || admin?.type === 'verifier' || admin?.type === 'admin'
            ? admin?.adminName
            : userName;
        const name = customName ? `${customName}_${imageType}` : `${namePrefix}_${imageType}`;

        const response = await axios.get(`https://app.supravi.ai/node/getfile/${name}.jpg`, {
          responseType: 'blob',
        });
        const blob = new Blob([response.data], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setImage(url);
      } catch (err) {
        console.error(`Error loading ${imageType} image:`, err);
      }
    };

    fetchImage('header', setHeaderImage);
    fetchImage('footer', setFooterImage);
    if (admin?.type === 'verifier' && tableData?.isverifier === true) {
      fetchImage('doctorVerified', setVerified, userName);
      fetchImage('doctorUnverified', setUnverified, userName);
    }
    if (admin?.type === 'Doctor' || admin?.type === 'verifier' || admin?.type === 'admin') {
      if (userName) {
        fetchImage('sign', setSignImage, userName);
      }
    } else {
      if (tableData?.reports) {
        tableData.reports.forEach(report => {
          const reportUserName = report.username;
          if (reportUserName) {
            fetchImage('sign', setSignImage, reportUserName);
          }
        });
      }
    }

    return () => {
      if (headerImage) URL.revokeObjectURL(headerImage);
      if (footerImage) URL.revokeObjectURL(footerImage);
      if (signImage) URL.revokeObjectURL(signImage);
      if (verified) URL.revokeObjectURL(verified);
      if (unverified) URL.revokeObjectURL(unverified);
    };
  }, [admin]);

  const handleGeneratePDF = async (e: React.FormEvent, updatedTemplate: any = null) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const templateToUse = updatedTemplate || selectedTemplate;
      const studyInfoTableHtml = getStudyInfoTableHtml();

      const headerBase64 = headerImage ? await convertImageToBase64(headerImage) : '';
      const footerBase64 = footerImage ? await convertImageToBase64(footerImage) : '';
      const signBase64 = signImage ? await convertImageToBase64(signImage) : '';
      const verifiedBase64 = verified ? await convertImageToBase64(verified) : '';
      const unverifiedBase64 = unverified ? await convertImageToBase64(unverified) : '';

      // Sanitize admin details to remove invalid XML characters
      const sanitizeText = (text: string) => {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;')
          .replace(/\r\n/g, '<br>')
          .replace(/\n/g, '<br>');
      };

      const adminDetails =
        (admin?.type === 'Doctor' || admin?.type === 'verifier' || admin?.type === 'admin') &&
        admin?.doctorDetail
          ? `<p style="font-size: 14px; margin: 0; text-align: left; line-height: 1.5;">${sanitizeText(admin?.doctorDetail)}</p>`
          : '';

      const combinedHtmlContent = `
    <div style="font-family: Arial, sans-serif;">
        ${headerBase64 ? `<img src="${headerBase64}" alt="Header" style="width: 100%; margin-bottom: 20px; object-fit: fill; max-height: 150px;" />` : ''}
        ${studyInfoTableHtml}
        <div>${editorContent || (templateToUse?.content && typeof templateToUse.content === 'string' && templateToUse.content.trim() ? templateToUse.content : '')}</div>
        ${
          adminDetails || signBase64
            ? `<table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
                  <tr>
                    <td style="width: 70%; vertical-align: bottom; padding-right: 20px;">
                      ${adminDetails}
                    </td>
                    ${
                      signBase64
                        ? `<td style="width: 30%; vertical-align: bottom; text-align: right;">
                            <img src="${signBase64}" alt="Signature" style="width: 150px; height: auto; display: block; margin-left: auto;" />
                          </td>`
                        : '<td style="width: 30%;"></td>'
                    }
                  </tr>
                </table>`
            : ''
        }
        ${
          admin?.type === 'verifier' && tableData?.isverifier && verifiedBase64
            ? `<div style="text-align: left; margin: 10px 0;">
                  <img src="${verifiedBase64}" alt="Verified" style="width: 100px;" />
                </div>`
            : (admin?.type !== 'verifier' || !tableData?.isverifier) && unverifiedBase64
              ? `<div style="text-align: left; margin: 10px 0;">
                    <img src="${unverifiedBase64}" alt="Unverified" style="width: 100px;" />
                  </div>`
              : ''
        }
        ${footerBase64 ? `<img src="${footerBase64}" alt="Footer" style="width: 100%; margin: 20px 0; object-fit: fill; max-height: 150px;" />` : ''}
    </div>
  `;

      const response = await axios.post(
        `https://app.supravi.ai/pdfgen/generate-pdf`,
        { htmlContent: combinedHtmlContent },
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const file = new Blob([response.data], { type: 'application/pdf' });
      try {
        await handleUploadImage(file, templateToUse);
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error('Failed to upload generated file');
      }
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDoc = async (e: React.FormEvent, updatedTemplate: any = null) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const templateToUse = updatedTemplate || selectedTemplate;
      const studyInfoTableHtml = getStudyInfoTableHtml();

      const formData = new FormData();

      // Sanitize admin details to remove invalid XML characters
      const sanitizeText = (text: string) => {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;')
          .replace(/\r\n/g, '<br>')
          .replace(/\n/g, '<br>');
      };

      const adminDetails =
        admin?.type === 'Doctor' ||
        admin?.type === 'verifier' ||
        (admin?.type === 'admin' && admin?.doctorDetail)
          ? `<p style="font-size: 14px; margin: 0; text-align: left; line-height: 1.5;">${sanitizeText(admin?.doctorDetail || '')}</p>`
          : '';

      const combinedHtmlContent = `
        <div style="font-family: Arial, sans-serif;">
            ${headerImage ? `<img src="headerImage" alt="Header" style="width: 100%; margin-bottom: 20px; object-fit: fill; max-height: 150px;" />` : ''}
            ${studyInfoTableHtml}
            <div>${editorContent || (templateToUse?.content && templateToUse.content.trim() ? templateToUse.content : '')}</div>
            ${
              adminDetails || signImage
                ? `<div style="display: flex; align-items: flex-end; justify-content: space-between; margin: 20px 0; width: 100%;">
                      <div style="flex: 1; max-width: 70%;">
                        ${adminDetails}
                      </div>
                      ${
                        signImage
                          ? `<div style="flex: 0 0 150px; text-align: right; margin-left: 20px;">
                              <img src="signImage" alt="Signature" style="width: 150px; height: auto; display: block;" />
                            </div>`
                          : ''
                      }
                    </div>`
                : ''
            }
            ${
              admin?.type === 'verifier' && tableData?.isverifier
                ? `<div style="text-align: left; margin: 10px 0;">
                      <img src="verified" alt="Verified" style="width: 100px;" />
                    </div>`
                : `<div style="text-align: left; margin: 10px 0;">
                      <img src="unverified" alt="Unverified" style="width: 100px;" />
                    </div>`
            }
            ${footerImage ? `<img src="footerImage" alt="Footer" style="width: 100%; margin-bottom: 20px; object-fit: fill; max-height: 150px;" />` : ''}
        </div>
      `;

      formData.append('htmlContent', combinedHtmlContent);

      const fetchImageAsBlob = async (url: string): Promise<Blob | null> => {
        if (!url) return null;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${url}`);
        return await response.blob();
      };

      const headerBlob = await fetchImageAsBlob(headerImage);
      if (headerBlob) formData.append('headerImage', headerBlob, 'header.jpg');

      const footerBlob = await fetchImageAsBlob(footerImage);
      if (footerBlob) formData.append('footerImage', footerBlob, 'footer.jpg');

      const signBlob = await fetchImageAsBlob(signImage);
      if (signBlob) formData.append('signImage', signBlob, 'sign.jpg');

      const verifiedBlob = await fetchImageAsBlob(verified);
      if (verifiedBlob) formData.append('verified', verifiedBlob, 'verified.jpg');

      const unverifiedBlob = await fetchImageAsBlob(unverified);
      if (unverifiedBlob) formData.append('unverified', unverifiedBlob, 'unverified.jpg');

      const response = await axios.post(`https://app.supravi.ai/pdfgen/generate-docx`, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const file = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      await handleUploadImage(file, templateToUse);
      toast.success('Document generated successfully');
    } catch (error) {
      console.error('Error generating DOCX:', error);
      toast.error('Failed to generate document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImage = async (file: Blob, templateToUse: any) => {
    const reportName = tableData?.name.replace(/ /g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const fileName = (selected === 'pdf' && `${reportName}.pdf`) || `${reportName}.docx`;

    const formData = new FormData();
    formData.append('file', file, fileName);

    const templateData = {
      Heading: templateToUse.Heading,
      name: templateToUse.Heading,
      content: editorContent || templateToUse.content,
      update:
        admin?.type != 'Doctor' && admin?.type != 'verifier' && admin?.type != 'admin'
          ? true
          : false,
      id:
        admin?.type != 'Doctor' && admin?.type != 'verifier' && admin?.type != 'admin'
          ? (tempAdmin as any)?.id
          : '',
      fileName: fileName,
    };

    Object.entries(templateData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    postDatatoServer({
      end_point: `upload/reportNew/?id=${tableData.id}`,
      body: formData,
      call_back: handleApiResponse,
      props: { header: true, token: token },
    });
  };

  const handleApiResponse = (response: any) => {
    if (response?.status === 'success') {
      toast.success('Report uploaded successfully');
      setIsModalOpen(false);
      setAdminTempModal(false);
      setSelectedTemplate('');
      setEditorContent('');
      setSelected('pdf');
    } else {
      throw new Error(response?.message || 'Upload failed');
    }
  };

  const studyInfoTable = () => {
    const formattedDate = tableData?.Date
      ? moment(tableData.Date, 'D/M/YYYY, h:mm:ss a').format('DD-MMMM-YYYY')
      : '';

    return (
      <table className="mb-2 min-w-full border text-center text-sm font-light text-white">
        <thead className="whitespace- border-b font-medium">
          <tr>
            <th
              scope="col"
              className="border-r"
            >
              Patient ID
            </th>
            <th
              scope="col"
              className="border-r"
            >
              Patient Name
            </th>
            <th
              scope="col"
              className="border-r"
            >
              Date
            </th>
            <th
              scope="col"
              className="border-r"
            >
              {tableData?.study ? 'Study' : tableData?.bodyPart ? 'Body Part' : '-'}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b font-medium">
            <td className="border-r">{tableData?.patientID}</td>
            <td className="border-r">{tableData?.name}</td>
            <td className="border-r">{formattedDate}</td>
            <td className="border-r">
              {tableData?.study ? tableData.study : tableData?.bodyPart ? tableData.bodyPart : '-'}
            </td>
          </tr>
        </tbody>
        <thead className="border-b font-medium">
          <tr>
            <th
              scope="col"
              className="border-r"
            >
              Gender
            </th>
            <th
              scope="col"
              className="border-r"
            >
              Modality
            </th>
            <th
              scope="col"
              className="border-r"
            >
              Age
            </th>
            <th
              scope="col"
              className="border-r"
            >
              Ref Doctor
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b font-medium">
            <td className="border-r">{tableData?.PatientSex}</td>
            <td className="border-r">{tableData?.modality}</td>
            <td className="border-r">{tableData?.PatientAge}</td>
            <td className="border-r">{tableData?.ReferringPhysicianName}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  const handleSaveTemplateClick = () => {
    setTemplateModal(true);
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    const userName = currentUser?.name;

    const fetchImage = async (
      imageType: string,
      setImage: (url: string) => void,
      customName: string | null = null
    ) => {
      try {
        const namePrefix =
          admin?.type === 'Doctor' || admin?.type === 'verifier' || admin?.type === 'admin'
            ? admin?.adminName
            : userName;
        const name = customName ? `${customName}_${imageType}` : `${namePrefix}_${imageType}`;

        const response = await axios.get(`https://app.supravi.ai/node/getfile/${name}.jpg`, {
          responseType: 'blob',
        });
        const url = URL.createObjectURL(new Blob([response.data]));
        setImage(url);
      } catch (err) {
        console.error(`Error loading ${imageType} image:`, err);
      }
    };

    fetchImage('header', setHeaderImage);
    fetchImage('footer', setFooterImage);
    fetchImage('doctorVerified', setVerified);
    fetchImage('doctorUnverified', setUnverified);

    if (admin?.type === 'Doctor' || admin?.type === 'verifier' || admin?.type === 'admin') {
      if (userName) {
        fetchImage('sign', setSignImage, userName);
      }
    } else {
      if (tableData?.reports) {
        tableData.reports.forEach(report => {
          const reportUserName = report.username;
          if (reportUserName) {
            fetchImage('sign', setSignImage, reportUserName);
          }
        });
      }
    }

    return () => {
      if (headerImage) URL.revokeObjectURL(headerImage);
      if (footerImage) URL.revokeObjectURL(footerImage);
      if (signImage) URL.revokeObjectURL(signImage);
      if (verified) URL.revokeObjectURL(verified);
      if (unverified) URL.revokeObjectURL(unverified);
    };
  }, [admin]);

  const downloadFile = async (id: string | number) => {
    try {
      await downloadFileServer({
        end_point: `getReport/${id}`,
        props: `report_${id}`,
      });
      toast.success('Report downloaded successfully.');
    } catch (error) {
      console.log('Error occurred during file download:', error);
    }
  };

  const fetchsTemplate = (id: string | number) => {
    setIsLoading(true);
    const handleResponse = (res: any) => {
      if (res.status === 'success') {
        setTempAdmin(res.response.document);
        if (res.response.document.content) {
          setAdminTempModal(true);
        }
      } else {
        toast.error('Failed to fetch template');
      }
    };

    const params = {
      end_point: `getDoctorUploadedTemps/${id}`,
      params: token,
      call_back: handleResponse,
      props: '',
    };

    getDataFromServer(params)
      .catch(error => {
        console.error('Error fetching template:', error);
        toast.error('Error fetching template');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      {tableData ? studyInfoTable() : <p>Loading...</p>}
      {(admin?.type !== 'Doctor' && admin?.type !== 'verifier' && admin?.type !== 'admin' && (
        <>
          {adminTempModal && (
            <AdminTemplate
              onClose={() => setAdminTempModal(false)}
              templateModal={adminTempModal}
              handleSaveTemplate={selected === 'pdf' ? handleGeneratePDF : handleGenerateDoc}
              editorContentTemp={tempAdmin}
              setEditorContentTemp={setTempAdmin}
              isLoading={isLoading}
              selectedTemplate={selectedTemplate}
              setSelected={setSelected}
            />
          )}
          <div className="flex flex-wrap gap-4">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              tableData?.reports
                ?.filter(report => !report.deleted)
                .map((report: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col items-center"
                  >
                    {(report.source == 'supraviUi' && (
                      <img
                        src={filesIcon}
                        alt="files"
                        width={50}
                        height={50}
                        onClick={() => downloadFile(report.uri)}
                        className="cursor-pointer transition-opacity hover:opacity-80"
                      />
                    )) || (
                      <img
                        src={fileIcon}
                        alt="file"
                        width={50}
                        height={50}
                        onClick={() => fetchsTemplate(report.id)}
                        className="cursor-pointer transition-opacity hover:opacity-80"
                      />
                    )}

                    <span className="mt-1 text-xs">Report {index + 1}</span>
                  </div>
                ))
            )}
          </div>
        </>
      )) || (
        <>
          {templateModal && (
            <TemplateCreateModal
              onClose={() => setTemplateModal(false)}
              templateModal={templateModal}
              setSaveTemp={setSaveTemp}
              isUpdate={isUpdate}
              updateTemplate={updateTemplate}
              initialContent={editorContent}
            />
          )}
          <TemplateSelector
            {...{
              token,
              editorContent,
              setEditorContent,
              setTemplateModal,
              saveTemp,
              setSaveTemp,
              setUpdateTemplate,
              setIsUpdate,
              admin,
              tableData,
              selectedTemplate,
              setSelectedTemplate,
            }}
          />

          <div className="justify-= mt-4 flex gap-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full rounded bg-blue-500 px-4 py-2.5 text-lg text-white hover:bg-blue-600"
            >
              Preview Report
            </button>

            <button
              className={`w-full rounded px-4 py-2.5 text-lg text-white ${
                admin?.type != 'Doctor' && admin?.type != 'verifier' && admin?.type != 'admin'
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={handleSaveTemplateClick}
              disabled={
                admin?.type != 'Doctor' && admin?.type != 'verifier' && admin?.type != 'admin'
              }
            >
              Save Template
            </button>
          </div>
          {isModalOpen && (
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              content={editorContent}
              onGeneratePDF={selected === 'pdf' ? handleGeneratePDF : handleGenerateDoc}
              isLoading={isLoading}
              headerImage={headerImage}
              footerImage={footerImage}
              signImage={signImage}
              setSelected={setSelected}
              selected={selected}
              studyInfoTable={() => (
                <div dangerouslySetInnerHTML={{ __html: getStudyInfoTableHtml() }} />
              )}
              verified={verified}
              unverified={unverified}
              isVerifier={admin?.type === 'verifier' && tableData?.isverifier}
              admin={admin}
            />
          )}
        </>
      )}
    </>
  );
};

export default CustomEditor;
