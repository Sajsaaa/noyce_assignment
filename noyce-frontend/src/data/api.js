import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export const getRequests = async (skip = 0, limit = 10, filters = {}) => {
  console.log(skip, limit, filters);
  try {
    const response = await axios.get(`${BASE_URL}/requests`, {
      params: { skip, limit, ...filters },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
};

export const createRequest = async (request) => {
  try {
    const response = await axios.post(`${BASE_URL}/requests`, request);
    return response.data;
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
};

export const getRequest = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/requests/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching request:", error);
    throw error;
  }
};

export const getRequestJobs = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/requests/${id}/jobs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching request:", error);
    throw error;
  }
};

export const getJobs = async (skip = 0, limit = 10, filters = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs`, {
      params: { skip, limit, ...filters },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const createJob = async (job) => {
  try {
    const response = await axios.post(`${BASE_URL}/jobs`, job);
    return response.data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

export const getJob = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
};

export const getTotalRequests = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/analytics/total_requests`);
    return response.data;
  } catch (error) {
    console.error("Error fetching total requests:", error);
    throw error;
  }
};

export const getTotalJobs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/analytics/total_jobs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching total jobs:", error);
    throw error;
  }
};

export const getJobSuccessRate = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/analytics/job_success_rate`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job success rate:", error);
    throw error;
  }
};

export const getAverageExecutionTime = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/analytics/average_execution_time`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching average execution time:", error);
    throw error;
  }
};

export const getGraphData = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/analytics/request_counts_last_six_months`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching graph data:", error);
    throw error;
  }
};

export const getSucessfulRequest = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/analytics/sucessful_requests`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching sucessfull requests:", error);
    throw error;
  }
};

export const getSucessfulJobsTypes = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/analytics/successful_jobs_per_type`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching sucessfull jobs:", error);
    throw error;
  }
};

export const getAllSucessfulRequestsTypes = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/analytics/successful_requests_per_type`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching sucessfull jobs:", error);
    throw error;
  }
};
