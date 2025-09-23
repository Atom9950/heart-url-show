// Using LZ-String compression for better URL encoding
import LZString from 'lz-string';

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

      console.log('Original data size:', data.length);

      // Compress the data using LZ-String (designed for URLs)
      const compressedData = LZString.compressToEncodedURIComponent(data);
      
      console.log('Compressed data size:', compressedData.length);
      console.log('Compression ratio:', (compressedData.length / data.length * 100).toFixed(1) + '%');
      
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

      console.log('Received compressed data size:', data.length);

      // Decompress the data using LZ-String
      const decompressedData = LZString.decompressFromEncodedURIComponent(data);
      
      if (!decompressedData) {
        throw new Error('Failed to decompress data - data may be corrupted');
      }
      
      console.log('Decompressed data size:', decompressedData.length);
      
      return res.status(200).json({ 
        success: true,
        data: decompressedData
      });
      
    } catch (error) {
      console.error('Error retrieving surprise:', error);
      return res.status(500).json({ error: `Failed to retrieve surprise data: ${error.message}` });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
