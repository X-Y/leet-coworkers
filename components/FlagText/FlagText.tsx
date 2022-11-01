import { Text, Title, TitleProps } from "@mantine/core";
import React from "react";
import { useEffect, useRef } from "react";

interface Props extends TitleProps {}

const minmax = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const defaultGradient = {
  from: "leetGreen.6",
  to: "leetPurple.4",
  deg: 15,
};
const FlagText: React.FC<Props> = ({
  size,
  weight,
  gradient = defaultGradient,
  children,
  ...otherProps
}) => {
  const ref = useRef<HTMLHeadingElement>(null);

  function getMiddlePoint() {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      return { x: (rect?.x + rect?.width) / 2, y: (rect.y + rect.height) / 2 };
    }
    return null;
  }

  function drawShadow(width: number, height: number) {
    if (!ref.current?.style) {
      return;
    }
    ref.current.style.filter = `drop-shadow(${width}px ${height}px 0 black)`;
  }

  function onMouseMove(e: MouseEvent) {
    const midPoint = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    const shadow = {
      x: ((midPoint.x - e.clientX) / (window.innerWidth - midPoint.x)) * 16,
      y: ((midPoint.y - e.clientY) / (window.innerHeight - midPoint.y)) * 14,
    };

    window.requestAnimationFrame(() => {
      drawShadow(shadow.x, shadow.y);
    });
  }
  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <Title
      size={size}
      weight={weight}
      variant="gradient"
      gradient={gradient}
      ref={ref}
      {...otherProps}
    >
      {children}
    </Title>
  );
};

export default FlagText;
