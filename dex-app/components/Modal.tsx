import { Dialog } from "@headlessui/react";
import React, { Fragment, useState } from "react";

interface Props {
  children: React.ReactNode;
  btnTitle: string;
}

export default function Modal({ children, btnTitle }: Props) {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="f">
        <button
          type="button"
          onClick={openModal}
          className=" border border-gray-700 px-5 rounded-md py-3  active:scale-95 transition-all ease-in-out bg-blue-500 bg-opacity-10 text-white 5mx-auto "
        >
          {btnTitle}
        </button>
      </div>

      <Dialog
        as="div"
        open={isOpen}
        className="relative z-10"
        onClose={closeModal}
      >
        <div className="fixed inset-0 bg-black/25" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="">{children}</Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
