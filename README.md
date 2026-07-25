# Page Pulse ⚡

Page Pulse is a lightweight web application that audits any URL for response latency, HTTP health, key SEO tags, and image accessibility.

## Setup & Running Locally

### Prerequisites
- Node.js (v16.x or later)

### Steps
1. Install dependencies:
   ```bash
      npm install
         ```
         2. Run unit tests:
            ```bash
               npm test
                  ```
                  3. Start local server:
                     ```bash
                        npm start
                           ```

                           ## API Contract

                           ### `POST /api/audit`

                           #### Request
                           ```json
                           { "url": "[https://example.com](https://example.com)" }
                           ```

                           #### Success Response (`200 OK`)
                           ```json
                           {
                             "url": "[https://example.com](https://example.com)",
                               "httpStatus": 200,
                                 "responseTimeMs": 184,
                                   "title": "Example Domain",
                                     "metaDescription": "Description text...",
                                       "h1Count": 1,
                                         "imagesMissingAlt": 0,
                                           "totalImages": 0,
                                             "wordCount": 35
                                             }
                                             ```

                                             ## Key Design Decisions

                                             1. **DOM Cleaning for Word Count:** Clones DOM and strips `<script>`, `<style>`, `<noscript>`, and `<svg>` elements before counting text to prevent counting CSS or JS variables.
                                             2. **8-Second Timeout Guard:** Bounded upstream HTTP calls with 8000ms timeouts to handle slow servers gracefully (`504 Gateway Timeout`).
                                             3. **URL Normalization:** Preprends `http://` to user input if protocol is missing before attempting parsing.
                                             