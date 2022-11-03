import React from "react";
import { Title, TitleProps } from "@mantine/core";
import { motion } from "framer-motion";

const GradientText = {
  variant: "gradient" as "gradient",
  gradient: {
    from: "white",
    to: "leetPurple.0",
    deg: 15,
  },
};

const TitleText: React.FC<TitleProps> = ({ children, ...otherProps }) => {
  return (
    <Title align="center" size={60} {...GradientText} {...otherProps}>
      {children}
    </Title>
  );
};

const _MotionTitleText = React.forwardRef((props, ref) => (
  <TitleText ref={ref} {...props} />
));

export const MotionTitleText = motion(_MotionTitleText);

export default TitleText;
