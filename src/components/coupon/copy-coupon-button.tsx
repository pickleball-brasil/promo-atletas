'use client';

import { useState } from 'react';
import copy from 'copy-to-clipboard';

type CopyCouponButtonProps = {
  couponCode: string;
  disabled?: boolean;
  className?: string;
  testId?: string;
  idleLabel?: string;
  copiedLabel?: string;
  disabledLabel?: string;
};

export function CopyCouponButton({
  couponCode,
  disabled = false,
  className,
  testId,
  idleLabel = 'Copiar cupom',
  copiedLabel = 'Copiado!',
  disabledLabel = 'Cupom indisponivel',
}: CopyCouponButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (disabled) return;

    const success = copy(couponCode);
    if (!success) return;

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      className={className}
      aria-label="Copiar cupom"
      data-testid={testId}
    >
      {disabled ? disabledLabel : copied ? copiedLabel : idleLabel}
    </button>
  );
}