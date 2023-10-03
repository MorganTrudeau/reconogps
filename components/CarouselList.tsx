import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  View,
  StyleSheet,
  Animated,
  FlatListProps,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  FlatList,
  Dimensions,
} from "react-native";
import { Colors, Theme } from "../types/styles";
import AppIcon from "./Core/AppIcon";
import { useCombinedRefs } from "../hooks/useCombinedRefs";

const isWeb = Platform.OS === "web";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const CONTAINER_WIDTH = Dimensions.get("window").width;

const OVERFLOW_HEIGHT = 85;
const MAX_ITEM_WIDTH = 600;
const ITEM_WIDTH = Math.min(MAX_ITEM_WIDTH, CONTAINER_WIDTH) * 0.76;

let translationOutputRange = [
  -CONTAINER_WIDTH * 3 + ITEM_WIDTH / 1.045,
  -CONTAINER_WIDTH * 2 + ITEM_WIDTH / 3,
  -CONTAINER_WIDTH + ITEM_WIDTH / 6,
  0,
  -100,
];

// if (isRTL()) {
//   translationOutputRange = translationOutputRange.map((r) => -r);
// }

type AnimatedListItemProps = {
  index: number;
  scrollY: Animated.Value;
  children: React.ReactElement | null;
  itemSize: number;
};

const AnimatedListItem = React.memo(
  ({ index, scrollY, children, itemSize }: AnimatedListItemProps) => {
    const offset = index * itemSize;
    const inputRange = [offset - itemSize, offset, offset + itemSize];
    const extendedInputRange = [
      offset - itemSize * 2,
      ...inputRange,
      offset + itemSize * 2,
    ];
    const transition = scrollY.interpolate({
      inputRange,
      outputRange: [-1, 0, 1],
    });
    // const translateX = scrollX.interpolate({
    //   inputRange: extendedInputRange,
    //   outputRange: translationOutputRange,
    // });
    const scale = scrollY.interpolate({
      inputRange: extendedInputRange,
      outputRange: [0.9, 0.95, 1, 0.6, 0.6],
    });
    const opacity = scrollY.interpolate({
      inputRange: extendedInputRange,
      outputRange: [0.6, 0.8, 1, 0, 0],
    });

    const translateYOutput = Platform.select({
      default: [itemSize, 0, itemSize],
      web: [-itemSize * 1.1, 0, itemSize * 2],
    });
    const translateY = scrollY.interpolate({
      inputRange: inputRange,
      outputRange: translateYOutput,
    });

    return (
      <Animated.View
        pointerEvents={"box-none"}
        style={{
          opacity,
          transform: [
            {
              translateY,
            },
            { scale },
          ],
        }}
      >
        {children}
      </Animated.View>
    );
  }
);

type Props = {
  itemSize: number;
  focusCurrent?: boolean;
  onPress?: (event: any) => void;
  scrollDownText?: string;
  scrollUpText?: string;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  renderItem: ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => React.ReactElement;
  theme: Theme;
  colors: Colors;
  disableButton?: boolean;
} & FlatListProps<any>;

const CarouselList = ({
  itemSize,
  onPress,
  renderItem,
  scrollUpText,
  scrollDownText,
  data,
  initialIndex = 0,
  onIndexChange,
  focusCurrent,
  theme,
  colors,
  disableButton,
  ...rest
}: Props) => {
  const activeIndex = useRef(initialIndex);

  const listRef = useRef<FlatList>(null);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const snapToOffsets = useMemo(() => {
    return data
      ? new Array(data.length).fill(0).map((_, index) => index * itemSize)
      : [];
  }, [data, itemSize]);

  const onScroll = useRef(
    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
      useNativeDriver: true,
    })
  ).current;

  useEffect(() => {
    if (initialIndex && initialIndex > 0) {
      handleIndexChange(initialIndex);
      setTimeout(
        () =>
          listRef.current?.scrollToIndex({
            index: initialIndex,
            animated: true,
          }),
        1
      );
    }
  }, [initialIndex]);

  const renderCell = useCallback(
    ({ index, children, style, ...props }: any) => {
      const newStyle = [
        style,
        {
          zIndex: (data ? data.length : 0) - index,
        },
      ];
      return (
        <View style={newStyle} index={index} {...props}>
          {children}
        </View>
      );
    },
    []
  );

  const renderAnimatedItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <AnimatedListItem {...{ item, index, scrollY, itemSize }}>
        {renderItem ? renderItem({ item, index }) : null}
      </AnimatedListItem>
    ),
    [renderItem, itemSize]
  );

  const getItemLayout = useCallback(
    (data: unknown[] | null | undefined, index: number) => ({
      length: itemSize,
      offset: itemSize * index,
      index,
    }),
    [itemSize]
  );

  const handleIndexChange = (index: number) => {
    if (index !== activeIndex.current) {
      activeIndex.current = index;
      onIndexChange && onIndexChange(activeIndex.current);
    }
  };

  const handleScrollDown = () => {
    const nextIndex = activeIndex.current + 1;

    if (!data || nextIndex > data.length - 1) {
      return;
    }

    handleIndexChange(nextIndex);

    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const handleScrollUp = () => {
    const nextIndex = activeIndex.current - 1;

    if (!data || nextIndex < 0) {
      return;
    }

    handleIndexChange(nextIndex);

    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / itemSize);

    if (typeof index !== "number") {
      return;
    }

    handleIndexChange(index);
  };

  return (
    <View>
      {!disableButton && (
        <TouchableOpacity
          onPress={handleScrollDown}
          style={[
            styles.button,
            { backgroundColor: colors.background },
            styles.topButton,
          ]}
        >
          <AppIcon
            name={"chevron-up"}
            color={
              data && activeIndex.current < data.length - 1
                ? colors.primary
                : colors.empty
            }
            size={buttonIconSize}
          />
        </TouchableOpacity>
      )}
      <AnimatedFlatList
        onMomentumScrollEnd={onScrollEnd}
        ref={listRef}
        data={data}
        snapToOffsets={snapToOffsets}
        decelerationRate={"fast"}
        removeClippedSubviews={false}
        onScroll={onScroll}
        scrollEventThrottle={1}
        CellRendererComponent={renderCell}
        renderItem={renderAnimatedItem}
        // @ts-ignore
        getItemLayout={getItemLayout}
        inverted={!isWeb}
        scrollEnabled={!isWeb}
        {...rest}
      />
      {!disableButton && (
        <TouchableOpacity
          onPress={handleScrollUp}
          style={[
            styles.button,
            { backgroundColor: colors.background },
            styles.bottomButton,
          ]}
        >
          <AppIcon
            name={"chevron-down"}
            color={activeIndex.current > 0 ? colors.primary : colors.empty}
            size={buttonIconSize}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const buttonIconSize = 30;

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    alignSelf: "center",
    borderRadius: 10,
    width: 80,
    zIndex: 1000,
  },
  bottomButton: {
    bottom: 10,
  },
  topButton: {
    top: 0,
  },
  emptyContainer: { flexDirection: "row", alignItems: "center" },
  container: {
    justifyContent: "center",
    width: CONTAINER_WIDTH,
  },
  contentContainer: { flexGrow: 1 },
  emptyIcon: { marginEnd: 10 },
  itemContainer: {},
  itemContainerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overflowContainer: {
    height: OVERFLOW_HEIGHT,
    overflow: "hidden",
  },
  eventItem: {
    width: ITEM_WIDTH,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
});

export default CarouselList;
