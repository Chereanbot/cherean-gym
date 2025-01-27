'use client'
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, Input, Button, Avatar, message, Upload, Modal, Tooltip } from 'antd';
import { 
  SendOutlined, 
  PaperClipOutlined, 
  CameraOutlined, 
  AudioOutlined,
  SearchOutlined,
  LoadingOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileOutlined
} from '@ant-design/icons';

// Create a simple audio recorder component
const SimpleAudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      message.error('Failed to access microphone');
      console.error('Microphone error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Tooltip title={isRecording ? 'Stop recording' : 'Record voice'}>
      <Button
        icon={<AudioOutlined />}
        onClick={isRecording ? stopRecording : startRecording}
        className={isRecording ? 'recording' : ''}
      />
    </Tooltip>
  );
};

const RecordWebcam = dynamic(
  () => import('react-record-webcam').then(mod => ({ useRecordWebcam: mod.useRecordWebcam })),
  { ssr: false }
);

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recordWebcam, setRecordWebcam] = useState(null);
  const [webcamReady, setWebcamReady] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState(null);
  const messagesEndRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Initialize webcam hook after component mounts
    const initWebcam = async () => {
      try {
        const { useRecordWebcam } = await import('react-record-webcam');
        const webcam = useRecordWebcam();
        setRecordWebcam(webcam);
        setWebcamReady(true);
      } catch (error) {
        console.error('Failed to initialize webcam:', error);
        message.error('Failed to initialize camera');
      }
    };
    initWebcam();

    // Cleanup webcam on unmount
    return () => {
      if (recordWebcam) {
        recordWebcam.close();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle file upload
  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatId', currentChatId);

      const response = await fetch('/api/chat/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setCurrentAttachment({
        type: data.fileType,
        url: data.url,
        fileName: data.fileName,
      });
      return data;
    } catch (error) {
      message.error('Failed to upload file');
      console.error('Upload error:', error);
      return null;
    }
  };

  // Handle camera capture
  const handleCameraCapture = async () => {
    if (!webcamReady) {
      message.error('Camera is not ready');
      return;
    }

    try {
      await recordWebcam.open();
      setIsCameraOpen(true);
    } catch (error) {
      message.error('Failed to access camera');
      console.error('Camera error:', error);
    }
  };

  const handleCameraPhoto = async () => {
    if (!webcamReady || !recordWebcam) {
      message.error('Camera is not ready');
      return;
    }

    try {
      const blob = await recordWebcam.takePhoto();
      const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
      const uploadResult = await handleFileUpload(file);
      
      if (uploadResult) {
        await handleSendMessage(null, {
          type: 'image',
          url: uploadResult.url,
          fileName: 'Camera Photo'
        });
      }
    } catch (error) {
      message.error('Failed to take photo');
      console.error('Photo error:', error);
    } finally {
      setIsCameraOpen(false);
      recordWebcam.close();
    }
  };

  // Handle audio recording
  const handleAudioRecordingComplete = async (blob) => {
    try {
      const file = new File([blob], 'audio-message.wav', { type: 'audio/wav' });
      
      // First upload the audio file
      const uploadResult = await handleFileUpload(file);
      if (!uploadResult) return;

      // Then convert to text
      const formData = new FormData();
      formData.append('audio', file);
      
      const response = await fetch('/api/chat/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Send both audio file and transcription
      await handleSendMessage(data.text, {
        type: 'audio',
        url: uploadResult.url,
        fileName: 'Voice Message'
      });
    } catch (error) {
      message.error('Failed to process audio');
      console.error('Audio error:', error);
    }
  };

  // Handle web search
  const handleWebSearch = async () => {
    if (!inputMessage.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/chat/web-search?q=${encodeURIComponent(inputMessage)}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);

      const searchResults = data.results.map(result => 
        `${result.title}\n${result.link}\n${result.snippet}\n\n`
      ).join('');

      await handleSendMessage(`Web search results for "${inputMessage}":\n\n${searchResults}`);
    } catch (error) {
      message.error('Failed to perform web search');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Main message sending function
  const handleSendMessage = async (text = null, attachment = null) => {
    const messageText = text || inputMessage;
    const messageAttachment = attachment || currentAttachment;
    
    if (!messageText.trim() && !messageAttachment) return;

    const userMessage = {
      content: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
      attachment: messageAttachment,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setCurrentAttachment(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          chatId: currentChatId,
          userId: 'current-user-id',
          attachment: messageAttachment,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      if (!currentChatId) {
        setCurrentChatId(data.chat._id);
      }

      const aiMessage = data.messages[1];
      setMessages(prev => [...prev, {
        content: aiMessage.content,
        sender: 'ai',
        timestamp: aiMessage.timestamp,
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Failed to send message. Please try again.');
      setMessages(prev => prev.slice(0, -1));
      setCurrentAttachment(messageAttachment); // Restore attachment on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render attachment preview
  const renderAttachment = (attachment) => {
    if (!attachment) return null;

    switch (attachment.type) {
      case 'image':
        return (
          <div className="attachment-preview">
            <img src={attachment.url} alt={attachment.fileName} style={{ maxWidth: '200px' }} />
          </div>
        );
      case 'audio':
        return (
          <div className="attachment-preview">
            <audio controls src={attachment.url} />
            <p>{attachment.fileName}</p>
          </div>
        );
      default:
        return (
          <div className="attachment-preview">
            <FileOutlined /> {attachment.fileName}
          </div>
        );
    }
  };

  return (
    <Card className="chat-window" style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div className="messages" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
            style={{
              display: 'flex',
              marginBottom: '10px',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {message.sender === 'ai' && (
              <Avatar style={{ marginRight: '10px' }} src="/ai-avatar.png" />
            )}
            <div
              style={{
                background: message.sender === 'user' ? '#1890ff' : '#f0f2f5',
                color: message.sender === 'user' ? 'white' : 'black',
                padding: '10px 15px',
                borderRadius: '15px',
                maxWidth: '70%',
                whiteSpace: 'pre-wrap',
              }}
            >
              {message.content}
              {renderAttachment(message.attachment)}
            </div>
            {message.sender === 'user' && (
              <Avatar style={{ marginLeft: '10px' }} />
            )}
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
            <Avatar style={{ marginRight: '10px' }} src="/ai-avatar.png" />
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0' }}>
        {currentAttachment && (
          <div className="current-attachment-preview" style={{ marginBottom: '10px' }}>
            {renderAttachment(currentAttachment)}
            <Button 
              type="text" 
              size="small" 
              danger 
              onClick={() => setCurrentAttachment(null)}
              style={{ marginLeft: '8px' }}
            >
              Remove
            </Button>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <Upload
            customRequest={async ({ file }) => {
              const result = await handleFileUpload(file);
              if (result) {
                setCurrentAttachment({
                  type: result.fileType,
                  url: result.url,
                  fileName: result.fileName,
                });
              }
            }}
            showUploadList={false}
          >
            <Tooltip title="Attach file">
              <Button icon={<PaperClipOutlined />} />
            </Tooltip>
          </Upload>
          
          <Tooltip title="Take photo">
            <Button 
              icon={<CameraOutlined />} 
              onClick={handleCameraCapture}
            />
          </Tooltip>

          <SimpleAudioRecorder onRecordingComplete={handleAudioRecordingComplete} />

          <Tooltip title="Web search">
            <Button 
              icon={isSearching ? <LoadingOutlined /> : <SearchOutlined />}
              onClick={handleWebSearch}
              disabled={isSearching || !inputMessage.trim()}
            />
          </Tooltip>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Input.TextArea
            style={{ resize: 'none' }}
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={isLoading}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => handleSendMessage()}
            disabled={isLoading || (!inputMessage.trim() && !currentAttachment)}
            style={{ height: 'auto' }}
          />
        </div>
      </div>

      <Modal
        title="Camera"
        open={isCameraOpen}
        onCancel={() => {
          setIsCameraOpen(false);
          if (recordWebcam) {
            recordWebcam.close();
          }
        }}
        footer={[
          <Button 
            key="take" 
            type="primary" 
            onClick={handleCameraPhoto}
            disabled={!webcamReady}
          >
            Take Photo
          </Button>,
        ]}
      >
        {webcamReady && recordWebcam ? (
          <video 
            ref={recordWebcam.webcamRef} 
            autoPlay 
            muted 
            style={{ width: '100%', borderRadius: '8px' }}
          />
        ) : (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center',
            background: '#f5f5f5',
            borderRadius: '8px'
          }}>
            <LoadingOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
            <p>Initializing camera...</p>
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 12px 20px;
          background: #f0f2f5;
          border-radius: 15px;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #90949c;
          border-radius: 50%;
          animation: bounce 1.3s linear infinite;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.15s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.3s;
        }
        
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }

        .attachment-preview {
          margin-top: 8px;
          padding: 8px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
        }

        .attachment-preview img,
        .attachment-preview audio {
          max-width: 100%;
        }

        .recording {
          background: #ff4d4f !important;
          border-color: #ff4d4f !important;
          color: white !important;
        }

        .recording:hover {
          background: #ff7875 !important;
          border-color: #ff7875 !important;
          color: white !important;
        }

        .current-attachment-preview {
          padding: 8px;
          background: #f5f5f5;
          border-radius: 8px;
          display: flex;
          align-items: center;
        }
      `}</style>
    </Card>
  );
};

export default ChatWindow; 