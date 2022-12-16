import { PropsWithChildren, useEffect, useState } from "react";
import Modal from "react-modal";
import Button from "../Button";
import styles from "./Modal.module.css";

const CustomModal: React.FC<
  PropsWithChildren<{
    openModal?: boolean;
    closeModal?: boolean;
    onAfterClose?: () => void;
  }>
> = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (props.openModal) {
      handleOpenModal();
    } else if (props.closeModal) {
      handleCloseModal();
    }

    return () => {
      handleCloseModal();
    };
  }, [props.openModal, props.closeModal]);

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <Modal
      ariaHideApp={false}
      onAfterClose={props.onAfterClose}
      onRequestClose={() => handleCloseModal()}
      isOpen={modalIsOpen}
      contentLabel="Scorecard"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div className={styles.modalClose}>
        <Button size="small" onClick={handleCloseModal}>
          CLOSE
        </Button>
      </div>
      {props.children}
    </Modal>
  );
};

export default CustomModal;
