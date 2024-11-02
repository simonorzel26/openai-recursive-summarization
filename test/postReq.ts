import { readFileSync } from 'fs';

// Define the base URL of your webhook endpoint and the parameters
const baseUrl = 'http://localhost:3000/webhook';
const params = {
  internalId: '12345',
  summarizationRetrievalWebhookURL:
    'https://webhook.site/217d0f3d-2cd1-4e94-a4e6-978593aafbbb',
  summaryMaxTokenCount: 100000,
  batchId: 'testBatch',
  status: 'completed',
};

// Construct the full URL
const url = `${baseUrl}/${params.internalId}/${encodeURIComponent(params.summarizationRetrievalWebhookURL)}/${params.summaryMaxTokenCount}/${params.batchId}/${params.status}`;

// Function to read file and send POST request
async function sendWebhook() {
  try {
    // Read the file content
    const textToSummarize = await readFileSync('./test/caption.txt', 'utf8');

    // Prepare payload for the POST request
    const payload = {
      textToSummarize,
      summarizationPrompt: 'Summarize this content concisely:',
    };

    // Send the POST request using Bun's fetch
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Log the response
    if (response.ok) {
      const jsonResponse = await response.json();
      console.log('Response:', jsonResponse);
    } else {
      console.error('Error:', response.status, await response.text());
    }
  } catch (error) {
    console.error('Error sending webhook:', error);
  }
}

// Run the function
sendWebhook();
