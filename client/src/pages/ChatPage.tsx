import React from 'react';
import Chat from '../components/Chat';
import styled from 'styled-components';

const ChatPageContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const ChatPage: React.FC = () => {
  return (
    <ChatPageContainer>
      <Chat />
    </ChatPageContainer>
  );
};

export default ChatPage;