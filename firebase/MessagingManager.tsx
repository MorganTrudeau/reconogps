import { useEffect, useRef } from "react";
import {
  getMessaging,
  requestPermission,
  getToken,
  onTokenRefresh,
  getInitialNotification,
  onMessage,
  onNotificationOpenedApp,
} from "@react-native-firebase/messaging";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
import { AppState, AppStateStatus, Platform } from "react-native";
import { FCMMessage } from "../types/notifications";
import { formatFCMMessage } from "../utils/notifications";
import { useTheme } from "../hooks/useTheme";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { registerToken } from "../redux/thunks/notifications";
import { setDeviceToken } from "../redux/reducers/notifications";

export const LOCAL_NOTIFICATION_CHANNEL = "local_notifications";

const MessagingManager = () => {
  const { colors } = useTheme();

  const isLoggedIn = useAppSelector((state) => !!state.auth.minorToken);
  const dispatch = useAppDispatch();

  // Listener unsubscribe functions
  const unsubscribeForeground = useRef<() => void>(undefined);
  const unsubscribeBackground = useRef<() => void>(undefined);
  const unsubscribeToken = useRef<() => void>(undefined);
  const recentMessages = useRef(new Set<string>());

  // Subscribe to notifications on login
  // Unsubscribe to notifications on logout and app quit
  useEffect(() => {
    if (isLoggedIn) {
      initiateMessaging();
    } else {
      stopMessaging();
    }
  }, [isLoggedIn]);

  let currentState = useRef(AppState.currentState);
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      appStateListener.remove();
    };
  }, []);

  const handleAppStateChange = (state: AppStateStatus) => {
    if (state !== currentState.current && state === "active") {
    }
    currentState.current = state;
  };

  // Request permissions
  // Subscribe to token
  // Handle initial token
  // Subscribe to foreground and background messages
  const initiateMessaging = async () => {
    if (Platform.OS === "android") {
      await notifee.createChannel({
        id: LOCAL_NOTIFICATION_CHANNEL,
        name: "Local Notifications",
        description: "A channel to show local notifications",
        importance: AndroidImportance.HIGH,
        sound: "default",
      });
    }

    await requestNotificationPermission();
    await manageToken();
    await handleInitialNotification();
    subscribeToForegroundMessages();
    subscribeToBackgroundNotifications();
  };

  // Request permission
  const requestNotificationPermission = async () => {
    if (Platform.OS === "web") {
      return;
    }
    try {
      if (Platform.OS === "android") {
        await notifee.requestPermission();
      } else {
        const messaging = getMessaging();
        await requestPermission(messaging);
      }
    } catch (error) {
      // Permission request failed
    }
  };

  // Get initial token and token updates and register token on database
  const manageToken = async (attempts = 0): Promise<void> => {
    const messaging = getMessaging();
    // Get initial token
    try {
      const token = await getToken(messaging);

      if (!token) {
        throw "missing_token";
      } else {
        dispatch(registerToken(token));
      }
    } catch (error) {
      if (attempts < 4) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return manageToken(attempts + 1);
      }
    }

    // Unsubscribe to current listener
    if (typeof unsubscribeToken.current === "function") {
      unsubscribeToken.current();
      unsubscribeToken.current = undefined;
    }
    // Listen to token updates
    unsubscribeToken.current = onTokenRefresh(messaging, (token) =>
      dispatch(registerToken(token))
    );
  };

  // Get initial notification on app first open
  const handleInitialNotification = async () => {
    if (Platform.OS === "web") {
      return;
    }

    const messaging = getMessaging();
    const initialNotification: FCMMessage | null =
      await getInitialNotification(messaging);

    !!initialNotification &&
      handleMessage(formatFCMMessage(initialNotification));
  };

  const subscribeToForegroundMessages = () => {
    // Unsubscribe current listener
    if (typeof unsubscribeForeground.current === "function") {
      unsubscribeForeground.current();
      unsubscribeForeground.current = undefined;
    }

    try {
      const messaging = getMessaging();
      // Subscribe to foreground messages
      unsubscribeForeground.current = onMessage(
        messaging,
        onForegroundMessage
      );
    } catch (error) {
      return;
    }

    // Subscribe to foreground notification tapped event
    notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.PRESS:
          if (detail.notification?.data) {
            handleMessage({ data: detail.notification.data });
          }
          break;
      }
    });
  };

  // Display local notification
  const onForegroundMessage = (remoteMessage: FCMMessage) => {
    if (!remoteMessage || remoteMessage.data?.["af-uinstall-tracking"]) {
      return;
    }

    const messageId = Platform.select({
      default: remoteMessage.messageId,
      web: remoteMessage.fcmMessageId,
    });

    const { data, notification } = remoteMessage;

    if (!notification) {
      return;
    }

    const { title, body } = notification;

    // Preventing duplicate messages
    if (messageId) {
      if (recentMessages.current.has(messageId)) {
        return;
      } else {
        recentMessages.current = recentMessages.current.add(messageId);
      }
    }

    notifee.displayNotification({
      id: messageId,
      title,
      body: body || "",
      data: { ...data, localNotification: "true" },
      android: {
        channelId: LOCAL_NOTIFICATION_CHANNEL,
        smallIcon: "ic_notification",
        pressAction: {
          id: "default",
        },
        color: colors.primary,
        importance: AndroidImportance.HIGH,
      },
    });
  };

  const subscribeToBackgroundNotifications = () => {
    if (Platform.OS === "web") {
      return;
    }
    // Unsubscribe current listener
    if (typeof unsubscribeBackground.current === "function") {
      unsubscribeBackground.current();
      unsubscribeBackground.current = undefined;
    }
    const messaging = getMessaging();
    // Subscribe to background messages
    unsubscribeBackground.current = onNotificationOpenedApp(
      messaging,
      (remoteMessage: FCMMessage) =>
        handleMessage(formatFCMMessage(remoteMessage))
    );
  };

  // Handle message event
  const handleMessage = async (message: any) => {
    const { data } = message;
  };

  // Unsubscribe to background and foreground messages
  // Unsubscribe to token updates
  // Delete token on firebase and database
  const stopMessaging = () => {
    if (unsubscribeForeground.current) {
      unsubscribeForeground.current();
      unsubscribeForeground.current = undefined;
    }
    if (unsubscribeBackground.current) {
      unsubscribeBackground.current();
      unsubscribeBackground.current = undefined;
    }
    if (unsubscribeToken.current) {
      unsubscribeToken.current();
      unsubscribeToken.current = undefined;
    }
    dispatch(setDeviceToken(""));
  };

  // Not rendering any component
  return null;
};

export default MessagingManager;
