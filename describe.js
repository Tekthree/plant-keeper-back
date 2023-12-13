const fs = require('fs');
const fetch = require('node-fetch');

async function handleImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  try {
    const filePath = req.file.path;
    const imageBuffer = fs.readFileSync(filePath);
    const imageBase64 = imageBuffer.toString('base64');

    const api_key = process.env.OPENAI_API_KEY;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${api_key}`,
    };

    const payload = {
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Name all the plants in this picture. Also tell me if they are healthy or not.' },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
            },
          ],
        },
      ],
      max_tokens: 300,
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Delete the uploaded file after processing
    fs.unlinkSync(filePath);

    res.status(200).json({ description: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    // Ensure the uploaded file is deleted in case of an error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Error processing the image' });
  }
}

module.exports = handleImage;
