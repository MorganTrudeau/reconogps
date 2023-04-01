import React, { useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Modalize } from "react-native-modalize";
import { useAlert } from "../../hooks/useAlert";
import { useTheme } from "../../hooks/useTheme";
import { BORDER_RADIUS_SM, iconSize, spacing } from "../../styles";
import {
  AssetActivationEntry,
  AssetActivationFormData,
  AssetActivationInfo,
} from "../../types";
import {
  getAssetSolutionName,
  getAssetTypeIcon,
  sortAssetTypes,
} from "../../utils/assets";
import AppButton from "../Core/AppButton";
import AppCheckBox from "../Core/AppCheckBox";
import AppIcon from "../Core/AppIcon";
import AppText from "../Core/AppText";
import AppTextInput from "../Core/AppTextInput";
import AssetTypeSelectModal from "./AssetTypeSelectModal";

type Props = {
  activationInfo: AssetActivationInfo;
  initialFormData?: AssetActivationFormData | null;
  onSubmit: (activationEntry: AssetActivationEntry) => void;
  containerStyle?: ViewStyle;
};

const AddAssetForm = ({
  activationInfo,
  initialFormData,
  onSubmit,
  containerStyle,
}: Props) => {
  const { theme, colors } = useTheme();
  const Alert = useAlert();

  const assetTypeSelect = useRef<Modalize>(null);

  const productName = useMemo(() => {
    if (activationInfo.ssp.Products.length === 0) {
      return "";
    }
    const product = activationInfo.ssp.Products[0];
    return product.Name;
  }, [activationInfo.ssp.Products]);

  const sortedAssetTypes = useMemo(() => {
    if (!Array.isArray(activationInfo.ssp.AssetTypes)) {
      return [];
    }
    return sortAssetTypes(activationInfo.ssp.AssetTypes);
  }, [activationInfo.ssp.AssetTypes]);

  const sortedSolutions = useMemo(() => {
    const order = ["QProtect", "Loc8", "Track"];
    return activationInfo.ssp.Solutions.sort((a, b) => {
      const indexA = order.indexOf(a.Code);
      const indexB = order.indexOf(b.Code);
      if (indexA === -1) {
        return 1;
      }
      if (indexB === -1) {
        return -1;
      }
      return indexA - indexB;
    });
  }, [activationInfo.ssp.Solutions]);

  const [formData, setFormData] = useState<AssetActivationFormData>(
    initialFormData || {
      name: activationInfo.asset.IMEI,
      solution:
        activationInfo.ssp.Solutions.length === 1
          ? activationInfo.ssp.Solutions[0].Code
          : "",
      make: "",
      model: "",
      color: "",
      year: "",
      type: sortedAssetTypes[0] || "",
    }
  );
  const [formErrors, setFormErrors] = useState<{
    [Property in keyof AssetActivationFormData]: boolean;
  }>({
    solution: false,
    name: false,
    make: false,
    model: false,
    color: false,
    year: false,
    type: false,
  });

  const updateFormData =
    (key: keyof AssetActivationFormData) => (val: string) => {
      setFormData((data) => ({ ...data, [key]: val }));
    };

  const handleSubmit = () => {
    const errors = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        return { ...acc, [key]: !value };
      },
      {} as {
        [Property in keyof AssetActivationFormData]: boolean;
      }
    );

    setFormErrors(errors);

    if (Object.values(errors).find((error) => !!error)) {
      return Alert.alert(
        "Form Incomplete",
        "Please complete all fields before submitting."
      );
    }

    onSubmit({ info: activationInfo, formData });
  };

  return (
    <View style={containerStyle}>
      <AppText style={theme.textSmallMeta}>GPS Model</AppText>
      <AppText
        style={[
          theme.titleLarge,
          { marginBottom: spacing("md"), marginTop: spacing("xs") },
        ]}
      >
        {productName}
      </AppText>

      <AppText style={[theme.titleMeta, { marginBottom: spacing("sm") }]}>
        Solutions
      </AppText>
      {sortedSolutions.map((solution, index) => {
        if (solution.Code === "Deactivate") {
          return null;
        }
        return (
          <Pressable
            key={`${solution.Code}-${index}`}
            onPress={() => {
              updateFormData("solution")(solution.Code);
            }}
            style={[
              styles.solution,
              { backgroundColor: colors.surface },
              index !== activationInfo.ssp.Solutions.length - 1 && {
                marginBottom: spacing("sm"),
              },
            ]}
          >
            <AppText style={[theme.title, { flex: 1 }]}>
              {getAssetSolutionName(solution)}
            </AppText>
            <AppCheckBox
              {...{ theme, colors }}
              value={formData.solution === solution.Code}
            />
          </Pressable>
        );
      })}

      <AppText
        style={[
          theme.titleMeta,
          { marginTop: spacing("xl"), marginBottom: spacing("sm") },
        ]}
      >
        Asset Details
      </AppText>

      <Pressable
        onPress={() => assetTypeSelect.current?.open()}
        style={[styles.assetType, { backgroundColor: colors.surface }]}
      >
        <AppText style={[theme.title, { flex: 1 }]}>{formData.type}</AppText>
        <AppIcon
          name={getAssetTypeIcon(formData.type)}
          size={iconSize("lg")}
          color={colors.primary}
        />
      </Pressable>

      <AppTextInput
        placeholder={"Name"}
        onChangeText={updateFormData("name")}
        value={formData.name}
        onFocus={() => {
          if (formData.name === activationInfo.asset.IMEI) {
            updateFormData("name")("");
          }
        }}
        error={formErrors.name}
      />
      <AppTextInput
        placeholder={"Make"}
        onChangeText={updateFormData("make")}
        value={formData.make}
        error={formErrors.make}
      />
      <AppTextInput
        placeholder={"Model"}
        onChangeText={updateFormData("model")}
        value={formData.model}
        error={formErrors.model}
      />
      <AppTextInput
        placeholder={"Color"}
        onChangeText={updateFormData("color")}
        value={formData.color}
        error={formErrors.color}
      />
      <AppTextInput
        placeholder={"Year"}
        onChangeText={updateFormData("year")}
        value={formData.year}
        error={formErrors.year}
      />

      <AppButton
        title={"Confirm Asset Details"}
        style={{ marginTop: spacing("xl") * 2 }}
        onPress={handleSubmit}
      />

      <AssetTypeSelectModal
        ref={assetTypeSelect}
        assetTypes={sortedAssetTypes}
        onTypeChange={(type) => {
          updateFormData("type")(type);
          assetTypeSelect.current?.close();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  solution: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing("lg"),
    borderRadius: BORDER_RADIUS_SM,
  },
  assetType: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing("lg"),
    borderRadius: BORDER_RADIUS_SM,
  },
});

export default AddAssetForm;
