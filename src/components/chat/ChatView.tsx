import React, { useState } from 'react';
import type { ChatMessage, UserProfile } from '../../types';
import { Send, Flame, Lock, Sparkles } from 'lucide-react';

interface ChatViewProps {
  user: UserProfile;
  initialMessages: ChatMessage[];
}

export const ChatView: React.FC<ChatViewProps> = ({ user, initialMessages }) => {
  const [activeChannel, setActiveChannel] = useState<'campus-general' | 'guild-private'>('campus-general');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');

  const currentMessages = messages.filter((m) => m.channelId === activeChannel);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: activeChannel,
      senderId: user.id,
      senderName: user.name,
      senderHandle: user.handle,
      senderRole: activeChannel === 'guild-private' ? user.guildRole : undefined,
      senderTitle: user.title,
      guildTag: user.guildTag,
      text: inputText.trim(),
      timestamp: 'Just now'
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-abyss)',
        overflow: 'hidden'
      }}
    >
      {/* Channel Switcher */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-gilded)',
          backgroundColor: 'rgba(11, 15, 25, 0.9)',
          padding: '8px 16px',
          gap: 8
        }}
      >
        <button
          type="button"
          onClick={() => setActiveChannel('campus-general')}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: activeChannel === 'campus-general' ? 'rgba(229, 192, 123, 0.15)' : 'transparent',
            border: activeChannel === 'campus-general' ? '1px solid var(--border-gilded)' : 'none',
            color: activeChannel === 'campus-general' ? 'var(--gold-primary)' : 'var(--text-muted)',
            fontSize: '12px',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Flame size={14} color="#E5C07B" />
          <span>General Campfire</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveChannel('guild-private')}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: activeChannel === 'guild-private' ? 'rgba(49, 46, 129, 0.3)' : 'transparent',
            border: activeChannel === 'guild-private' ? '1px solid rgba(165, 180, 252, 0.4)' : 'none',
            color: activeChannel === 'guild-private' ? '#C7D2FE' : 'var(--text-muted)',
            fontSize: '12px',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Lock size={13} color="#818CF8" />
          <span>Chronos War Room</span>
        </button>
      </div>

      {/* Notice Banner */}
      <div
        style={{
          padding: '6px 16px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '10px',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}
      >
        <Sparkles size={12} color="var(--gold-primary)" />
        <span>
          {activeChannel === 'campus-general'
            ? 'Campus public channel. Respect all scholars. AI light-touch moderation is staged.'
            : 'Private encrypted channel for Chronos Keepers guild members.'}
        </span>
      </div>

      {/* Messages Feed */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}
      >
        {currentMessages.map((msg) => {
          const isMe = msg.senderId === user.id;

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start',
                gap: 3
              }}
            >
              {/* Sender Name & Guild Tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px' }}>
                <span style={{ fontWeight: 700, color: isMe ? 'var(--gold-primary)' : 'var(--text-heading)' }}>
                  {msg.senderName}
                </span>

                {msg.guildTag && (
                  <span
                    style={{
                      fontSize: '9px',
                      color: '#818CF8',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      padding: '1px 4px',
                      borderRadius: 3,
                      fontWeight: 700
                    }}
                  >
                    [{msg.guildTag}]
                  </span>
                )}

                <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
                  {msg.timestamp}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                style={{
                  maxWidth: '82%',
                  padding: '10px 14px',
                  borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  backgroundColor: isMe
                    ? 'rgba(153, 27, 27, 0.4)'
                    : activeChannel === 'guild-private'
                    ? 'rgba(49, 46, 129, 0.35)'
                    : 'rgba(255, 255, 255, 0.06)',
                  border: isMe
                    ? '1px solid rgba(229, 192, 123, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-parchment)',
                  fontSize: '13px',
                  lineHeight: 1.4,
                  wordBreak: 'break-word'
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Input Dock */}
      <form
        onSubmit={handleSendMessage}
        style={{
          padding: '10px 14px 14px',
          borderTop: '1px solid var(--border-gilded)',
          backgroundColor: 'rgba(11, 15, 25, 0.95)',
          display: 'flex',
          gap: 8,
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={activeChannel === 'campus-general' ? 'Post to campus campfire…' : 'Whisper to war room…'}
          style={{
            flex: 1,
            height: 42,
            padding: '0 14px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-gilded)',
            borderRadius: 22,
            color: '#fff',
            fontSize: '13px',
            outline: 'none',
            fontFamily: 'var(--font-body)'
          }}
        />

        <button
          type="submit"
          aria-label="Send message"
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            backgroundColor: 'var(--gold-primary)',
            color: '#070a10',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: 'none',
            flexShrink: 0
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
