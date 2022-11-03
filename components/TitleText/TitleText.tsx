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

export default TitleText;
