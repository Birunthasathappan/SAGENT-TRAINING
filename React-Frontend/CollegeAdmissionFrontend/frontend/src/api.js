// ================================================================
// api.js
// All backend API calls are written here in one place.
// Change BASE_URL to match your Spring Boot server address.
// ================================================================

const BASE_URL = "http://localhost:8080";

// ---------------------------------------------------------------
// Helper function: sends HTTP requests and returns JSON response
// ---------------------------------------------------------------
async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  // Some endpoints return plain text (like delete messages)
  const text = await response.text();
  try {
    return JSON.parse(text); // try to parse as JSON
  } catch {
    return text; // return as plain text if not JSON
  }
}

// ---------------------------------------------------------------
// STUDENT APIs  →  /students
// ---------------------------------------------------------------

// Register a new student (POST /students)
export function registerStudent(data) {
  return request("/students", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Get all students (GET /students)
export function getAllStudents() {
  return request("/students");
}

// Get student by ID (GET /students/{id})
export function getStudentById(id) {
  return request(`/students/${id}`);
}

// ---------------------------------------------------------------
// OFFICER APIs  →  /officers
// ---------------------------------------------------------------

// Register a new officer (POST /officers)
export function registerOfficer(data) {
  return request("/officers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Get all officers (GET /officers)
export function getAllOfficers() {
  return request("/officers");
}

// ---------------------------------------------------------------
// COURSE APIs  →  /courses
// ---------------------------------------------------------------

// Get all courses (GET /courses)
export function getAllCourses() {
  return request("/courses");
}

// ---------------------------------------------------------------
// APPLICATION APIs  →  /applications
// ---------------------------------------------------------------

// Student applies for a course (POST /applications/{studentId}/{courseId})
export function applyForCourse(studentId, courseId) {
  return request(`/applications/${studentId}/${courseId}`, {
    method: "POST",
  });
}

// Get all applications - used by officer (GET /applications)
export function getAllApplications() {
  return request("/applications");
}

// Get one application by ID (GET /applications/{id})
export function getApplicationById(id) {
  return request(`/applications/${id}`);
}

// Officer updates status (PUT /applications/{id}/status?status=ACCEPTED)
export function updateApplicationStatus(applicationId, status) {
  return request(`/applications/${applicationId}/status?status=${status}`, {
    method: "PUT",
  });
}

// Pay fee for an application (POST /applications/{id}/payment?mode=UPI)
export function createPayment(applicationId, mode) {
  return request(`/applications/${applicationId}/payment?mode=${mode}`, {
    method: "POST",
  });
}

// Cancel (delete) an application (DELETE /applications/{id})
export function cancelApplication(applicationId) {
  return request(`/applications/${applicationId}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------
// DOCUMENT APIs  →  /documents
// ---------------------------------------------------------------

// Save document record (POST /documents)
// Note: actual file upload is not supported by the backend,
// so we save the document type and application ID as JSON.
export function saveDocument(data) {
  return request("/documents", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Get all documents (GET /documents)
export function getAllDocuments() {
  return request("/documents");
}
