import { useRef } from "react";

const useAuditGameSet = (
  amount: number,
  callback: (brokens: string[]) => void
) => {
  const auditRef = useRef(0);
  const auditBrokensRef = useRef<string[]>([]);

  const reset = () => {
    auditRef.current = 0;
    auditBrokensRef.current = [];
  };
  const audit = (brokenSrc?: string) => {
    if (brokenSrc) {
      auditBrokensRef.current.push(brokenSrc);
    }

    auditRef.current++;

    if (auditRef.current >= amount) {
      callback(auditBrokensRef.current);
    }
  };

  return { reset, audit };
};

export default useAuditGameSet;
