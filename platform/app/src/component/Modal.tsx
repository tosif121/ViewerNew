import React, { useRef, useEffect } from 'react';

const Modal = props => {
  const {
    isOpen,
    onClose,
    content,
    onGeneratePDF,
    isLoading,
    studyInfoTable,
    footerImage,
    headerImage,
    signImage,
    setSelected,
    selected,
    verified,
    unverified,
    isVerifier,
    admin,
  } = props;
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const adminDetails =
    (admin?.type === 'Doctor' || admin?.type === 'verifier') && admin?.doctorDetail ? (
      <div className="my-3 w-1/2 text-left text-sm text-gray-800">
        <p>{admin?.doctorDetail}</p>
      </div>
    ) : null;
  return (
    <div className="fixed inset-0 z-[51] flex items-center justify-center bg-black/60">
      <div
        className="relative z-[51] flex h-[85vh] w-[210mm] flex-col overflow-auto rounded-lg border bg-white p-3 shadow-lg"
        ref={modalRef}
      >
        <div className="flex items-center justify-between text-black">
          <h2 className="text-lg font-bold">Preview Your Report</h2>
          <div className="flex space-x-3">
            <label className="flex cursor-pointer items-center space-x-2 font-medium">
              <input
                type="radio"
                name="fileType"
                value="pdf"
                checked={selected === 'pdf'}
                onChange={e => setSelected(e.target.value)}
                className="hidden"
              />
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  selected === 'pdf' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                }`}
              >
                {selected === 'pdf' && <div className="h-2.5 w-2.5 rounded-full bg-white"></div>}
              </div>
              <span>PDF</span>
            </label>

            <label className="flex cursor-pointer items-center space-x-2 font-medium">
              <input
                type="radio"
                name="fileType"
                value="doc"
                checked={selected === 'doc'}
                onChange={e => setSelected(e.target.value)}
                className="hidden"
              />
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  selected === 'doc' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                }`}
              >
                {selected === 'doc' && <div className="h-2.5 w-2.5 rounded-full bg-white"></div>}
              </div>
              <span>DOC</span>
            </label>
          </div>
        </div>

        {(headerImage && (
          <img
            src={headerImage}
            alt="Header"
            className="my-3 max-h-48 w-full object-fill"
          />
        )) ||
          ''}

        {studyInfoTable()}
        <div className="font-arial text-xl text-gray-800">
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            className="preview-container h-96 overflow-auto"
          ></div>

          {(signImage && (
            <div className="flex justify-end">
              <img
                src={signImage}
                alt="signImage"
                className="my-3"
                width={150}
                height={150}
              />
            </div>
          )) ||
            ''}

          {adminDetails}

          {(isVerifier && verified && (
            <div className="flex justify-start">
              <img
                src={verified}
                alt="verified"
                className="my-3"
                width={100}
                height={100}
              />
            </div>
          )) ||
            (!isVerifier && unverified && (
              <div className="flex justify-start">
                <img
                  src={unverified}
                  alt="unverified"
                  className="my-3"
                  width={100}
                  height={100}
                />
              </div>
            ))}

          {(footerImage && (
            <img
              src={footerImage}
              alt="footerImage"
              className="my-3 max-h-48 w-full object-fill"
            />
          )) ||
            ''}
        </div>
        <div className="mt-auto flex gap-x-4">
          <button
            onClick={onGeneratePDF}
            disabled={isLoading}
            className={`w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {isLoading ? 'Uploading...' : 'Upload Report'}
          </button>
          <button
            onClick={onClose}
            className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
