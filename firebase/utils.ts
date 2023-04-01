import functions from "@react-native-firebase/functions";

export const configEmulator = () => {
  // const localIp = "192.168.1.69"; // Use for real device. Change localIp to computer's IP
  const localIp = "localhost"; // Use for emulator

  functions().useEmulator(localIp, 5001);
};
