import { useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { ChatForm } from './components/chat/ChatForm';
import { StatusMessage } from './components/chat/StatusMessage';
import { useStatusMessage } from './hooks/useStatusMessage';

export function App() {
  const { status } = useStatusMessage();

  return (
    <MainLayout>
      <ChatForm />
      {status && <StatusMessage status={status} />}
    </MainLayout>
  );
}