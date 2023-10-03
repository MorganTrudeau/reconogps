import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { PopoverContext } from "../../context/PopoverContext";

type Props = {
  children: React.ReactElement;
  renderPopover: () => React.ReactElement;
  position: "bottomRight" | "bottomLeft" | "topRight" | "topLeft";
} & TouchableOpacityProps;

const AppPopover = (
  { children, renderPopover, position, ...rest }: Props,
  ref: any
) => {
  const popoverRef = useRef<TouchableOpacity | null>(null);

  const popoverContext = useContext(PopoverContext);

  const showPopover = () => {
    try {
      popoverRef.current &&
        popoverRef.current.measure((x, y, width, height, pageX, pageY) => {
          popoverContext.showPopover(
            { x, y, width, height, pageX, pageY },
            renderPopover,
            position
          );
        });
    } catch (error) {
      console.log("Could not measure", error);
    }
  };

  useImperativeHandle(ref, () => ({ dismiss: popoverContext.dismissPopover }));

  return (
    <TouchableOpacity
      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      onPress={showPopover}
      ref={popoverRef}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
};

export default forwardRef(AppPopover);
