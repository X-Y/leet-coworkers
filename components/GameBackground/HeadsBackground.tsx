import { Box } from "@mantine/core";
import { useEffect, useState, createContext, useContext } from "react";
import { useQuery } from "react-query";
import { headPicsApi } from "../../lib/frontendApi";

const colWidth = 400;
const colHeight = 250;

const HeadsBackgroundContext = createContext({
  urls: [] as string[],
});

interface HeadProps {
  row: number;
  col: number;
}
const HeadItem = ({ row, col }: HeadProps) => {
  const { urls } = useContext(HeadsBackgroundContext);
  const num = row * 10 + col;
  const src = urls[num % urls.length];
  return <img src={src} />;
};

interface HeadsRowProps {
  rowNum: number;
  numHeads: number;
  push: boolean;
}
const HeadsRow = ({ rowNum, numHeads, push }: HeadsRowProps) => {
  return (
    <Box
      sx={{
        height: colHeight + "px",
        whiteSpace: "nowrap",
        marginLeft: push ? -colWidth / 2 + "px" : undefined,
      }}
    >
      {[...Array(numHeads)].map((_, id) => (
        <Box
          sx={{
            display: "inline-block",
            width: colWidth + "px",
          }}
          key={"col" + id}
        >
          <HeadItem row={rowNum} col={id} />
        </Box>
      ))}
    </Box>
  );
};

interface HeadsGridProps {}
const HeadsGrid = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const numCols = Math.ceil(width / colWidth) + 1;
  const numRows = Math.ceil(height / colHeight);

  return (
    <Box
      sx={{
        position: "fixed",
        height: "100vh",
        width: "100vw",
        padding: "10px",
      }}
    >
      {[...Array(numRows)].map((_, id) => (
        <HeadsRow
          rowNum={id}
          numHeads={numCols}
          key={"row" + id}
          push={!!(id % 2)}
        />
      ))}
    </Box>
  );
};

export const HeadsBackground = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);

  const headPics = useQuery("getHeadPics", headPicsApi, {
    staleTime: 600000,
  });

  if (!loaded || !headPics.data) return null;

  return (
    <HeadsBackgroundContext.Provider value={{ urls: headPics.data }}>
      <HeadsGrid />
    </HeadsBackgroundContext.Provider>
  );
};
