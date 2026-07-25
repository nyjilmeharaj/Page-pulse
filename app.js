const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/audit', async (req, res) => {
  let { url } = req.body;

    if (!url || typeof url !== 'string' || url.trim() === '') {
        return res.status(400).json({ error: 'A valid URL string is required.' });
          }

            // Basic format check before adding protocol
              if (!url.includes('.') && !url.startsWith('localhost')) {
                  return res.status(400).json({ error: 'Invalid URL format. Please provide a well-formed URL.' });
                    }

                      if (!/^https?:\/\//i.test(url)) {
                          url = 'http://' + url;
                            }

                              try {
                                  new URL(url);
                                    } catch (err) {
                                        return res.status(400).json({ error: 'Invalid URL format. Please provide a well-formed URL.' });
                                          }

                                            const startTime = Date.now();

                                              try {
                                                  const response = await axios.get(url, {
                                                        timeout: 8000,
                                                              headers: {
                                                                      'User-Agent': 'PagePulseAuditor/1.0'
                                                                            }
                                                                                });

                                                                                    const responseTimeMs = Date.now() - startTime;
                                                                                        const contentType = response.headers['content-type'] || '';

                                                                                            if (!contentType.includes('text/html')) {
                                                                                                  return res.status(415).json({
                                                                                                          error: `URL returned non-HTML content type: ${contentType}`
                                                                                                                });
                                                                                                                    }

                                                                                                                        const dom = new JSDOM(response.data);
                                                                                                                            const document = dom.window.document;

                                                                                                                                // Extract Title
                                                                                                                                    const title = document.querySelector('title')?.textContent.trim() || '';

                                                                                                                                        // Extract Meta Description
                                                                                                                                            const metaDescElem = document.querySelector('meta[name="description"]');
                                                                                                                                                const metaDescription = metaDescElem ? metaDescElem.getAttribute('content') || '' : '';

                                                                                                                                                    // Count H1 tags
                                                                                                                                                        const h1Count = document.querySelectorAll('h1').length;

                                                                                                                                                            // Image Alt Analysis
                                                                                                                                                                const images = Array.from(document.querySelectorAll('img'));
                                                                                                                                                                    const totalImages = images.length;
                                                                                                                                                                        const imagesMissingAlt = images.filter(img => !img.hasAttribute('alt') || img.getAttribute('alt').trim() === '').length;

                                                                                                                                                                            // Word Count Calculation
                                                                                                                                                                                const bodyText = document.body ? document.body.textContent : '';
                                                                                                                                                                                    const words = bodyText.trim().split(/\s+/).filter(w => w.length > 0);
                                                                                                                                                                                        const wordCount = words.length;

                                                                                                                                                                                            return res.status(200).json({
                                                                                                                                                                                                  url,
                                                                                                                                                                                                        httpStatus: response.status,
                                                                                                                                                                                                              responseTimeMs,
                                                                                                                                                                                                                    title,
                                                                                                                                                                                                                          metaDescription,
                                                                                                                                                                                                                                h1Count,
                                                                                                                                                                                                                                      imagesMissingAlt,
                                                                                                                                                                                                                                            totalImages,
                                                                                                                                                                                                                                                  wordCount
                                                                                                                                                                                                                                                      });

                                                                                                                                                                                                                                                        } catch (error) {
                                                                                                                                                                                                                                                            if (error.code === 'ECONNABORTED') {
                                                                                                                                                                                                                                                                  return res.status(504).json({ error: 'Request timed out while fetching the URL.' });
                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                          return res.status(500).json({ error: 'Failed to fetch or parse the requested URL.' });
                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                            });

                                                                                                                                                                                                                                                                            module.exports = app;
                                                                                                                                                                                                                                                                            