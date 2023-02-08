import { Button, ButtonProps, MediaQuery } from "@mantine/core";
import type { PolymorphicComponentProps } from "@mantine/utils";

import { MainButton, SubButton } from "../Button/MainMenuButtons";

export const ConfigStageMainButton: React.FC<
  PolymorphicComponentProps<"button", ButtonProps>
> = ({ children, ...otherProps }) => {
  return (
    <MediaQuery largerThan={"xs"} styles={{ maxWidth: "15rem" }}>
      <MainButton sx={{ width: "100%", margin: " auto" }} {...otherProps}>
        {children}
      </MainButton>
    </MediaQuery>
  );
};

export const ConfigStageSubButton: React.FC<
  PolymorphicComponentProps<"button", ButtonProps>
> = ({ children, ...otherProps }) => {
  return (
    <MediaQuery largerThan={"xs"} styles={{ maxWidth: "10rem" }}>
      <SubButton sx={{ width: "100%", margin: " auto" }} {...otherProps}>
        {children}
      </SubButton>
    </MediaQuery>
  );
};
