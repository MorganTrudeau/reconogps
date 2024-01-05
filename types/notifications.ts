import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { ReceivedNotification } from "react-native-push-notification";

export type DeviceNotification = ReceivedNotification & {
  title?: string;
};

export type FCMMessage = FirebaseMessagingTypes.RemoteMessage & {
  fcmMessageId?: string;
};
