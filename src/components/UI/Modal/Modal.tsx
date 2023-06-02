import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Button from "../Button";
type ModalSetOpenFn = (open: boolean) => void;

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, setIsOpen };
}

export function Modal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: ModalSetOpenFn;
}) {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-violet-1100 border-neutral-700 border p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Payment successful
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm">
                    Your payment has been successfully submitted. We’ve sent you
                    an email with all of the details of your order.
                  </p>
                </div>

                <div className="mt-4 flex gap-3 justify-end">
                  <Button variant="secondary">Close</Button>

                  <Button>OK</Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
