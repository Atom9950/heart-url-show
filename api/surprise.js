// Simple storage using URL encoding approach
// Data is encoded directly in the URL to make it fully shareable

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    // "Store" surprise data by returning a compressed version
    try {
      const { data } = req.body;
      
      if (!data) {
        return res.status(400).json({ error: 'Data is required' });
      }

      // Compress the data using URL-safe base64 encoding
      const compressedData = Buffer.from(data).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      // Generate a simple ID (timestamp-based)
      const surpriseId = Date.now().toString(36);
      
      return res.status(200).json({ 
        id: surpriseId,
        compressedData: compressedData,
        success: true,
        message: 'Surprise data processed successfully'
      });
      
    } catch (error) {
      console.error('Error processing surprise:', error);
      return res.status(500).json({ error: 'Failed to process surprise data' });
    }
  }
  
  if (req.method === 'GET') {
    // "Retrieve" surprise data by decompressing
    try {
      const { id, data } = req.query;
      
      if (!id || !data) {
        return res.status(400).json({ error: 'ID and data parameters are required' });
      }

      // Decompress the data from URL-safe base64
      let base64Data = data
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      
      // Add padding if needed
      while (base64Data.length % 4) {
        base64Data += '=';
      }
      
      const decompressedData = Buffer.from(base64Data, 'base64').toString('utf8');
      
      return res.status(200).json({ 
        success: true,
        data: decompressedData
      });
      
    } catch (error) {
      console.error('Error retrieving surprise:', error);
      return res.status(500).json({ error: 'Failed to retrieve surprise data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
