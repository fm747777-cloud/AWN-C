import { RefObject, useEffect, useRef } from 'react';

interface UseModalFocusTrapOptions {
  isOpen: boolean;
  onClose: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
  /**
   * Optional custom Escape handler. If provided and returns true,
   * the default `onClose()` call is skipped (e.g., when closing a nested dropdown first).
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => boolean;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"]):not(.sr-only)',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const nodes = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  );
  return nodes.filter(
    (el) =>
      !el.hasAttribute('disabled') &&
      el.getAttribute('aria-hidden') !== 'true'
  );
}

export function useModalFocusTrap<T extends HTMLElement = HTMLDivElement>({
  isOpen,
  onClose,
  initialFocusRef,
  onEscapeKeyDown,
}: UseModalFocusTrapOptions): RefObject<T | null> {
  const containerRef = useRef<T | null>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const onEscapeKeyDownRef = useRef(onEscapeKeyDown);

  useEffect(() => {
    onCloseRef.current = onClose;
    onEscapeKeyDownRef.current = onEscapeKeyDown;
  });

  // Handle initial focus, body scroll lock, and focus restoration on close
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const activeEl = document.activeElement;
    if (activeEl instanceof HTMLElement) {
      triggerElementRef.current = activeEl;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTarget =
      initialFocusRef?.current ??
      (containerRef.current
        ? getFocusableElements(containerRef.current)[0] ?? containerRef.current
        : null);

    focusTarget?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      const previousTrigger = triggerElementRef.current;
      if (
        previousTrigger &&
        previousTrigger.isConnected &&
        typeof previousTrigger.focus === 'function'
      ) {
        previousTrigger.focus();
      }
    };
  }, [isOpen, initialFocusRef]);

  // Handle Escape dismissal and Tab / Shift+Tab focus trap
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        if (onEscapeKeyDownRef.current) {
          const handled = onEscapeKeyDownRef.current(event);
          if (handled) {
            return;
          }
        }
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const container = containerRef.current;
      if (!container) {
        return;
      }

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (
          !activeElement ||
          !container.contains(activeElement) ||
          activeElement === firstElement
        ) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (
          !activeElement ||
          !container.contains(activeElement) ||
          activeElement === lastElement
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return containerRef;
}
