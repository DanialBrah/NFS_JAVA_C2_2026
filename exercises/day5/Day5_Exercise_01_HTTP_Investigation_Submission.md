# Day 5 Exercise 5.1: HTTP Investigation — Submission

Mock API used: `rest-basics/mock-api.js` (run with `node mock-api.js`, listening on `http://localhost:8081`), tested with the requests in `rest-basics/requests.http` via the VS Code REST Client.

---

## Investigation Table

| Method | URL | Status Code | Response Type | What Happened? |
|---|---|---:|---|---|
| GET | /api/health | 200 | Single object | The server is running and reachable. Returns a small status object (`{"status":"UP","service":"day-5-mock-api"}`) confirming the API is healthy before testing anything else. |
| GET | /api/course-offerings | 200 | List | Returned a JSON array of all 2 existing course offerings (CO001, CO002). This is a successful "get all" request — no filtering, no ID needed. |
| GET | /api/course-offerings/CO001 | 200 | Single object | Requested a specific course offering by its ID. The ID exists in the data, so the server found a match and returned that one object with full details (title, instructor, start date, capacity, status). |
| GET | /api/course-offerings/C999 | 404 | Error object | Requested a course offering ID that does not exist in the data (`C999`, and note the real IDs use a `CO` prefix like `CO001`, not `C001`). The server could not find a match, so it returned a 404 with a message body explaining the resource was not found, instead of any course data. |
| POST | /api/course-offerings | 201 | Single object | Sent a valid new course offering (title, instructor, start date, and a valid positive integer capacity). The server validated the payload, accepted it, generated a new ID (`CO003`), defaulted `status` to `"OPEN"`, and returned the newly created object. 201 specifically means "Created", not just "OK". |
| POST | /api/course-offerings | 400 | Error object | Sent a payload with empty strings for `courseTitle`, `instructorName`, `startDate` and `capacity` of `0`. Server-side validation rejected all four fields and returned a 400 Bad Request with a `message` plus an `errors` array listing exactly which fields failed and why. Nothing was created. |

---

## Answers to Questions

**1. Which request returned a successful list response?**
`GET /api/course-offerings` returned a 200 status with a JSON array (list) of all course offerings.

**2. Which request returned a not-found response?**
`GET /api/course-offerings/C999` returned a 404 status because no course offering with that ID exists in the data.

**3. Which request returned a validation error?**
`POST /api/course-offerings` with empty `courseTitle`, `instructorName`, `startDate`, and `capacity: 0` returned a 400 status with a list of field-level validation errors.

**4. What is the difference between a successful response and an error response?**
A successful response has a 2xx status code (200 for a read that found data, 201 for a create that succeeded) and the response body contains the actual resource data the client asked for or just created. An error response has a 4xx (or 5xx) status code and the body does not contain resource data — instead it contains a `message` (and sometimes an `errors` array) describing *why* the request failed, so the client can understand and react to the problem instead of trying to use nonexistent data.

**5. Why is the status code important for frontend developers?**
The status code lets the frontend decide how to handle the response *before* even looking at the body. A 200/201 tells the frontend "the body contains good data, render it or confirm success to the user." A 404 tells the frontend "show a not-found message, don't try to parse course data out of this body." A 400 tells the frontend "the user's input was invalid, read the `errors` array and show it next to the relevant form fields." Without checking the status code first, the frontend can't safely branch its logic, and a bug could crash the UI by trying to read data out of an error body, or silently fail by treating an error as success.

---

## Reflection

Testing the raw HTTP requests before writing any JavaScript made it clear that the status code, not just the response body, is what actually drives frontend logic. Two responses can look similar in shape (both JSON objects with a `message` field, for example) but the status code is what tells you whether that message describes success or failure. I understand better now that REST isn't just "the server sends JSON back" — it's a structured conversation where the method, URL, status code, and body each carry a specific, separate piece of meaning, and a frontend needs to read all of them together, not just the body.
