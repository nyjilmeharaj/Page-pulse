# Page Pulse — Web-Based URL Auditor

Page Pulse is a lightweight, high-performance Node.js web service that audits public web pages for SEO health and content metrics.

## 🚀 Live Demo & Submission Resources
- **Live Application:** https://page-pulse-tt50.onrender.com
- **GitHub Repository:** https://github.com/nyjilmeharaj/Page-pulse
- **Video Walkthrough & Submission Folder:** https://drive.google.com/file/d/1NGwGPAQlQfslTNoRh1rFfW08o2SMZiYe/view?usp=drivesdk

---

## 🛠️ Setup & Local Installation

### Prerequisites
- Node.js (v18 or higher)
- npm

### Quick Start
1. Clone the repository:
   ```bash
      git clone [https://github.com/nyjilmeharaj/Page-pulse.git](https://github.com/nyjilmeharaj/Page-pulse.git)
         cd Page-pulse
 ## 📡 API Contract

 ### `POST /api/audit`

 Audits a target web page URL and returns DOM and HTTP performance metrics.

 #### **Request Header**
 - `Content-Type: application/json`

 #### **Request Body**
 ```json
 {
   "url": "https://example.com"
   }
   ```

   #### **Success Response (`200 OK`)**
   ```json
   {
     "url": "http://example.com",
       "httpStatus": 200,
         "responseTimeMs": 142,
           "title": "Example Domain",
             "metaDescription": "",
               "h1Count": 1,
                 "imagesMissingAlt": 0,
                   "totalImages": 0,
                     "wordCount": 11
                     }
                     ```
                             