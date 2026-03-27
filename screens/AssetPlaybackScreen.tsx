import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { getHeaderHeight, RootStackParamList } from "../navigation/utils";
import { useAlert } from "../hooks/useAlert";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  getEventInfo,
  parsePlaybackEvents,
  parsePlaybackHistory,
} from "../utils/playback";
import {
  PlaybackEvent,
  PlaybackPoint,
  PlaybackTrip,
  PlaybackTripDetail,
} from "../types";
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
import {
  getTripReport,
  loadPlayback,
  optimizePlaybackHistory,
} from "../api/playback";
import { EventIcons } from "../utils/constants";
import { useTheme } from "../hooks/useTheme";
import AppText from "../components/Core/AppText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet from "@gorhom/bottom-sheet";
import Slider from "@react-native-community/slider";
import AppIconButton from "../components/Core/AppIconButton";
import moment from "moment";
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
            (eventPlaybackLayout.height + 73 + insets.bottom) / height,
            0.35
          ) * 100
        }%`
      : "35%",
    "50%",
    "85%",
  ];

  const popoverContext = useContext(PopoverContext);

  const mapCamera = useRef<MapboxGL.Camera>(null);
  const shapeSource = useRef<MapboxGL.ShapeSource>(null);
  const bottomSheet = useRef<BottomSheet>(null);

  const Alert = useAlert();

  const { majorToken, minorToken, imei } = useSelector((state: RootState) => ({
    majorToken: state.auth.majorToken as string,
    minorToken: state.auth.minorToken as string,
    imei: state.assets.staticData.entities[code]?.imei,
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
  const [loading, setLoading] = useState(true);
  const [playerState, setPlayerState] = useState({ playing: false, speed: 1 });
  const { playing, speed } = playerState;

  const handleEventPress = useCallback(
    (playbackEvent: PlaybackEvent | PlaybackPoint) => {
      const index = playbackData.findIndex((d) => d.id === playbackEvent.id);
      if (index > -1) {
        setPlaybackDataIndex(index);
        bottomSheet.current?.snapToIndex(0);
      }
    },
    []
  );

  const [slidingValue, setSlidingValue] = useState<number>();

  const handleSliderStart = useCallback((val: number) => {
    setSlidingValue(val);
  }, []);

  const slideTimeout = useRef<NodeJS.Timeout>(undefined);
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

  const lastFocusedPoint = useRef<PlaybackPoint | PlaybackEvent>(undefined);
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

  const [trips, setTrips] = useState<PlaybackTrip | null>();

  useEffect(() => {
    const loadTrips = async () => {
      try {
        if (!(imei && majorToken && minorToken)) {
          return;
        }
        const _trips = await getTripReport({
          MajorToken: majorToken,
          MinorToken: minorToken,
          DateFrom: from,
          DateTo: to,
          Imeis: [imei],
        });
        setTrips(_trips[0] || null);
      } catch (error) {
        // Failed to load trips
      }
    };
    loadTrips();
  }, []);

  const loadPlaybackData = async () => {
    if (playbackEvents.length && playbackHistory.length) {
      return;
    }
    try {
      setLoading(true);
      const _playbackData = await loadPlayback(
        minorToken,
        code,
        from,
        to,
        isIgnore
      );

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
          // Optimization failed, using unoptimized data
        }
      } else {
        setTimeout(() => {
          setPlaybackHistory(formattedPlaybackHistory);
        }, 100);
      }

      setPlaybackEvents(formattedPlaybackEvents);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Playback not loaded", "Please go back and try again.");
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
      features: (focusedPoint ? [focusedPoint] : playbackEvents).map(
        (event) => {
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
            properties: eventInfo.icon
              ? {
                  icon: eventInfo.icon,
                }
              : {},
          };
          return feature;
        }
      ),
    };

    return shape;
  }, [playbackEvents, focusedPoint]);

  const [speedPopUpPosition, setSpeedPopUpPostion] = useState<
    "bottomRight" | "topRight"
  >("bottomRight");
  const handleBottomSheetChange = useCallback((index: number) => {
    if (index > 1) {
      setSpeedPopUpPostion("topRight");
    } else {
      setSpeedPopUpPostion("bottomRight");
    }
  }, []);

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
            {/* @ts-ignore */}
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
              thumbTintColor="white"
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
            position={speedPopUpPosition}
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

        {coordinates.length >= 2 && (
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

        {/* {focusedPoint && (
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
        )} */}
      </AppMap>

      <BottomSheet
        activeOffsetY={[-1, 1]}
        failOffsetX={[-5, 5]}
        ref={bottomSheet}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: colors.background }}
        style={{
          backgroundColor: colors.background,
          borderTopRightRadius: BORDER_RADIUS_MD,
          borderTopLeftRadius: BORDER_RADIUS_MD,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.white }}
        onChange={handleBottomSheetChange}
      >
        {renderEventPlayer()}

        <AssetPlaybackTabs
          playbackEvents={playbackEvents}
          playbackPoints={playbackHistory}
          trips={trips}
          onEventPress={handleEventPress}
          from={route.params.from}
          to={route.params.to}
          assetId={route.params.code}
        />
      </BottomSheet>

      {loading && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: `${colors.background}30`,
              alignItems: "center",
              paddingTop: insets.top + getHeaderHeight() + spacing("lg"),
            },
          ]}
        >
          <View
            style={{
              borderRadius: BORDER_RADIUS_MD,
              backgroundColor: colors.surface,
              padding: spacing("md"),
            }}
          >
            <ActivityIndicator color={colors.primary} />
          </View>
        </View>
      )}
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
    lineCap: "round" as const,
    lineJoin: "round" as const,
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
