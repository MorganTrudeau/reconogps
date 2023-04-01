import { useAppSelector } from "../hooks/useAppSelector";
import { useToast } from "../hooks/useToast";
import { useUpdated } from "../hooks/useUpdated";
import { Translations } from "../utils/translations";

const ToastManager = () => {
  const Toast = useToast();

  const errors = useAppSelector((state) => {
    const activeUser = state.activeUser;
    const assets = state.assets;
    const auth = state.auth;
    const contacts = state.contacts;
    const geofences = state.geofences;
    const sharedAssets = state.sharedAssets;

    const errorObj = {
      activeUserUpdate: activeUser.updateRequest.error,
      assetsStaticLoad: assets.staticLoadRequest.error,
      authLogin: auth.loginRequest.error,
      authLogout: auth.logoutRequest.error,
      authChangePassword: auth.changePasswordRequest.error,
      contactsAdd: contacts.addContactRequest.error,
      contactsDelete: contacts.deleteRequest.error,
      contactsLoad: contacts.loadRequest.error,
      geofencesLoad: geofences.loadRequest.error,
      sharedAssetsExtendExpiry: sharedAssets.extendExpiryRequest.error,
      sharedAssetsLoadMyShared: sharedAssets.loadMySharedAssetsRequest.error,
      sharedAssetsLoadSubscribed:
        sharedAssets.loadSubscribedAssetsRequest.error,
      sharedAssetsStartSharing: sharedAssets.startSharingAssetRequest.error,
      sharedAssetsStopSharing: sharedAssets.stopSharingAssetRequest.error,
      sharedAssetsSubscribe: sharedAssets.subscribeSharedAssetRequest.error,
      sharedAssetsUnsubscribe: sharedAssets.unsubscribeSharedAssetRequest.error,
    };

    return errorObj;
  });

  useUpdated(errors, (currentErrors, prevErrors) => {
    Object.entries(currentErrors).forEach(([key, val]) => {
      if (val && !prevErrors[key]) {
        Toast.show(Translations.errors.common);
      }
    });
  });

  return null;
};

export default ToastManager;
