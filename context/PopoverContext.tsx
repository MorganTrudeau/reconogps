import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, useWindowDimensions } from "react-native";
import DismissView, { DismissViewRef } from "../components/DismissView";
import { spacing } from "../styles";

/* eslint-disable */
export const PopoverContext = createContext({
  showPopover: (
    measurement: Measurement,
    render: () => React.ReactElement,
    position: PopoverPosition
  ) => {},
  dismissPopover: () => {},
});
/* eslint-enable */

type Props = { children: React.ReactElement | React.ReactElement[] };
type PopoverPosition = "bottomRight" | "bottomLeft" | "topRight" | "topLeft";
type Measurement = {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

const defaultState = {
  measurement: null,
  renderPopover: null,
  position: "bottomRight" as PopoverPosition,
};

const PopoverProvider = ({ children }: Props) => {
  const dismissView = useRef<null | DismissViewRef>(null);

  const { width, height } = useWindowDimensions();

  const [{ measurement, renderPopover, position }, setState] = useState<{
    measurement: Measurement | null;
    renderPopover: null | (() => React.ReactElement);
    position: PopoverPosition;
  }>(defaultState);

  const [popoverLayout, setPopoverLayout] = useState<
    | {
        height: number;
        width: number;
      }
    | undefined
  >();

  const showPopover = (
    measurement: Measurement,
    render: () => React.ReactElement,
    position: PopoverPosition
  ) => {
    setState({ measurement, renderPopover: render, position });
  };

  const dismissPopover = () => {
    dismissView.current && dismissView.current.dismiss();
  };

  const handleClosed = () => {
    requestAnimationFrame(() => setState(defaultState));
  };

  useEffect(() => {
    if (renderPopover) {
      dismissView.current && dismissView.current.show();
    }
  }, [renderPopover]);

  // @ts-ignore
  const popoverStyle: {
    position: "absolute";
    bottom?: number;
    left?: number;
    top?: number;
    right?: number;
  } = useMemo(() => {
    console.log(height, measurement);
    if (!(popoverLayout && measurement)) {
      return { postion: "absolute" };
    }

    switch (position) {
      case "bottomRight":
        return {
          position: "absolute",
          bottom: height - measurement.pageY,
          right: width - measurement.pageX - measurement.width,
        };
      case "bottomLeft":
        return {
          position: "absolute",
          bottom: height - measurement.pageY,
          left: measurement.pageX,
        };
      case "topRight":
        return {
          position: "absolute",
          top: measurement.pageY + measurement.height / 2,
          right: width - measurement.pageX - measurement.width / 2,
        };
      case "topLeft":
        return {
          position: "absolute",
          top: measurement.pageY + measurement.height / 2,
          left: measurement.pageX + measurement.width / 2,
        };
      default:
        return { postion: "absolute" };
    }
  }, [popoverLayout, measurement, height, width, position]);

  const handlePopoverLayout = ({ nativeEvent: { layout } }: any) => {
    setPopoverLayout(layout);
  };

  const contextValue = useMemo(() => ({ showPopover, dismissPopover }), []);

  return (
    <PopoverContext.Provider value={contextValue}>
      {children}
      {renderPopover && (
        <DismissView ref={dismissView} opacity={0.3} onDismiss={handleClosed}>
          <Animated.View
            onLayout={!popoverLayout ? handlePopoverLayout : undefined}
            style={popoverStyle}
          >
            {renderPopover && renderPopover()}
          </Animated.View>
        </DismissView>
      )}
    </PopoverContext.Provider>
  );
};

export default PopoverProvider;
