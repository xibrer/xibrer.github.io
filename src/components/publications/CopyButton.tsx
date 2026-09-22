'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMessages } from '@/lib/i18n/useMessages';

interface CopyButtonProps {
  value: string;
  className?: string;
}

/**
 * Text-labelled copy affordance for code blocks, mirroring the reference page's
 * "Copy" button. Shows a transient confirmation and announces it to screen
 * readers.
 */
export default function CopyButton({ value, className = 'ds-btn-text' }: CopyButtonProps) {
  const messages = useMessages();
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard unavailable (insecure context or permission denied); keep the
      // button inert rather than claiming success.
      return;
    }

    setCopied(true);
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className}
      title={messages.common.copyToClipboard}
      aria-label={messages.common.copyToClipboard}
    >
      <span aria-live="polite">{copied ? messages.common.copied : messages.common.copy}</span>
    </button>
  );
}
