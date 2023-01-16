import React, { forwardRef, useImperativeHandle, useState } from "react";
import Modal, { ModalProps } from "react-native-modal";

export type AppModalRef = { open: () => void; close: () => void };

export type Props = Partial<ModalProps> & { children: ModalProps["children"] };

const AppModal = forwardRef<{ open: () => void; close: () => void }, Props>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);

    const close = () => setVisible(false);
    const open = () => setVisible(true);

    useImperativeHandle(ref, () => ({
      close,
      open,
    }));

    return (
      <Modal
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
        onBackdropPress={close}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        {...props}
        isVisible={visible}
        onBackButtonPress={close}
      />
    );
  }
);

export default AppModal;
