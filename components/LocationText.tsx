import React, { useEffect, useState } from "react";
import AppText from "./Core/AppText";
import Placeholder from "./Placeholder";
import { geocodeLatLong } from "../api/position";
import { TextProps, ViewProps } from "react-native";

const defaultViewProps = {};
const defaultTextProps = {};

export const AddressText = ({
  lat,
  lng,
  textProps = defaultTextProps,
  viewProps = defaultViewProps,
}: {
  lat: number | string;
  lng: number | string;
  textProps?: TextProps;
  viewProps?: ViewProps;
}) => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    const getAddress = async (lat: number, lng: number) => {
      try {
        const address = await geocodeLatLong(lat, lng);
        setAddress(address);
      } catch (error) {
        console.log("Failed to find address: ", error);
      }
    };

    if (lat && lng) {
      getAddress(Number(lat), Number(lng));
    }
  }, [lat, lng]);

  return (
    <Placeholder loading={!address} height={15} {...viewProps}>
      <AppText {...textProps}>{address}</AppText>
    </Placeholder>
  );
};
