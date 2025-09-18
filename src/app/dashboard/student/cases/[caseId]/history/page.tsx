'use client';

import { useState, useEffect, useRef, useTransition, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import {
  getOrCreateCaseAttempt,
  postMessageToCase,
  ChatHistory,
  getCaseEmotionalState,
} from '@/lib/actions/case.actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SendHorizontal, Bot, Loader2, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCaseStep } from '../_components/CaseStepProvider';
import Character, { CharacterExpression } from '@/components/shared/Character';

const MAX_CHARS = 250;

export default function CaseHistoryPage() {
  const params = useParams();
  const { completeStep } = useCaseStep();
  const caseId = params.caseId as string;

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatHistory['messages']>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [emotional_state, set_emotional_state] = useState<CharacterExpression>(CharacterExpression.CALM)


  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Effect to load initial chat history
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const result = await getOrCreateCaseAttempt(caseId);
        if (result.success && result.data) {
          const last_message = result.data.messages.findLast((msg) => msg.role === 'AI')
          if (!!last_message && !!last_message.emotional_states) {
            const expression = last_message.emotional_states.toUpperCase() as unknown as CharacterExpression
            // @ts-expect-error hell-no it is not complicated.
            set_emotional_state(CharacterExpression[expression])
          } else {
            const result = await getCaseEmotionalState(caseId)
            if (result.success && !!result.data) {
              const expression = result.data.state.toUpperCase() as unknown as CharacterExpression
            // @ts-expect-error hell-no it is not complicated.
            set_emotional_state(CharacterExpression[expression])
            }
          }
          setMessages(result.data.messages);
          setAttemptId(result.data.attemptId);
        } else {
          setError(result.error || 'Failed to load case history.');
        }
      } catch (e) {
        setError('An unexpected error occurred.');
        console.log(e)
        set_emotional_state(CharacterExpression.CONFUSED)
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, [caseId]);

  // Effect to auto-scroll on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isPending]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isPending || !attemptId) return;

    // Optimistically add the user's message to the UI
    const userMessage = { role: 'USER' as const, content: newMessage, emotional_states: null };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');

    startTransition(async () => {
      const result = await postMessageToCase(attemptId, userMessage.content);
      if (result.success && result.data) {
        const aiMessage = { role: 'AI' as const, content: result.data.dialogue, emotional_states: result.data.emotional_state };
        // Replace the optimistic UI with the final state
        setMessages((prev) => [...prev, aiMessage]);
        const expression = aiMessage.emotional_states.toUpperCase() as unknown as CharacterExpression
        // @ts-expect-error hell-no it is not complicated.
        set_emotional_state(CharacterExpression[expression])
        // Mark this step as "completed" so the user can proceed.
        // You might want more complex logic here later.
        completeStep(0);
      } else {
        const errorMessage = {
          role: 'AI' as const,
          content: `متاسفانه خطایی رخ داد: ${result.error}`,
          emotional_states: 'CONFUSED'
        };
        set_emotional_state(CharacterExpression.CONFUSED)
        // Add an error message to the chat
        setMessages((prev) => [...prev, errorMessage]);
        // Revert the optimistic update by removing the user's message
        // setMessages(prev => prev.slice(0, prev.length - 1));
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ms-4 text-muted-foreground">در حال بارگذاری کیس...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-destructive p-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full">
        <Character expression={emotional_state} className='flex md:h-96 h-64 justify-center md:sticky md:top-24'/>
      <div className="flex flex-col h-full bg-background rounded-lg border">
        {/* Scrollable Chat Area */}
        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn("flex w-full items-start gap-3", {
                "justify-start": msg.role === "USER",
                "justify-end": msg.role === "AI",
              })}
            >
              {msg.role === "USER" && (
                <Avatar className="w-9 h-9 flex-shrink-0">
                  <AvatarFallback>
                    <UserRound size={22} />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn("rounded-2xl p-3 px-4 max-w-[85%] shadow-sm", {
                  "bg-muted text-foreground rounded-br-none":
                    msg.role === "USER",
                  "bg-secondary text-secondary-foreground rounded-bl-none":
                    msg.role === "AI",
                })}
              >
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
              </div>
              {msg.role === "AI" && (
                <Avatar className="w-9 h-9 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot size={20} />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isPending && (
            <div className="flex w-full items-end gap-3 justify-end">
              <div className="bg-secondary rounded-2xl p-3 px-4 rounded-bl-none inline-flex items-center shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-secondary-foreground" />
              </div>
              <Avatar className="w-9 h-9 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot size={20} />
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>

        {/* Sticky Input Form */}
        <div className="flex-shrink-0 p-4 pt-2 bg-background border-t">
          <form onSubmit={handleSendMessage} className="relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="سوال خود را بپرسید..."
              disabled={isPending}
              maxLength={MAX_CHARS}
              className="h-12 text-base pe-32 rounded-full"
              dir="rtl"
            />
            <div
              className="absolute left-20 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
              dir="ltr"
            >
              {newMessage.length} / {MAX_CHARS}
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={isPending || !newMessage.trim()}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SendHorizontal className="h-5 w-5" />
              )}
              <span className="sr-only">ارسال پیام</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
