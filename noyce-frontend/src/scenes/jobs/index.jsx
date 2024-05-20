import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { getJobs } from "../../data/api";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Jobs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [filters, setFilters] = useState({});

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    console.log(newPageSize);
    setPageSize(newPageSize);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [event.target.name]: event.target.value,
    }));
  };
  const handleDateChange = (name, date) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : null;
    console.log(formattedDate);

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: formattedDate,
    }));
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getJobs(page * pageSize, pageSize, filters);
        setJobs(data.jobs);
        setRowCount(data.total_count);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [page, pageSize, filters]);

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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box m="20px">
        <Header
          title="Jobs"
          subtitle="List of all the jobs made by the team members."
        />
        <Box
          display="flex"
          mb={2}
          flexDirection="column"
          alignItems="flex-start"
        >
          <Typography variant="h6" gutterBottom>
            Request Filters
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap="10px" mb={2}>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                label="Status"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="succeeded">succeeded</MenuItem>
                <MenuItem value="cancelled">cancelled</MenuItem>
                <MenuItem value="ready">ready</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Type</InputLabel>

              <Select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                label="Type"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"offboarding"}>offboarding</MenuItem>
                <MenuItem value={"onboarding"}>onboarding</MenuItem>
                <MenuItem value={"uncharge"}>moving</MenuItem>
                <MenuItem value={"charging"}>charging</MenuItem>
                <MenuItem value={"storing"}>storing</MenuItem>
                <MenuItem value={"retrieval"}>retrieval</MenuItem>
                <MenuItem value={"sleeping"}>sleeping</MenuItem>
                <MenuItem value={"unplugging"}>unplugging</MenuItem>
              </Select>
            </FormControl>
            <DatePicker
              label="Start Date"
              value={filters.startDate ? dayjs(filters.startDate) : null}
              onChange={(date) => handleDateChange("startDate", date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ minWidth: 200, marginBottom: 2 }}
                />
              )}
            />
            <DatePicker
              label="End Date"
              value={filters.endDate ? dayjs(filters.endDate) : null}
              onChange={(date) => handleDateChange("endDate", date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ minWidth: 200, marginBottom: 2 }}
                />
              )}
            />
          </Box>
        </Box>
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
            rows={jobs}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            pageSize={pageSize}
            rowsPerPageOptions={[10, 20, 50]}
            rowCount={rowCount}
            pagination
            paginationMode="server"
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            disableColumnFilter
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Jobs;
