import React, { useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { postDatatoServer } from '../utils/services';
export default function TemplateDelete({ templateDelete, onClose, setSaveTemp, templateDeleteId }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (templateDelete) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [templateDelete, onClose]);

  if (!templateDelete) return null;

  const handleDeletedTemplate = e => {
    e.preventDefault();
    const endpoint = 'templateToDelete';
    const requestBody = {
      templateID: templateDeleteId,
    };

    const props = {
      header: true,
    };

    postDatatoServer({
      end_point: endpoint,
      body: requestBody,
      call_back: handleApiResponse,
      props,
    });
    onClose();
  };

  const handleApiResponse = response => {
    if (response.status) {
      setSaveTemp(true);
      toast.success('Template deleted successfully');
    } else {
      toast.error('Error deleting template');
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60">
      <div
        className="relative w-1/5 overflow-auto rounded-lg border bg-white p-3 text-black shadow-lg"
        ref={modalRef}
      >
        <p className="text-center text-xl">Are you sure you want to delete this template?</p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="mr-2 rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleDeletedTemplate}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
