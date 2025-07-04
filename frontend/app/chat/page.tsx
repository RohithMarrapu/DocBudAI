'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  FileText, 
  MessageCircle, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  Trash2, 
  User, 
  Bot,
  History,
  Sparkles,
  Menu,
  X,
  Plus,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

interface QAHistoryItem {
  question: string;
  answer: string;
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  timestamp: number;
  messages: QAHistoryItem[];
  documentName?: string;
}

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qaHistory, setQaHistory] = useState<QAHistoryItem[]>([]);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [qaHistory, streamingText]);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('pdf-chat-conversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      setConversations(parsed);
    }
  }, []);

  // Save conversations to localStorage
  const saveConversations = (convs: Conversation[]) => {
    localStorage.setItem('pdf-chat-conversations', JSON.stringify(convs));
    setConversations(convs);
  };

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      setUploadError('Please select a PDF file.');
      return;
    }
    setUploadedFile(file);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const uploadPdf = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      await axios.post('http://127.0.0.1:8000/upload_pdf/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadSuccess(true);
      setQaHistory([]);
      
      // Create new conversation
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: uploadedFile.name.replace('.pdf', ''),
        timestamp: Date.now(),
        messages: [],
        documentName: uploadedFile.name
      };
      
      const updatedConversations = [newConversation, ...conversations];
      saveConversations(updatedConversations);
      setCurrentConversationId(newConversation.id);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload PDF. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const clearChat = () => {
    setQaHistory([]);
    setStreamingText('');
    setQuestionError(null);
    
    if (currentConversationId) {
      const updatedConversations = conversations.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, messages: [] }
          : conv
      );
      saveConversations(updatedConversations);
    }
  };

  const newChat = () => {
    setUploadedFile(null);
    setUploadSuccess(false);
    setQaHistory([]);
    setStreamingText('');
    setQuestionError(null);
    setCurrentConversationId(null);
  };

  const loadConversation = (conversation: Conversation) => {
    setCurrentConversationId(conversation.id);
    setQaHistory(conversation.messages);
    setUploadSuccess(true);
    setUploadedFile({ name: conversation.documentName || 'Document' } as File);
  };

  const deleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
    saveConversations(updatedConversations);
    
    if (currentConversationId === conversationId) {
      newChat();
    }
  };

  const simulateStreaming = (text: string, callback: (finalText: string) => void) => {
    const words = text.split(' ');
    let currentText = '';
    let wordIndex = 0;

    const streamInterval = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
        setStreamingText(currentText);
        wordIndex++;
      } else {
        clearInterval(streamInterval);
        setStreamingText('');
        callback(text);
      }
    }, 50);
  };

  const formatAnswer = (answer: string) => {
    // Split answer into lines
    const lines = answer.split(/\r?\n/);
    const sections: { header: string | null; items: string[] }[] = [];
    let currentSection: { header: string | null; items: string[] } = { header: null, items: [] };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      // Detect section header (ends with colon, e.g., 'Projects to keep:')
      if (/[^:]:$/.test(trimmed)) {
        // Push previous section if it has content
        if (currentSection.header || currentSection.items.length > 0) {
          sections.push(currentSection);
        }
        currentSection = { header: trimmed, items: [] };
      } else if (/^(\d+\.|[•*])\s+/.test(trimmed)) {
        // Numbered or bulleted item
        currentSection.items.push(trimmed);
      } else {
        // Paragraph or other text
        if (currentSection.items.length > 0 || currentSection.header) {
          // Treat as new section
          sections.push(currentSection);
          currentSection = { header: null, items: [trimmed] };
        } else {
          currentSection.items.push(trimmed);
        }
      }
    });
    // Push last section
    if (currentSection.header || currentSection.items.length > 0) {
      sections.push(currentSection);
    }

    // Render sections
    return (
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx}>
            {section.header && (
              <div className="font-semibold text-gray-900 mb-2">{section.header}</div>
            )}
            {section.items.length > 0 && (
              <div className="space-y-2">
                {section.items.map((item, i) => {
                  // Numbered
                  const numMatch = item.match(/^(\d+)\.\s+(.*)$/);
                  if (numMatch) {
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full min-w-[32px] text-center">
                          {numMatch[1]}
                        </span>
                        <p className="text-gray-700 text-sm leading-relaxed">{numMatch[2]}</p>
                      </div>
                    );
                  }
                  // Bullet
                  const bulletMatch = item.match(/^[•*]\s*(.*)$/);
                  if (bulletMatch) {
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2.5 flex-shrink-0"></div>
                        <p className="text-gray-700 text-sm leading-relaxed">{bulletMatch[1]}</p>
                      </div>
                    );
                  }
                  // Paragraph
                  return (
                    <p key={i} className="text-gray-700 text-sm leading-relaxed">{item}</p>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const askQuestion = async () => {
    if (!question.trim() || !uploadSuccess) return;

    const userQuestion = question.trim();
    setQuestion('');
    setIsAsking(true);
    setQuestionError(null);

    const userMessage: QAHistoryItem = {
      question: userQuestion,
      answer: '',
      timestamp: Date.now(),
    };

    const updatedHistory = [...qaHistory, userMessage];
    setQaHistory(updatedHistory);

    try {
      const formData = new FormData();
      formData.append('question', userQuestion);

      const response = await axios.post('http://127.0.0.1:8000/ask_question/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const answerText = response.data.answer || 'No answer received.';
      
      simulateStreaming(answerText, (finalText) => {
        const finalHistory = [...updatedHistory];
        finalHistory[finalHistory.length - 1] = {
          ...finalHistory[finalHistory.length - 1],
          answer: finalText,
        };
        setQaHistory(finalHistory);
        
        // Update conversation in storage
        if (currentConversationId) {
          const updatedConversations = conversations.map(conv => 
            conv.id === currentConversationId 
              ? { ...conv, messages: finalHistory }
              : conv
          );
          saveConversations(updatedConversations);
        }
      });

    } catch (error) {
      console.error('Question error:', error);
      setQuestionError('Failed to get answer. Please try again.');
      setQaHistory(prev => prev.slice(0, -1));
    } finally {
      setIsAsking(false);
    }
  };

  const handleQuestionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <ChevronLeft className="h-6 w-6 text-blue-600 group-hover:text-purple-600 transition-colors" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    DocBudAI
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">PDF Intelligence Platform</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={newChat} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className={`bg-white/90 backdrop-blur-xl border-r border-gray-200/50 flex-shrink-0 flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-20'}`}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`font-semibold text-gray-900 flex items-center gap-2 ${!sidebarOpen && 'hidden'}`}>
                  <History className="h-4 w-4" />
                  Conversations
                </h2>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm border border-gray-300 cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-all duration-200"
                    onClick={() => setSidebarOpen(!sidebarOpen)}>
                  {sidebarOpen ? <X className="h-4 w-4 text-gray-600" /> : <Menu className="h-4 w-4 text-gray-600" />}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="bg-gray-100 p-3 rounded-lg inline-block mb-3">
                    <MessageCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className={`text-sm ${!sidebarOpen && 'hidden'}`}>No conversations yet</p>
                  <p className={`text-xs text-gray-400 ${!sidebarOpen && 'hidden'}`}>Upload a PDF to get started</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => loadConversation(conversation)}
                    className={`group ${sidebarOpen ? 'p-3' : 'p-2'} rounded-lg cursor-pointer transition-all duration-200 ${
                      currentConversationId === conversation.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50'
                        : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`flex-1 min-w-0 ${!sidebarOpen && 'hidden'}`}>
                        <h3 className="font-medium text-sm text-gray-900 truncate">
                          {conversation.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(conversation.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {conversation.messages.length} messages
                        </p>
                      </div>

                      {!sidebarOpen && (
                        <div className="w-full flex justify-center" title={conversation.title}>
                          <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg border-2 border-white">
                              <span className="font-bold text-lg text-white">
                                {conversation.title.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                        <div className={sidebarOpen ? 'opacity-0 group-hover:opacity-100' : 'hidden'}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => deleteConversation(conversation.id, e)}
                            className="transition-opacity p-2 h-8 w-8 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-500" />
                          </Button>
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!uploadSuccess ? (
            /* Welcome Screen */
            <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
              <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl inline-block mb-6">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
                    Chat with Your PDFs
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    Upload any PDF document and ask questions to get instant answers powered by AI.
                  </p>
                </div>

                {/* Upload Area */}
                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div
                      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                        uploadedFile
                          ? 'border-blue-400 bg-blue-50/50'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      
                      {uploadedFile ? (
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl inline-block">
                            <FileText className="h-12 w-12 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">{uploadedFile.name}</p>
                            <p className="text-gray-600">
                              {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <Button 
                            onClick={(e) => { e.stopPropagation(); uploadPdf(); }} 
                            disabled={isUploading}
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-base"
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Processing Document...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-5 w-5 mr-2" />
                                Start Chatting
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-2xl inline-block">
                            <Upload className="h-12 w-12 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-lg mb-2">Drop your PDF here</p>
                            <p className="text-gray-600">or click to browse your files</p>
                            <p className="text-sm text-gray-500 mt-2">Supports PDF files up to 50MB</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {uploadError && (
                      <div className="flex items-center p-4 mt-4 bg-red-50 border border-red-200 rounded-xl">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                        <span className="font-medium text-red-800">{uploadError}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Chat Interface */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Document Status */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200/50 p-4 shrink-0">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">
                        {uploadedFile?.name} is ready
                      </p>
                      <p className="text-sm text-green-700">Ask any question about your document</p>
                    </div>
                  </div>
                  {qaHistory.length > 0 && (
                    <Button
                      onClick={clearChat}
                      variant="outline"
                      size="sm"
                      className="border-green-300 text-green-700 hover:bg-green-100"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Chat
                    </Button>
                  )}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto">
                <div className="h-full overflow-y-auto p-6">
                  <div className="max-w-4xl mx-auto space-y-6">
                    {qaHistory.length === 0 && !streamingText && (
                      <div className="text-center py-16">
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-2xl inline-block mb-6">
                          <MessageCircle className="h-16 w-16 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to chat!</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          Your document has been processed. Ask any question to get started.
                        </p>
                      </div>
                    )}

                    {qaHistory.map((qa, index) => (
                      <div key={qa.timestamp} className="space-y-4">
                        {/* User Question */}
                        <div className="flex justify-end">
                          <div className="flex items-start gap-3 max-w-[85%]">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-lg px-6 py-4 shadow-lg">
                              <p className="text-sm leading-relaxed">{qa.question}</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2 mt-1 shadow-lg">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* AI Answer */}
                        {qa.answer && (
                          <div className="flex justify-start">
                            <div className="flex items-start gap-3 max-w-[90%]">
                              <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-full p-2 mt-1 shadow-lg">
                                <Bot className="h-4 w-4 text-white" />
                              </div>
                              <div className="bg-white/80 backdrop-blur-sm text-gray-900 rounded-2xl rounded-tl-lg px-6 py-4 shadow-lg border border-gray-200/50">
                                {formatAnswer(qa.answer)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Streaming Text */}
                    {streamingText && (
                      <div className="flex justify-start">
                        <div className="flex items-start gap-3 max-w-[90%]">
                          <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-full p-2 mt-1 shadow-lg">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-white/80 backdrop-blur-sm text-gray-900 rounded-2xl rounded-tl-lg px-6 py-4 shadow-lg border border-gray-200/50">
                            <div className="flex items-end gap-2">
                              <div className="text-sm leading-relaxed">{formatAnswer(streamingText)}</div>
                              <div className="w-2 h-5 bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse rounded-sm flex-shrink-0"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Loading Indicator */}
                    {isAsking && !streamingText && (
                      <div className="flex justify-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-full p-2 mt-1 shadow-lg">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl rounded-tl-lg px-6 py-4 shadow-lg border border-gray-200/50">
                            <div className="flex items-center gap-3">
                              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                              <span className="text-sm text-gray-600">Analyzing your question...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-xl shrink-0">
                <div className="max-w-4xl mx-auto p-6">
                  {questionError && (
                    <div className="flex items-center p-4 mb-4 bg-red-50 border border-red-200 rounded-xl">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                      <span className="font-medium text-red-800">{questionError}</span>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={handleQuestionKeyPress}
                        placeholder="Ask anything about your document..."
                        disabled={isAsking}
                        className="h-14 text-base pl-6 pr-16 border-gray-300/50 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Button 
                          onClick={askQuestion}
                          disabled={isAsking || !question.trim()}
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl h-8 w-8 p-0"
                        >
                          {isAsking ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Press Enter to send • Shift + Enter for new line
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}