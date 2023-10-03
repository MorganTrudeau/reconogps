import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { RootStackParamList } from "../navigation/utils";
import { useAlert } from "../hooks/useAlert";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  combinePlaybackPointsAndEvents,
  getEventInfo,
  parsePlaybackEvents,
  parsePlaybackHistory,
} from "../utils/playback";
import { PlaybackEvent, PlaybackPoint } from "../types";
import AppMap from "../components/Core/AppMap";
import MapboxGL from "@rnmapbox/maps";
import { IconSet } from "../utils/enums";
import {
  BORDER_RADIUS_MD,
  BORDER_RADIUS_SM,
  iconSize,
  spacing,
} from "../styles";
import AppIcon from "../components/Core/AppIcon";
import {
  createCameraPadding,
  defaultBounds,
  defaultCameraAnimationDuration,
  defaultCameraConfig,
  getBoundsFromCoordinates,
} from "../utils/maps";
import { CameraRef } from "@rnmapbox/maps/javascript/components/Camera";
import { loadPlayback, optimizePlaybackHistory } from "../api/playback";
import { EventIcons } from "../utils/constants";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../hooks/useTheme";
import AppText from "../components/Core/AppText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet from "@gorhom/bottom-sheet";
import Slider from "@react-native-community/slider";
import AppIconButton from "../components/Core/AppIconButton";
import moment from "moment";
import { formatDateRange } from "../utils/dates";
import AppPopover from "../components/Core/AppPopover";
import { PopoverContext } from "../context/PopoverContext";
import AssetPlaybackTabs from "../components/Assets/AssetPlaybackTabs";

const PLAYBACK_SPEEDS = [0.25, 0.5, 1, 1.5, 2, 4, 8];

type NavigationProps = NativeStackScreenProps<RootStackParamList, "playback">;

