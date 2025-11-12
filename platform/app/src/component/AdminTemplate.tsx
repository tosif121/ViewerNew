import React, { useEffect, useRef, useState } from 'react';
import JoditEditor from 'jodit-react';
import { editorConfig } from '../utils/editorConfig';
import toast from 'react-hot-toast';
import { downloadFileServer } from '../utils/services';

function AdminTemplate({
  onClose,
  templateModal,
  handleSaveTemplate,
  editorContentTemp,
  setEditorContentTemp,
  isLoading,
  selectedTemplate,
  setSelected,
}) {
  const modalRef = useRef(null);
  const editorRef = useRef(null);
  const [heading, setHeading] = useState(editorContentTemp?.Heading || '');
  const [content, setContent] = useState(editorContentTemp?.content || '');

  function checkFileFormat(uri) {
    const lowerUri = uri?.toLowerCase();

    if (lowerUri?.endsWith('.pdf')) {
      return 'pdf';
    } else if (lowerUri?.endsWith('.docx')) {
      return 'docx';
    } else {
      return 'unsupported';
    }
  }

  useEffect(() => {
    setHeading(editorContentTemp?.Heading || '');
    setContent(editorContentTemp?.content || '');

    if (editorContentTemp?.uri) {
      const format = checkFileFormat(editorContentTemp.uri);
      setSelected(format);
    }
  }, [editorContentTemp]);

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

  const handleEditorChange = newContent => {
    setContent(newContent);
    setEditorContentTemp({
      ...editorContentTemp,
      content: newContent,
    });
  };

  const handleHeadingChange = e => {
    const newHeading = e.target.value;
    setHeading(newHeading);
    setEditorContentTemp({
      ...editorContentTemp,
      Heading: newHeading,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const updatedTemplate = {
      ...selectedTemplate,
      Heading: heading,
      content: content,
    };
    handleSaveTemplate(e, updatedTemplate);
  };

  if (!templateModal) return null;

  const downloadFile = async id => {
    try {
      const response = await downloadFileServer({
        end_point: `getReport/${id}`,
        props: `report_${id}`,
      });
      onClose();
      toast.success('Report downloaded successfully.');
    } catch (error) {
      console.log('Error occurred during file download:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60">
      <div
        className="relative w-[210mm] overflow-auto rounded-lg border bg-white p-3 text-black shadow-lg"
        ref={modalRef}
      >
        <form onSubmit={handleSubmit}>
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
              onChange={handleHeadingChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none"
              required
            />
          </div>

          <div className="mt-2">
            <JoditEditor
              ref={editorRef}
              value={content}
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
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => downloadFile(editorContentTemp?.uri)}
              className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Download
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminTemplate;
