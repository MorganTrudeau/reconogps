import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";

export type FCMMessage = FirebaseMessagingTypes.RemoteMessage & {
  fcmMessageId?: string;
};
