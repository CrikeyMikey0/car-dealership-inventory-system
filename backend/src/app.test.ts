import test from 'node:test';
import assert from 'node:assert/strict';

// This test follows a strict TDD style: define the expected behavior first,
// then verify it against the app through a real HTTP request.
test('health endpoint returns ok status and a timestamp', async () => {
  // Make sure the app does not start a listener during the test run.
  process.env.NODE_ENV = 'test';

  // Import the app factory after setting the test environment.
  const { createApp } = await import('./app.js');
  const app = createApp();

  // Start the app on an ephemeral port so the test can hit it over HTTP.
  const server = app.listen(0);
  const address = server.address();

  if (typeof address !== 'object' || address === null) {
    throw new Error('Server address was not assigned');
  }

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    const payload = (await response.json()) as { status: string; timestamp: string };

    assert.equal(response.status, 200);
    assert.equal(payload.status, 'ok');
    assert.match(payload.timestamp, /\d{4}-\d{2}-\d{2}T/);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
});
