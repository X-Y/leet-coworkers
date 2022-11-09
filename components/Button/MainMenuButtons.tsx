import { Button, ButtonProps, MediaQuery } from "@mantine/core";
import type { PolymorphicComponentProps } from "@mantine/utils";

export const MainButton: React.FC<
  PolymorphicComponentProps<"button", ButtonProps>
> = ({ children, ...otherProps }) => {
  return (
    <Button color="leetGreen" size="xl" {...otherProps}>
      {children}
    </Button>
  );
};

export const SubButton: React.FC<
  PolymorphicComponentProps<"button", ButtonProps>
> = ({ children, ...otherProps }) => {
  return (
    <Button color="leetGreen.1" size="sm" {...otherProps}>
      {children}
    </Button>
  );
};
