import JoditEditor from 'jodit-react';
import React, { useEffect, useRef, useState } from 'react';
import { editorConfig } from '../utils/editorConfig';
import toast from 'react-hot-toast';
import { postDatatoServer } from '../utils/services';

function TemplateCreateModal(props) {
  const { onClose, templateModal, setSaveTemp, isUpdate, updateTemplate, initialContent } = props;
  const modalRef = useRef(null);
  const editorRef = useRef(null);
  const [editorContent, setEditorContent] = useState(
    initialContent || updateTemplate?.content || ''
  );
  const [heading, setHeading] = useState(updateTemplate?.Heading || '');

  useEffect(() => {
    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (templateModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [templateModal, onClose]);

  if (!templateModal) return null;

  const handleEditorChange = newContent => {
    setEditorContent(newContent);
  };

  const handleSaveTemplate = e => {
    e.preventDefault();
    const endpoint = 'addOrUpdateTemplate';
    const requestBody = {
      templateID: updateTemplate?.templateID || '',
      Heading: heading,
      name: heading,
      content: editorContent,
      update: isUpdate,
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
      toast.success(
        isUpdate ? 'Template updated successfully' : 'New template created successfully'
      );
    } else {
      toast.error('Error creating/updating template');
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60">
      <div
        className="relative w-[210mm] overflow-auto rounded-lg border bg-white p-3 text-black shadow-lg"
        ref={modalRef}
      >
        <form onSubmit={handleSaveTemplate}>
          <div className="mb-4">
            <label
              htmlFor="heading"
              className="block text-sm font-medium text-gray-700"
            >
              Heading
            </label>
            <input
              type="text"
              id="heading"
              value={heading}
              onChange={e => setHeading(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none"
              required
            />
          </div>

          <div className="mt-2">
            <JoditEditor
              ref={editorRef}
              value={editorContent}
              config={editorConfig}
              onBlur={handleEditorChange}
              className="text-lg text-black"
            />
          </div>

          <div className="mt-4 flex justify-end gap-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TemplateCreateModal;
