import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FaTimes } from 'react-icons/fa';
import { API_KEY_HELP } from './help';

export default function APIKeyHelpModal({ isOpen, onClose, service }) {
  const helpData = service ? API_KEY_HELP[service] : null;

  if (!helpData) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                    API Key Format & Usage Guide
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {/* Format Section */}
                  <div>
                    <h4 className="font-medium text-gray-900">Format</h4>
                    <div className="mt-2 bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Pattern:</span>{' '}
                        {typeof helpData.format.pattern === 'string' 
                          ? helpData.format.pattern
                          : Object.entries(helpData.format.pattern).map(([key, value]) => (
                              <div key={key} className="ml-4">
                                <span className="font-medium">{key}:</span> {value}
                              </div>
                            ))
                        }
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Example:</span>{' '}
                        {typeof helpData.format.example === 'string'
                          ? helpData.format.example
                          : Object.entries(helpData.format.example).map(([key, value]) => (
                              <div key={key} className="ml-4">
                                <span className="font-medium">{key}:</span> {value}
                              </div>
                            ))
                        }
                      </p>
                      {helpData.format.length && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Length:</span> {helpData.format.length}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Usage Section */}
                  <div>
                    <h4 className="font-medium text-gray-900">Usage Examples</h4>
                    <div className="mt-2 space-y-3">
                      {Object.entries(helpData.usage).map(([lang, code]) => (
                        <div key={lang} className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">{lang}:</p>
                          <pre className="text-sm text-gray-600 overflow-x-auto">
                            <code>{code}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Validation Rules */}
                  <div>
                    <h4 className="font-medium text-gray-900">Validation Rules</h4>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      {helpData.validation.rules.map((rule, index) => (
                        <li key={index} className="text-sm text-gray-600">{rule}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Security Warnings */}
                  {helpData.security?.warnings && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-900">Security Warnings</h4>
                      <ul className="mt-2 list-disc list-inside space-y-1">
                        {helpData.security.warnings.map((warning, index) => (
                          <li key={index} className="text-sm text-yellow-700">{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 