const AssetPlaybackScreen = ({ route }: NavigationProps) => {
  const { code, from, to, isIgnore, isOptimized } = route.params;

  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();

  const { height } = useWindowDimensions();
  const [eventPlaybackLayout, setEventPlaybackLayout] =
    useState<LayoutChangeEvent["nativeEvent"]["layout"]>();
  const handleEventPlaybackLayout = ({
    nativeEvent: { layout },
  }: LayoutChangeEvent) => {
    setEventPlaybackLayout(layout);
  };

  const snapPoints = [
    eventPlaybackLayout
      ? `${
          Math.min(
            (eventPlaybackLayout.height + insets.bottom + 30) / height,
            0.35
          ) * 100
        }%`
      : "35%",
    "50%",
    "85%",
  ];

  const popoverContext = useContext(PopoverContext);

  const mapCamera = useRef<CameraRef>(null);
  const shapeSource = useRef<MapboxGL.ShapeSource>(null);
  const bottomSheet = useRef<BottomSheet>(null);

  const Alert = useAlert();

  const { minorToken } = useSelector((state: RootState) => ({
    minorToken: state.auth.minorToken as string,
  }));

  const [playbackHistory, setPlaybackHistory] = useState<PlaybackPoint[]>([]);
  const [playbackEvents, setPlaybackEvents] = useState<PlaybackEvent[]>([]);
  const [optimizedPlayback, setOptimizedPlayback] = useState<{
    polylines: any[][][];
  }>();

  const playbackData = useMemo(() => {
    return [...playbackHistory, ...playbackEvents].sort(
      (a, b) => a.positionTime - b.positionTime
    );
  }, [playbackHistory, playbackEvents]);

  const [playbackDataIndex, setPlaybackDataIndex] = useState(-1);

  const [playerState, setPlayerState] = useState({ playing: false, speed: 1 });
  const { playing, speed } = playerState;

  const [slidingValue, setSlidingValue] = useState<number>();

  const handleSliderStart = useCallback((val: number) => {
    setSlidingValue(val);
  }, []);

  const slideTimeout = useRef<NodeJS.Timeout>();
  const handleSliderChange = useCallback((value: number) => {
    if (slideTimeout.current) {
      return;
    }
    setSlidingValue((v) => (typeof v === "number" ? value : undefined));
    slideTimeout.current = setTimeout(() => {
      slideTimeout.current = undefined;
    }, 60);
  }, []);

  const handleSliderEnd = useCallback(
    (value: number) => {
      setSlidingValue(undefined);
      if (playbackData.length) {
        const index = playbackData.findIndex((p) => p.positionTime >= value);
        if (index > -1 && index < playbackData.length) {
          setPlaybackDataIndex(index);
        }
      }
    },
    [playbackData]
  );

  useEffect(() => {
    let playerInterval: NodeJS.Timeout;

    if (playing) {
      playerInterval = setInterval(() => {
        setPlaybackDataIndex((i) => {
          if (i + 1 < playbackData.length) {
            return i + 1;
          } else {
            clearInterval(playerInterval);
            setPlayerState((s) => ({ ...s, playing: false }));
            return i;
          }
        });
      }, 1000 / speed);
    }

    return () => clearInterval(playerInterval);
  }, [playing, speed, playbackData]);

  const focusedPoint = useMemo(
    () => playbackData[playbackDataIndex],
    [playbackData, playbackDataIndex]
  );

  const lastFocusedPoint = useRef<PlaybackPoint | PlaybackEvent>();
  useEffect(() => {
    if (
      focusedPoint &&
      (!lastFocusedPoint.current ||
        lastFocusedPoint.current.lat !== focusedPoint.lat ||
        lastFocusedPoint.current.lng !== focusedPoint.lng)
    ) {
      mapCamera.current?.moveTo([focusedPoint.lng, focusedPoint.lat], 400);
    }
    lastFocusedPoint.current = focusedPoint;
  }, [focusedPoint]);

  const loadPlaybackData = async () => {
    if (playbackEvents.length && playbackEvents.length) {
      return;
    }
    try {
      const _playbackData = await loadPlayback(
        minorToken,
        code,
        from,
        to,
        isIgnore
      );

      console.log("EVENT DATA", _playbackData.HisEvents[0]);

      const formattedPlaybackHistory = parsePlaybackHistory(
        _playbackData.HisArry
      );
      const formattedPlaybackEvents = parsePlaybackEvents(
        _playbackData.HisEvents
      );

      if (isOptimized) {
        try {
          const _optimizedPlayback = await optimizePlaybackHistory(
            formattedPlaybackHistory
          );

          setTimeout(() => {
            setOptimizedPlayback(_optimizedPlayback);
            setPlaybackHistory(formattedPlaybackHistory);
          }, 100);
        } catch (error) {
          console.log("Failed to optimize", error);
        }
      } else {
        setTimeout(() => {
          setPlaybackHistory(formattedPlaybackHistory);
        }, 100);
      }

      setPlaybackEvents(formattedPlaybackEvents);
    } catch (error) {
      console.log(error);
      Alert.alert("Playback not loaded", "");
    }
  };

  useEffect(() => {
    loadPlaybackData();
  }, []);

  const coordinates = useMemo(() => {
    if (optimizedPlayback) {
      const recursivelyReduce = (acc: any[], arr: any[]): number[][] => {
        if (Array.isArray(arr[0][0])) {
          return recursivelyReduce(acc, arr[0]);
        }
        return [...acc, ...arr.map((points) => [points[1], points[0]])];
      };

      return optimizedPlayback.polylines.reduce((acc, arr) => {
        return recursivelyReduce(acc, arr);
      }, []);
    } else {
      return playbackHistory.map((point) => [point.lng, point.lat]);
    }
  }, [optimizedPlayback, playbackHistory]);

  const defaultMapBounds = useMemo(() => {
    const bottomSheetHeightRatio = eventPlaybackLayout
      ? Math.min(
          (eventPlaybackLayout.height + insets.bottom + 30) / height,
          0.35
        )
      : 0.35;
    if (coordinates.length) {
      const bounds = getBoundsFromCoordinates(coordinates, (point) => ({
        latitude: point[1],
        longitude: point[0],
      }));
      return {
        ...bounds,
        ...createCameraPadding({
          paddingBottom: insets.bottom + height * bottomSheetHeightRatio,
          paddingTop: insets.top + 60,
        }),
      };
    } else {
      return {
        ...defaultBounds,
        ...createCameraPadding({
          paddingBottom: insets.bottom + height * bottomSheetHeightRatio,
          paddingTop: insets.top + 60,
        }),
      };
    }
  }, [coordinates]);

  const eventShapes = useMemo(() => {
    const shape: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features:
        // (focusedPoint ? [focusedPoint] : playbackEvents).map(
        playbackEvents.map((event) => {
          const eventInfo = getEventInfo(event);
          const feature: GeoJSON.FeatureCollection["features"][number] = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [event.lng, event.lat],
            },
            /**
             * A value that uniquely identifies this feature in a
             * https://tools.ietf.org/html/rfc7946#section-3.2.
             */
            id: event.id,
            /**
             * Properties associated with this feature.
             */
            properties:
              event.object === "playback-event"
                ? {
                    icon: eventInfo.icon,
                  }
                : {},
          };
          return feature;
        }),
    };

    return shape;
  }, [playbackEvents, focusedPoint]);

  const renderPlaybackData = useCallback(() => {
    if (!focusedPoint) {
      return null;
    }
    const eventInfo = getEventInfo(focusedPoint);
    return (
      <View>
        <View style={theme.row}>
          <Image
            source={EventIcons[eventInfo.icon]}
            style={{ height: 35, width: 35, marginRight: spacing("sm") }}
            resizeMode="contain"
          />
          <View>
            <AppText style={theme.titleLarge}>{eventInfo.title}</AppText>
            {/* {focusedPoint.object === "playback-event" && (
              <AppText style={theme.textMeta}>
                {formatDateRange(focusedPoint.beginTime, focusedPoint.endTime)}
              </AppText>
            )} */}
          </View>
        </View>
        <AppText style={{ marginTop: spacing("sm") }}>
          {moment(Number(focusedPoint.positionTime)).format("MMM D h:mma")}
        </AppText>
      </View>
    );
  }, [focusedPoint]);

  const renderSpeedMenu = useCallback(() => {
    return (
      <View
        style={{
          backgroundColor: colors.surface,
          width: 175,
          marginVertical: spacing("lg"),
          padding: spacing("md"),
          borderRadius: BORDER_RADIUS_SM,
        }}
      >
        <AppText style={[theme.title, { paddingBottom: spacing("sm") }]}>
          Playback Speed
        </AppText>
        {PLAYBACK_SPEEDS.map((speed) => {
          return (
            <Pressable
              key={String(speed)}
              onPress={() => {
                setPlayerState((s) => ({ ...s, speed }));
                popoverContext.dismissPopover();
              }}
            >
              <AppText style={styles.speedMenuItem}>{speed}</AppText>
            </Pressable>
          );
        })}
      </View>
    );
  }, []);

  const renderEventPlayer = () => {
    return (
      <View
        style={{
          paddingHorizontal: spacing("lg"),
          paddingBottom: spacing("lg"),
        }}
        onLayout={handleEventPlaybackLayout}
      >
        {renderPlaybackData()}
        <View style={[theme.row, { paddingTop: spacing("lg") }]}>
          <AppIconButton
            name={playing ? "pause" : "play"}
            size={iconSize("lg")}
            color={colors.primary}
            style={{
              backgroundColor: colors.surface,
              padding: spacing("sm"),
              marginEnd: spacing("md"),
            }}
            {...{ theme, colors }}
            onPress={() => {
              setPlayerState((s) => ({ ...s, playing: !s.playing }));
            }}
          />
          <View style={{ flex: 1 }}>
            <Slider
              style={{ height: 40, flex: 1 }}
              minimumValue={playbackData[0]?.positionTime || 0}
              maximumValue={
                playbackData[playbackData.length - 1]?.positionTime || 1
              }
              value={focusedPoint?.positionTime}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.empty}
              onSlidingStart={handleSliderStart}
              onValueChange={handleSliderChange}
              onSlidingComplete={handleSliderEnd}
              disabled={!playbackData.length}
              tapToSeek
            />
            {typeof slidingValue === "number" && (
              <AppText
                style={[theme.textMeta, { position: "absolute", bottom: -15 }]}
              >
                {moment(slidingValue).format("MMM D h:mma")}
              </AppText>
            )}
          </View>
          <AppPopover
            position={"bottomRight"}
            renderPopover={renderSpeedMenu}
            style={[
              theme.row,
              {
                paddingHorizontal: spacing("sm"),
                paddingVertical: spacing("sm"),
                borderRadius: 5,
                backgroundColor: colors.surface,
                marginStart: spacing("md"),
              },
            ]}
          >
            <>
              <AppText style={[theme.title, { marginEnd: spacing("xs") }]}>
                {speed}x
              </AppText>
              <AppIcon
                name={"fast-forward"}
                color={colors.primary}
                size={iconSize("md")}
              />
            </>
          </AppPopover>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <AppMap style={{ flex: 1 }}>
        <MapboxGL.Camera
          defaultSettings={defaultCameraConfig}
          ref={mapCamera}
          animationDuration={defaultCameraAnimationDuration}
          bounds={defaultMapBounds}
        />

        <MapboxGL.Images images={EventIcons} />

        {playbackHistory.length > 2 && (
          <MapboxGL.ShapeSource
            id="lineSource"
            lineMetrics={true}
            shape={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates,
              },
              properties: {},
            }}
          >
            <MapboxGL.LineLayer id="layer1" style={layerStyles.lineLayer} />
          </MapboxGL.ShapeSource>
        )}

        <MapboxGL.ShapeSource
          ref={shapeSource}
          shape={eventShapes}
          id="a-symbolLocationSource"
          hitbox={{ width: 18, height: 18 }}
          onPress={async (point) => {
            if (point.features[0].properties?.cluster) {
              const collection: GeoJSON.FeatureCollection =
                await shapeSource.current?.getClusterLeaves(
                  point.features[0],
                  point.features[0].properties.point_count,
                  0
                );
              // Do what you want if the user clicks the cluster
              // console.log("Collection Press", collection);

              if (collection?.features) {
                const coords = collection.features.map((feature) => {
                  // @ts-ignore
                  return feature.geometry.coordinates;
                });

                const bounds = getBoundsFromCoordinates(
                  coords,
                  (point) => ({
                    latitude: point[1],
                    longitude: point[0],
                  }),
                  0
                );

                mapCamera.current?.fitBounds(
                  bounds.ne,
                  bounds.sw,
                  [150, 50],
                  400
                );
              }
            } else {
              const index = playbackData.findIndex(
                (val) => val.id === point.features[0].id
              );

              if (index > -1) {
                setPlaybackDataIndex(index);
              }

              mapCamera.current?.moveTo(
                // @ts-ignore
                point.features[0].geometry.coordinates,
                400
              );
            }
          }}
          // clusterRadius={40}
          // clusterMaxZoomLevel={14}
          cluster
        >
          <MapboxGL.SymbolLayer
            id="pointCount"
            // @ts-ignore
            style={layerStyles.clusterCount}
          />

          <MapboxGL.CircleLayer
            id="clusteredPoints"
            belowLayerID="pointCount"
            filter={["has", "point_count"]}
            style={{
              circlePitchAlignment: "map",
              circleColor: colors.primary,
              circleRadius: [
                "step",
                ["get", "point_count"],
                20,
                100,
                25,
                250,
                30,
                750,
                40,
              ],
              circleOpacity: 0.95,
              circleStrokeWidth: 0,
              circleStrokeColor: colors.primary,
            }}
          />

          <MapboxGL.SymbolLayer
            id="singlePoint"
            filter={["!", ["has", "point_count"]]}
            style={{
              iconImage: ["get", "icon"],
              iconSize: 0.7,
              iconHaloColor: "black",
              iconHaloWidth: 10,
              iconColor: "white",
              iconAllowOverlap: true,
              iconAnchor: "bottom",
            }}
          />
        </MapboxGL.ShapeSource>

        {focusedPoint && (
          <MapboxGL.MarkerView
            allowOverlap={true}
            coordinate={[focusedPoint.lng, focusedPoint.lat]}
          >
            <AppIcon
              name={IconSet.location}
              size={iconSize("xl")}
              color={colors.black}
            />
          </MapboxGL.MarkerView>
        )}
      </AppMap>

      <BottomSheet
        ref={bottomSheet}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: colors.background }}
        style={{
          backgroundColor: colors.background,
          borderTopRightRadius: BORDER_RADIUS_MD,
          borderTopLeftRadius: BORDER_RADIUS_MD,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.white }}
      >
        {renderEventPlayer()}

        <AssetPlaybackTabs
          playbackEvents={playbackEvents}
          playbackPoints={playbackHistory}
          onEventPress={(playbackEvent) => {
            const index = playbackData.findIndex(
              (d) => d.id === playbackEvent.id
            );
            if (index > -1) {
              setPlaybackDataIndex(index);
              bottomSheet.current?.snapToIndex(0);
            }
          }}
          from={route.params.from}
          to={route.params.to}
          assetId={route.params.code}
        />
      </BottomSheet>

      <StatusBar style={"dark"} />
    </View>
  );
};

export default AssetPlaybackScreen;

const ITEM_SIZE = 150;

const styles = StyleSheet.create({
  carouselContainerStyle: {
    paddingHorizontal: spacing("lg"),
    paddingTop: ITEM_SIZE / 4,
  },
  speedMenuItem: { paddingVertical: spacing("md") },
});

const layerStyles = {
  lineLayer: {
    lineColor: "#3e8feb",
    lineCap: "round",
    lineJoin: "round",
    lineWidth: 3,
  },
  singlePoint: {
    circleColor: "green",
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: "white",
    circleRadius: 5,
    circlePitchAlignment: "map",
  },
  clusteredPoints: {},
  clusterCount: {
    textField: "{point_count}",
    textSize: 12,
    textPitchAlignment: "map",
  },
};
