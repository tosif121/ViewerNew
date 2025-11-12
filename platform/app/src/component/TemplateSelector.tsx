import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { editorConfig } from '../utils/editorConfig';
import TemplateDeleteModal from './TemplateDeleteModal';
import { getDataFromServer } from '../utils/services';

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const UpdateIcon = props => {
  const { template, setIsUpdate, setUpdateTemplate, setTemplateModal } = props;

  const selectTemplateForUpdate = () => {
    setIsUpdate(true);
    setUpdateTemplate(template);
    setTemplateModal(true);
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="20"
      height="20"
      onClick={selectTemplateForUpdate}
    >
      <path
        fill="#1ba27a"
        d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"
      />
    </svg>
  );
};

const DeleteIcon = ({ setTemplateDeleteId, setTemplateDelete, template, setIsOpen }) => {
  const handleDeleteClick = () => {
    setTemplateDelete(true);
    setTemplateDeleteId(template.templateID);
    setIsOpen(false);
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      width="20"
      height="20"
      onClick={handleDeleteClick}
    >
      <path
        fill="#e6191e"
        d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z"
      />
    </svg>
  );
};

const TemplateSelector = props => {
  const {
    admin,
    setTemplateModal,
    token,
    editorContent,
    setEditorContent,
    saveTemp,
    setSaveTemp,
    setIsUpdate,
    setUpdateTemplate,
    selectedTemplate,
    setSelectedTemplate,
    tableData,
  } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [templateDelete, setTemplateDelete] = useState(false);
  const [templateDeleteId, setTemplateDeleteId] = useState(null);
  const [reports, setReports] = useState([]);
  const dropdownRef = useRef(null);
  const editor = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      const content = `
        <div class="text-gray-700">
          <h1 style="text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 20px; text-transform: capitalize;">
            ${selectedTemplate.name}
          </h1>
          ${
            typeof selectedTemplate.content === 'object' && selectedTemplate.content !== null
              ? Object.entries(selectedTemplate.content)
                  .map(
                    ([key, value]) => `
                    <section class="mb-6">
                      <h2 style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">${key}</h2>
                      <p style="margin: 0; line-height: 1.5; font-size: 12px">${value.trim().replace(/\t/g, '')}</p>
                    </section>
                  `
                  )
                  .join('')
              : selectedTemplate.content
          }
        </div>
      `;
      setEditorContent(content);
    }
  }, [selectedTemplate, setEditorContent]);

  const handleSelectTemplate = template => {
    setSelectedTemplate(template);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleEditorChange = newContent => {
    setEditorContent(newContent);
  };

  const filteredTemplates = reports.filter(template =>
    template.name.toLowerCase().includes(searchTerm)
  );

  const fetchsTemplateData = (token, setReports) => {
    const handleResponse = res => {
      if (res.status === 'success') {
        setReports(res.response);
      }
    };

    const handleError = error => {
      console.error(error);
    };
    const xrayModalities = ['CR', 'DX', 'MG', 'XA'];
    const modalityType = xrayModalities.includes(tableData?.modality) ? 'Xray' : 'CT';

    const params = {
      end_point: `templates/${modalityType}`,
      params: { token: token },
      call_back: handleResponse,
      props: '',
    };

    getDataFromServer(params)
      .catch(handleError)
      .finally(() => console.log('fetchsTemplateData function called'));
  };

  useEffect(() => {
    if (token || saveTemp) {
      fetchsTemplateData(token, setReports);
      setSelectedTemplate('');
      setEditorContent('');
    }
  }, [token, saveTemp]);

  const createTemplateModal = () => {
    setIsUpdate(false);
    setTemplateModal(true);
    setEditorContent('');
  };

  return (
    <>
      {templateDelete && (
        <TemplateDeleteModal
          onClose={() => setTemplateDelete(false)}
          templateDelete={templateDelete}
          setSaveTemp={setSaveTemp}
          templateDeleteId={templateDeleteId}
        />
      )}

      <div
        className="relative"
        ref={dropdownRef}
      >
        <div className="flex gap-x-2">
          <div className="w-full">
            <button
              onClick={() => setIsOpen(!isOpen)}
              disabled={admin?.type != 'Doctor' && admin?.type != 'verifier'}
              className={`w-full rounded-md border p-2 text-left capitalize focus:outline-none focus:ring-2 ${
                admin?.type != 'Doctor' && admin?.type != 'verifier'
                  ? 'cursor-not-allowed border-gray-400 bg-gray-300 text-gray-500'
                  : 'border-white bg-[#1a1a1a] focus:ring-blue-500'
              }`}
            >
              {selectedTemplate ? selectedTemplate.name : 'Select a Template'}
            </button>
          </div>
          <div>
            <button
              className={`w-full rounded p-2 text-lg ${
                admin?.type != 'Doctor' && admin?.type != 'verifier'
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={admin?.type != 'Doctor' && admin?.type != 'verifier'}
              onClick={createTemplateModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line
                  x1="12"
                  y1="5"
                  x2="12"
                  y2="19"
                ></line>
                <line
                  x1="5"
                  y1="12"
                  x2="19"
                  y2="12"
                ></line>
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-white bg-[#1a1a1a] shadow-lg">
            <div className="border-b border-white p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Templates..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full rounded-md border border-white bg-[#333] p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 transform">
                  <SearchIcon />
                </span>
              </div>
            </div>
            <ul className="max-h-60 overflow-auto">
              {filteredTemplates.map(template => {
                const hasKeyValuePairs = template.content && typeof template.content === 'object';

                return (
                  <li
                    key={template.id}
                    className="group relative cursor-pointer p-1.5"
                  >
                    <div
                      onClick={() => handleSelectTemplate(template)}
                      className="capitalize"
                    >
                      {template.name}
                    </div>

                    {!hasKeyValuePairs && (
                      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 transform space-x-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <UpdateIcon
                          {...{ template, setUpdateTemplate, setTemplateModal, setIsUpdate }}
                        />
                        <DeleteIcon
                          {...{
                            setTemplateDeleteId,
                            setTemplateDelete,
                            template,
                            setIsOpen,
                            setTemplateModal,
                          }}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-2">
        <JoditEditor
          ref={editor}
          value={editorContent}
          config={editorConfig}
          onBlur={handleEditorChange}
          className={`text-lg text-black`}
        />
      </div>
    </>
  );
};

export default TemplateSelector;
