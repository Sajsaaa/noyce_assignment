import { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import {
  getTotalRequests,
  getTotalJobs,
  getJobSuccessRate,
  getAverageExecutionTime,
  getGraphData,
  getSucessfulRequest,
  getSucessfulJobsTypes,
  getAllSucessfulRequestsTypes,
} from "../../data/api";
import { DocumentScannerRounded, Timelapse } from "@mui/icons-material";
import PieChart from "../../components/PieChart";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [totalRequests, setTotalRequests] = useState(0);
  const [successfulRequests, setSuccessfulRequests] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [jobSuccessRate, setJobSuccessRate] = useState(0);
  const [averageExecutionTime, setAverageExecutionTime] = useState(0);
  const [graphDataValues, setGraphData] = useState([]);
  const [sucessfulJobs, setSucessfulJobs] = useState({});
  const [sucessfulRequestTypes, setSucessfulRequestTypes] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  function transformDataFormat(data) {
    return [
      {
        id: "successful",
        color: tokens("dark").greenAccent[500],
        data: data.map((item) => ({
          x: item.interval_end.replace("2024-", ""),
          y: item.successful_requests,
        })),
      },
      {
        id: "cancelled",
        color: tokens("dark").blueAccent[300],
        data: data.map((item) => ({
          x: item.interval_end.replace("2024-", ""),
          y: item.failed_requests,
        })),
      },
      {
        id: "total",
        color: tokens("dark").redAccent[200],
        data: data.map((item) => ({
          x: item.interval_end.replace("2024-", ""),
          y: item.total_requests,
        })),
      },
    ];
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          requestsData,
          jobsData,
          successRateData,
          averageExecutionTimeData,
          graphData,
          sucessfullRequestData,
          sucessfulJobsData,
          sucessfulRequestTypeData,
        ] = await Promise.all([
          getTotalRequests(),
          getTotalJobs(),
          getJobSuccessRate(),
          getAverageExecutionTime(),
          getGraphData(),
          getSucessfulRequest(),
          getSucessfulJobsTypes(),
          getAllSucessfulRequestsTypes(),
        ]);
        setTotalRequests(requestsData);
        setTotalJobs(jobsData);
        setJobSuccessRate(successRateData?.success_rate);
        setAverageExecutionTime(
          averageExecutionTimeData?.average_execution_time
        );
        setGraphData(transformDataFormat(graphData));
        setSuccessfulRequests(sucessfullRequestData.successful_requests);
        setSucessfulJobs(sucessfulJobsData);
        setSucessfulRequestTypes(sucessfulRequestTypeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentTime]);
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
    };

    updateTime();
    const intervalId = setInterval(updateTime, 3000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box></Box>
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          gridRow="span 1"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          rowGap="10px"
        >
          <StatBox
            title={totalRequests.total_requests}
            subtitle="Total Requests"
            progress="0.75"
            increase="+14%"
            icon={
              <DocumentScannerRounded
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
          <Box display="flex">
            <StatBox
              title={totalRequests.successful_requests}
              subtitle="Sucessful"
            />
            <StatBox
              title={totalRequests.failed_requests}
              subtitle="Cancelled"
            />
            <StatBox
              title={totalRequests.in_progress_requests}
              subtitle="Executing"
            />
            <StatBox title={totalRequests.queued_requests} subtitle="Queued" />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 1"
          rowGap={"10px"}
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalJobs.total_jobs}
            subtitle="Total Jobs"
            icon={
              <DocumentScannerRounded
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
          <Box display="flex">
            <StatBox title={totalJobs.successful_jobs} subtitle="Sucessful" />
            <StatBox title={totalJobs.failed_jobs} subtitle="Cancelled" />
            <StatBox title={totalJobs?.ready_jobs} subtitle="Ready" />
          </Box>
        </Box>
        {/* <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${Math.ceil(jobSuccessRate)} %`}
            subtitle="Job Success Rate"
            progress={jobSuccessRate / 100}
            icon={
              <CheckCircle
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box> */}
        <Box
          gridColumn="span 9"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Total Sucessful Requests Over Time
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {successfulRequests}
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart chartData={graphDataValues} isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 3"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={Math.ceil(averageExecutionTime) + " Minutes"}
            subtitle="Avg. Execution Time"
            progress="0.80"
            icon={
              <Timelapse
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Sucessful Jobs by Type
          </Typography>
          <Box height="250px" m="-20px 0 0 0">
            <PieChart chartData={sucessfulJobs} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Job Success Rate
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle progress={jobSuccessRate} size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {Math.ceil(jobSuccessRate * 100)}% Success Rate
            </Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sucessful Requests by Type
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart data={sucessfulRequestTypes} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default Dashboard;
