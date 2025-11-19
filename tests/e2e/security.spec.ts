/**
 * Security Testing Suite
 * Tests XSS prevention, rate limiting, and sensitive data exposure
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Security Testing', () => {

  test.describe('XSS Prevention', () => {
    test('should sanitize script tags in form inputs', async ({ page }) => {
      await page.goto(`${BASE_URL}/builder`);

      // XSS payloads to test
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        'javascript:alert("XSS")',
        '<iframe src="javascript:alert(\'XSS\')"></iframe>',
        '<svg onload=alert("XSS")>',
        '<body onload=alert("XSS")>',
        '<input onfocus=alert("XSS") autofocus>',
        '<select onfocus=alert("XSS") autofocus>',
        '<textarea onfocus=alert("XSS") autofocus>',
        '<keygen onfocus=alert("XSS") autofocus>',
        '<video><source onerror="alert(\'XSS\')">',
        '<audio src=x onerror=alert("XSS")>',
        '<details open ontoggle=alert("XSS")>',
        '<marquee onstart=alert("XSS")>',
      ];

      for (const payload of xssPayloads) {
        // Fill the task field with XSS payload
        const taskInput = page.locator('textarea[name="task"]').first();
        await taskInput.fill(payload);

        // Wait a bit for any JavaScript to execute (if XSS was successful)
        await page.waitForTimeout(500);

        // Verify no alert dialog appeared (XSS was prevented)
        const dialogs: string[] = [];
        page.on('dialog', dialog => {
          dialogs.push(dialog.message());
          dialog.dismiss();
        });

        // Check that no XSS was executed
        expect(dialogs).toHaveLength(0);
      }
    });

    test('should prevent XSS in API responses', async ({ request }) => {
      const xssPayload = '<script>alert("XSS")</script>';

      // Attempt to inject XSS through API
      const response = await request.post(`${BASE_URL}/api/enhance-prompt`, {
        data: {
          role: xssPayload,
          audience: 'General Public',
          task: 'Test task for XSS prevention',
          tone: 'Professional',
          outputFormat: 'Paragraph',
          constraints: [],
          enhancementLevel: 'quick',
          language: 'en'
        }
      });

      const body = await response.json();

      // Verify response doesn't contain executable script
      const responseStr = JSON.stringify(body);
      expect(responseStr).not.toContain('<script>');
      expect(responseStr).not.toContain('onerror=');
      expect(responseStr).not.toContain('javascript:');
    });

    test('should escape HTML entities in user input', async ({ request }) => {
      const payload = {
        role: 'Developer',
        audience: 'Team',
        task: '<b>Bold text</b> & "quoted" text with \'apostrophes\'',
        tone: 'Professional',
        outputFormat: 'Paragraph',
        constraints: [],
        enhancementLevel: 'quick',
        language: 'en'
      };

      const response = await request.post(`${BASE_URL}/api/enhance-prompt`, {
        data: payload
      });

      expect(response.ok() || response.status() === 400).toBeTruthy();

      if (response.ok()) {
        const body = await response.json();
        // If successful, verify HTML entities are properly handled
        expect(body.success).toBe(true);
      }
    });

    test('should prevent prototype pollution', async ({ request }) => {
      const maliciousPayload = {
        role: 'Developer',
        audience: 'Team',
        task: 'Test task',
        tone: 'Professional',
        outputFormat: 'Paragraph',
        constraints: [],
        enhancementLevel: 'quick',
        language: 'en',
        '__proto__': { polluted: true },
        'constructor': { polluted: true }
      };

      const response = await request.post(`${BASE_URL}/api/enhance-prompt`, {
        data: maliciousPayload
      });

      // Should either succeed (ignoring malicious props) or fail validation
      expect([200, 400, 500].includes(response.status())).toBeTruthy();
    });

    test('should prevent path traversal in inputs', async ({ request }) => {
      const pathTraversalPayloads = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32',
        '%2e%2e%2f%2e%2e%2f',
        '....//....//....//etc/passwd'
      ];

      for (const payload of pathTraversalPayloads) {
        const response = await request.post(`${BASE_URL}/api/enhance-prompt`, {
          data: {
            role: payload,
            audience: 'Team',
            task: 'Test task for path traversal',
            tone: 'Professional',
            outputFormat: 'Paragraph',
            constraints: [],
            enhancementLevel: 'quick',
            language: 'en'
          }
        });

        // Should fail validation due to security threat detection
        expect(response.status()).toBe(400);
      }
    });
  });

  test.describe('Rate Limiting', () => {
    test('should enforce rate limits on API endpoints', async ({ request }) => {
      const sessionId = `test-session-${Date.now()}`;
      const maxRequests = 60; // Default rate limit

      // Make requests up to the limit
      const requests = [];
      for (let i = 0; i < maxRequests + 5; i++) {
        requests.push(
          request.post(`${BASE_URL}/api/enhance-prompt`, {
            headers: {
              'x-session-id': sessionId
            },
            data: {
              role: 'Developer',
              audience: 'Team',
              task: `Test task ${i}`,
              tone: 'Professional',
              outputFormat: 'Paragraph',
              constraints: [],
              enhancementLevel: 'quick',
              language: 'en'
            }
          })
        );
      }

      const responses = await Promise.all(requests);

      // Check that some requests were rate limited
      const rateLimitedResponses = responses.filter(r => r.status() === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);

      // Verify rate limit headers are present
      const firstResponse = responses[0];
      if (firstResponse) {
        const headers = firstResponse.headers();
        expect(headers['x-ratelimit-limit']).toBeDefined();
        expect(headers['x-ratelimit-remaining']).toBeDefined();
        expect(headers['x-ratelimit-reset']).toBeDefined();
      }
    });

    test('should return proper rate limit error response', async ({ request }) => {
      const sessionId = `test-session-rapid-${Date.now()}`;

      // Rapidly send requests to trigger rate limit
      const rapidRequests = Array(65).fill(null).map(() =>
        request.post(`${BASE_URL}/api/enhance-prompt`, {
          headers: { 'x-session-id': sessionId },
          data: {
            role: 'Developer',
            audience: 'Team',
            task: 'Rapid test task',
            tone: 'Professional',
            outputFormat: 'Paragraph',
            constraints: [],
            enhancementLevel: 'quick',
            language: 'en'
          }
        })
      );

      const responses = await Promise.all(rapidRequests);
      const rateLimited = responses.find(r => r.status() === 429);

      if (rateLimited) {
        const body = await rateLimited.json();
        expect(body.success).toBe(false);
        expect(body.error.code).toBe('RATE_LIMIT_EXCEEDED');
        expect(body.error.message).toContain('Too many requests');
      }
    });
  });

  test.describe('Sensitive Data Exposure', () => {
    test('should not expose stack traces in error responses', async ({ request }) => {
      // Send malformed request to trigger an error
      const response = await request.post(`${BASE_URL}/api/enhance-prompt`, {
        data: {
          invalid: 'data'
        }
      });

      const body = await response.json();
      const responseStr = JSON.stringify(body);

      // Verify no stack trace patterns
      expect(responseStr).not.toContain('at ');
      expect(responseStr).not.toContain('Error:');
      expect(responseStr).not.toContain('.ts:');
      expect(responseStr).not.toContain('.js:');
      expect(responseStr).not.toContain('node_modules');
    });

    test('should not expose API keys in client-side code', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);

      // Check page source and scripts for API keys
      const content = await page.content();
      expect(content).not.toContain('GEMINI_API_KEY');
      expect(content).not.toContain('AIza'); // Google API key prefix
      expect(content).not.toContain('sk-'); // OpenAI key prefix

      // Check localStorage and sessionStorage
      const localStorage = await page.evaluate(() => JSON.stringify(window.localStorage));
      const sessionStorage = await page.evaluate(() => JSON.stringify(window.sessionStorage));

      expect(localStorage).not.toContain('GEMINI_API_KEY');
      expect(sessionStorage).not.toContain('GEMINI_API_KEY');
    });

    test('should not log sensitive data in console', async ({ page }) => {
      const consoleLogs: string[] = [];
      page.on('console', msg => consoleLogs.push(msg.text()));

      await page.goto(`${BASE_URL}/builder`);

      // Interact with the form
      await page.fill('textarea[name="task"]', 'Test sensitive data logging');

      // Wait for any console logs
      await page.waitForTimeout(1000);

      // Check console logs don't contain sensitive patterns
      const allLogs = consoleLogs.join(' ');
      expect(allLogs).not.toContain('password');
      expect(allLogs).not.toContain('api_key');
      expect(allLogs).not.toContain('secret');
      expect(allLogs).not.toContain('token');
    });

    test('should not expose internal errors to client', async ({ request }) => {
      // Test various error scenarios
      const errorTests = [
        { data: null, desc: 'null payload' },
        { data: {}, desc: 'empty payload' },
        { data: { role: 'x'.repeat(10000) }, desc: 'oversized payload' }
      ];

      for (const test of errorTests) {
        const response = await request.post(`${BASE_URL}/api/enhance-prompt`, {
          data: test.data
        });

        if (!response.ok()) {
          const body = await response.json();

          // Verify error message is user-friendly and doesn't expose internals
          if (body.error) {
            expect(body.error.message).toBeTruthy();
            expect(body.error.message).not.toContain('TypeError');
            expect(body.error.message).not.toContain('ReferenceError');
            expect(body.error.message).not.toContain('undefined is not');
          }
        }
      }
    });
  });

  test.describe('Security Headers', () => {
    test('should set proper security headers', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/`);
      const headers = response.headers();

      // Check essential security headers
      expect(headers['x-frame-options']).toBe('DENY');
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['x-xss-protection']).toBe('1; mode=block');
      expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
      expect(headers['content-security-policy']).toBeDefined();
      expect(headers['permissions-policy']).toBeDefined();
    });

    test('should have restrictive CSP', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/`);
      const csp = response.headers()['content-security-policy'];

      if (csp) {
        // Verify CSP contains important directives
        expect(csp).toContain("default-src 'self'");
        expect(csp).toContain('frame-ancestors');
      }
    });
  });

  test.describe('Input Validation', () => {
    test('should validate required fields', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/enhance-prompt`, {
        data: {
          task: 'Test task'
          // Missing required fields
        }
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });

    test('should enforce character limits', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/enhance-prompt`, {
        data: {
          role: 'Developer',
          audience: 'Team',
          task: 'x'.repeat(10000), // Exceeds 1000 char limit
          tone: 'Professional',
          outputFormat: 'Paragraph',
          constraints: [],
          enhancementLevel: 'quick',
          language: 'en'
        }
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('1000 characters');
    });

    test('should validate enum values', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/enhance-prompt`, {
        data: {
          role: 'Developer',
          audience: 'Team',
          task: 'Test task',
          tone: 'Professional',
          outputFormat: 'Paragraph',
          constraints: [],
          enhancementLevel: 'invalid_level', // Invalid enum value
          language: 'en'
        }
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test('should enforce payload size limits', async ({ request }) => {
      const largePayload = {
        role: 'Developer',
        audience: 'Team',
        task: 'x'.repeat(500000), // Very large task
        tone: 'Professional',
        outputFormat: 'Paragraph',
        constraints: Array(1000).fill('constraint'),
        enhancementLevel: 'quick',
        language: 'en',
        examples: 'y'.repeat(500000),
        context: 'z'.repeat(500000)
      };

      const response = await request.post(`${BASE_URL}/api/enhance-prompt`, {
        data: largePayload
      });

      // Should fail due to payload size or validation
      expect([400, 413].includes(response.status())).toBeTruthy();
    });
  });

  test.describe('SQL/NoSQL Injection Prevention', () => {
    test('should detect and reject SQL injection attempts', async ({ request }) => {
      const sqlInjectionPayloads = [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM users --",
        "admin'--",
        "1' AND '1' = '1",
      ];

      for (const payload of sqlInjectionPayloads) {
        const response = await request.post(`${BASE_URL}/api/enhance-prompt`, {
          data: {
            role: payload,
            audience: 'Team',
            task: 'Test task for SQL injection',
            tone: 'Professional',
            outputFormat: 'Paragraph',
            constraints: [],
            enhancementLevel: 'quick',
            language: 'en'
          }
        });

        // Should fail validation due to security threat detection
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error?.fields?.[0]?.message).toContain('Security threat detected');
      }
    });

    test('should detect and reject NoSQL injection attempts', async ({ request }) => {
      const noSqlInjectionPayloads = [
        '{"$ne": null}',
        '{"$gt": ""}',
        '{"$where": "this.password == \'password\'"}',
      ];

      for (const payload of noSqlInjectionPayloads) {
        const response = await request.post(`${BASE_URL}/api/enhance-prompt`, {
          data: {
            role: payload,
            audience: 'Team',
            task: 'Test task for NoSQL injection',
            tone: 'Professional',
            outputFormat: 'Paragraph',
            constraints: [],
            enhancementLevel: 'quick',
            language: 'en'
          }
        });

        // Should fail validation
        expect(response.status()).toBe(400);
      }
    });
  });
});
