const request = require('supertest');
const axios = require('axios');
const app = require('./app');

jest.mock('axios');

describe('POST /api/audit', () => {

  afterEach(() => {
      jest.clearAllMocks();
        });

          // 1. Happy Path
            test('Happy Path: successfully audits a valid HTML page', async () => {
                const mockHtml = `
                      <!DOCTYPE html>
                            <html>
                                    <head>
                                              <title>Test Page Title</title>
                                                        <meta name="description" content="This is a test meta description." />
                                                                </head>
                                                                        <body>
                                                                                  <h1>Main Heading</h1>
                                                                                            <img src="pic1.jpg" alt="Valid alt text" />
                                                                                                      <img src="pic2.jpg" />
                                                                                                                <p>This is a sample paragraph with words to count.</p>
                                                                                                                        </body>
                                                                                                                              </html>
                                                                                                                                  `;

                                                                                                                                      axios.get.mockResolvedValueOnce({
                                                                                                                                            status: 200,
                                                                                                                                                  headers: { 'content-type': 'text/html; charset=utf-8' },
                                                                                                                                                        data: mockHtml
                                                                                                                                                            });

                                                                                                                                                                const response = await request(app)
                                                                                                                                                                      .post('/api/audit')
                                                                                                                                                                            .send({ url: 'https://example.com' });

                                                                                                                                                                                expect(response.status).toBe(200);
                                                                                                                                                                                    expect(response.body).toEqual({
                                                                                                                                                                                          url: 'https://example.com',
                                                                                                                                                                                                httpStatus: 200,
                                                                                                                                                                                                      responseTimeMs: expect.any(Number),
                                                                                                                                                                                                            title: 'Test Page Title',
                                                                                                                                                                                                                  metaDescription: 'This is a test meta description.',
                                                                                                                                                                                                                        h1Count: 1,
                                                                                                                                                                                                                              imagesMissingAlt: 1,
                                                                                                                                                                                                                                    totalImages: 2,
                                                                                                                                                                                                                                          wordCount: 11
                                                                                                                                                                                                                                              });
                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                  // 2. Failure Case: Invalid URL
                                                                                                                                                                                                                                                    test('Failure Case: returns 400 Bad Request for malformed URL input', async () => {
                                                                                                                                                                                                                                                        const response = await request(app)
                                                                                                                                                                                                                                                              .post('/api/audit')
                                                                                                                                                                                                                                                                    .send({ url: 'invalid-url-format' });

                                                                                                                                                                                                                                                                        expect(response.status).toBe(400);
                                                                                                                                                                                                                                                                            expect(response.body).toHaveProperty('error');
                                                                                                                                                                                                                                                                                expect(response.body.error).toContain('Invalid URL format');
                                                                                                                                                                                                                                                                                  });

                                                                                                                                                                                                                                                                                    // 3. Failure Case: Non-HTML Response
                                                                                                                                                                                                                                                                                      test('Failure Case: returns 415 Unsupported Media Type for non-HTML endpoints', async () => {
                                                                                                                                                                                                                                                                                          axios.get.mockResolvedValueOnce({
                                                                                                                                                                                                                                                                                                status: 200,
                                                                                                                                                                                                                                                                                                      headers: { 'content-type': 'application/json' },
                                                                                                                                                                                                                                                                                                            data: { key: 'value' }
                                                                                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                                                                                    const response = await request(app)
                                                                                                                                                                                                                                                                                                                          .post('/api/audit')
                                                                                                                                                                                                                                                                                                                                .send({ url: 'https://example.com/api/data' });

                                                                                                                                                                                                                                                                                                                                    expect(response.status).toBe(415);
                                                                                                                                                                                                                                                                                                                                        expect(response.body.error).toContain('non-HTML content type');
                                                                                                                                                                                                                                                                                                                                          });

                                                                                                                                                                                                                                                                                                                                            // 4. Failure Case: Request Timeout
                                                                                                                                                                                                                                                                                                                                              test('Failure Case: returns 504 Gateway Timeout when upstream server times out', async () => {
                                                                                                                                                                                                                                                                                                                                                  const timeoutError = new Error('timeout of 8000ms exceeded');
                                                                                                                                                                                                                                                                                                                                                      timeoutError.code = 'ECONNABORTED';

                                                                                                                                                                                                                                                                                                                                                          axios.get.mockRejectedValueOnce(timeoutError);

                                                                                                                                                                                                                                                                                                                                                              const response = await request(app)
                                                                                                                                                                                                                                                                                                                                                                    .post('/api/audit')
                                                                                                                                                                                                                                                                                                                                                                          .send({ url: 'https://slow-website.com' });

                                                                                                                                                                                                                                                                                                                                                                              expect(response.status).toBe(504);
                                                                                                                                                                                                                                                                                                                                                                                  expect(response.body.error).toContain('timed out');
                                                                                                                                                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                                                                                                                                                    