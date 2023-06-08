"use client";

import { useOnClickOutside } from "usehooks-ts";
import { useEffect, useRef } from "react";
type Props = {
  children: React.ReactNode;
  open: boolean;
  // add disableClickOutside
  disableClickOutside?: boolean;
  //add onClose event so that we can close the modal from inside the component
  onClose(): void;
};

export const Modal = ({
  children,
  open,
  disableClickOutside,
  onClose,
}: Props) => {
  const ref = useRef(null);
  //outerref is the dialog element, use typescript for type safety
  const outerRef = useRef<HTMLDialogElement>(null);
  useOnClickOutside(ref, () => {
    if (!disableClickOutside) {
      onClose();
    }
  });

  useEffect(() => {
    if (open) {
      outerRef && outerRef.current?.showModal();
    } else {
      outerRef && outerRef.current?.close();
    }
  }, [open]);

  return (
    <dialog
      ref={outerRef}
      className={`modal modal-bottom sm:modal-middle`}
      onCancel={() => {
        onClose();
      }}
    >
      <div className="modal-box bg-neutral-200 !max-w-none !w-auto" ref={ref}>
        {children}
      </div>
    </dialog>
  );
};
