import { useRef, useState } from "react";

const useAuditGameSet = (callback: (brokens: string[]) => void) => {
  const [amount, setAmount] = useState(0);
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

  return { reset, audit, setAmount };
};

export default useAuditGameSet;
