import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { getRequestJobs } from "../../data/api";
import { useLocation } from "react-router-dom";

const Job = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [requests, setRequests] = useState([]);
  const location = useLocation();
  const { requestId } = location.state;

  useEffect(() => {
    const fetchRequestJobs = async () => {
      try {
        const data = await getRequestJobs(requestId);
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequestJobs();
  }, [requestId]);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "status_history",
      headerName: "Status History",
      flex: 1,
      valueGetter: (params) => params.row.status_history.join(", "),
    },
    {
      field: "created_at",
      headerName: "Created At",
      flex: 1,
      valueGetter: (params) => new Date(params.row.created_at).toLocaleString(),
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      flex: 1,
      valueGetter: (params) => new Date(params.row.updated_at).toLocaleString(),
    },
    { field: "parent_id", headerName: "Parent ID", flex: 1 },
    { field: "execution_start", headerName: "Execution Start", flex: 1 },
    { field: "request_id", headerName: "Request ID", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header
        title="Jobs for Request"
        subtitle="List of all the jobs for the selected request."
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={requests}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pagination
        />
      </Box>
    </Box>
  );
};

export default Job;
