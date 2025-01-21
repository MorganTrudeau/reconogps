import { useEffect, useRef } from "react";
import messaging from "@react-native-firebase/messaging";
import { AppState, AppStateStatus, Platform } from "react-native";
import PushNotification, { Importance } from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { requestNotifications } from "react-native-permissions";
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

  const { isLoggedIn } = useAppSelector((state) => ({
    isLoggedIn: !!state.auth.minorToken,
  }));
  const dispatch = useAppDispatch();

  // Listener unsubscribe functions
  const unsubscribeForeground = useRef<() => void>();
  const unsubscribeBackground = useRef<() => void>();
  const unsubscribeToken = useRef<() => void>();
  const recentMessages = useRef(new Set<string>());

  // Called once on app first mount
  // Register device for remote notifications
  // Unregister device to notifications on app dismount
  useEffect(() => {
    if (Platform.OS !== "web") {
      messaging().registerDeviceForRemoteMessages();
    }
  }, []);

  const handleMessagingLifecycle = async () => {
    if (isLoggedIn) {
      initiateMessaging();
    } else {
      stopMessaging();
    }
  };

  // Subscribe to notifications on login
  // Unsubscribe to notifications on logout and app quit
  useEffect(() => {
    handleMessagingLifecycle();
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
      PushNotification.createChannel(
        {
          channelId: LOCAL_NOTIFICATION_CHANNEL, // (required)
          channelName: "Local Notifications", // (required)
          channelDescription: "A channel to show local notifications", // (optional) default: undefined.
          playSound: false, // (optional) default: true
          soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
          importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        (created) => {
          console.log("Channel created", created);
        }
      );
    }

    await requestPermission();
    await manageToken();
    await handleInitialNotification();
    subscribeToForegroundMessages();
    subscribeToBackgroundNotifications();
    clearChatNotifications();
  };

  // Request permission (require only for IOS)
  const requestPermission = () => {
    if (Platform.OS === "web") {
      return;
    }
    try {
      if (Platform.OS === "android") {
        return requestNotifications(["alert", "badge", "sound"]);
      } else {
        return messaging().requestPermission();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Get initial token and token updates and register token on database
  const manageToken = async (attempts = 0): Promise<void> => {
    // Get initial token
    try {
      const token = await messaging().getToken();

      if (!token) {
        throw "missing_token";
      } else {
        console.log("Messaging token found!");
        dispatch(registerToken(token));
      }
    } catch (error) {
      console.log("Manage token error", error);
      if (attempts < 4) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return manageToken(attempts + 1);
      }
    }

    // Unsubscribe to current listener
    if (typeof unsubscribeToken.current === "function") {
      unsubscribeToken.current();
    }
    // Listen to token updates
    unsubscribeToken.current = messaging().onTokenRefresh(registerToken);
  };

  // Get initial token on app first open
  const handleInitialNotification = async () => {
    if (Platform.OS === "web") {
      return;
    }

    const initialNotification: FCMMessage | null =
      await messaging().getInitialNotification();

    !!initialNotification &&
      handleMessage(formatFCMMessage(initialNotification));
  };

  const subscribeToForegroundMessages = () => {
    // Unsubscribe current listener
    if (typeof unsubscribeForeground.current === "function") {
      console.log("Unsubscribing from foreground notifications");
      unsubscribeForeground.current();
    }

    try {
      // Subscribe to foreground messages
      unsubscribeForeground.current =
        messaging().onMessage(onForegroundMessage);
      console.log("Subscribed to foreground notifications");
    } catch (error) {
      console.log("Forground notification subscription error", error);
      return;
    }

    // Subscribe to foreground message tapped event
    PushNotification.configure({
      // @ts-ignore
      onNotification: (notification: DeviceNotification) => {
        if (
          notification.data?.localNotification ||
          (notification.foreground && notification.userInteraction)
        ) {
          handleMessage(notification);
        }
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      popInitialNotification: false,
    });
  };

  // Display local notification
  const onForegroundMessage = (remoteMessage: FCMMessage) => {
    console.log("FOREGROUND MESSAGE", remoteMessage);

    if (!remoteMessage || remoteMessage.data?.["af-uinstall-tracking"]) {
      return;
    }
    const linkMessage = formatFCMMessage(remoteMessage);

    // @ts-ignore
    const { data, message, title, id } = linkMessage;
    const messageId = Platform.select({
      default: remoteMessage.messageId,
      web: remoteMessage.fcmMessageId,
    });

    // Preventing duplicate messages
    if (messageId) {
      if (recentMessages.current.has(messageId)) {
        return;
      } else {
        recentMessages.current = recentMessages.current.add(messageId);
      }
    }

    PushNotification.localNotification({
      channelId: LOCAL_NOTIFICATION_CHANNEL,
      title,
      message,
      userInfo: { ...data, id, localNotification: true },
      smallIcon: "ic_notification",
      color: colors.primary,
    });
  };

  const subscribeToBackgroundNotifications = () => {
    if (Platform.OS === "web") {
      return;
    }
    // Unsubscribe current listener
    if (typeof unsubscribeBackground.current === "function") {
      unsubscribeBackground.current();
    }
    // Subscribe to background messages
    unsubscribeBackground.current = messaging().onNotificationOpenedApp(
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
    !!unsubscribeForeground.current && unsubscribeForeground.current();
    !!unsubscribeBackground.current && unsubscribeBackground.current();
    !!unsubscribeToken.current && unsubscribeToken.current();
    dispatch(setDeviceToken(""));
  };

  // Clear notifications when app is active
  const clearNotifications = (notificationType: string) => {
    if (AppState.currentState === "background" || Platform.OS !== "ios") return;

    PushNotificationIOS.getDeliveredNotifications((notifications) => {
      let removedNotifications: string[] = [];
      notifications.forEach((notification) => {
        let currentNotificationType = notification.userInfo.type;
        if (currentNotificationType === notificationType) {
          removedNotifications.push(notification.identifier);
        }
      });
      PushNotificationIOS.removeDeliveredNotifications(removedNotifications);
    });
  };

  /**
   * To remove notifications.
   * Calls when user enter a chat.
   */
  const clearChatNotifications = (id?: string) => {
    if (Platform.OS !== "ios") return;

    PushNotificationIOS.getDeliveredNotifications((notifications) => {
      let removedNotifications: string[] = [];
      let clearBadge = true;
      notifications.forEach((notification) => {
        const chatId = notification.userInfo.chatId;
        if (typeof chatId === "string") {
          if (chatId && chatId === id) {
            removedNotifications.push(notification.identifier);
          } else if (
            notification.userInfo?.type === "announcement_added" ||
            notification.userInfo?.type === "chat_message_received"
          ) {
            clearBadge = false;
          }
        }
      });
      if (removedNotifications.length) {
        PushNotificationIOS.removeDeliveredNotifications(removedNotifications);
      }
      if (clearBadge) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });
  };

  // Not rendering any component
  return null;
};

export default MessagingManager;
