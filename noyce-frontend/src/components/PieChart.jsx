import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

const PieChart = ({ chartData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const PieData = [
    {
      id: "storing",
      label: "storing",
      value: chartData.storing,
      color: "hsl(110, 70%, 50%)",
    },
    {
      id: "sleeping",
      label: "sleeping",
      value: chartData.sleeping,
      color: "hsl(162, 70%, 50%)",
    },
    {
      id: "charging",
      label: "charging",
      value: chartData.charging,
      color: "hsl(291, 70%, 50%)",
    },
    {
      id: "retrieval",
      label: "retrieval",
      value: chartData.retrieval,
      color: "hsl(229, 70%, 50%)",
    },
    {
      id: "unplugging",
      label: "unplugging",
      value: chartData.unplugging,
      color: "hsl(349, 70%, 50%)",
    },
    {
      id: "onboarding",
      label: "onboarding",
      value: chartData.onboarding,
      color: "hsl(380, 70%, 50%)",
    },
    {
      id: "moving",
      label: "moving",
      value: chartData.moving,
      color: "hsl(320, 70%, 50%)",
    },
    {
      id: "offboarding",
      label: "offboarding",
      value: chartData.offboarding,
      color: "hsl(260, 70%, 50%)",
    },
  ];
  return (
    <ResponsivePie
      data={PieData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 8,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;
