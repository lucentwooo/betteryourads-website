type Event = 'book_call_click' | 'section_view' | 'waitlist_join';

/** Fire-and-forget analytics event. Safe no-op on the server and until a
 *  provider (e.g. Vercel Analytics) attaches `window.va`. Single call site so
 *  the provider can be wired in one place later. */
export function track(event: Event, props?: Record<string, string | number>): void {
  if (typeof window === 'undefined') return;
  (window as unknown as { va?: (...a: unknown[]) => void }).va?.('event', { name: event, ...props });
}
