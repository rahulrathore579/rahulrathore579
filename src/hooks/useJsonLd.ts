import { useEffect } from 'react';

export default function useJsonLd(scriptId: string, schema: Record<string, unknown>) {
  useEffect(() => {
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.text = JSON.stringify(schema);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) {
        existing.remove();
      }
    };
  }, [scriptId, schema]);
}
