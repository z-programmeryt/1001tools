export type Tool = {
  slug: string;
  name: string;
  category: string;
  description: string;
  popular?: boolean;
};

export const tools: Tool[] = [
  { slug: 'word-counter', name: 'Word Counter', category: 'Text', description: 'Count words, characters and reading time.', popular: true },
  { slug: 'case-converter', name: 'Case Converter', category: 'Text', description: 'Convert text case instantly.', popular: true },
  { slug: 'lorem-ipsum', name: 'Lorem Ipsum Generator', category: 'Text', description: 'Generate text placeholders.' },
  { slug: 'text-to-speech', name: 'Text to Speech', category: 'Text', description: 'Speak text via browser speech.' },
  { slug: 'speech-to-text', name: 'Speech to Text', category: 'Text', description: 'Transcribe speech in browser.' },
  { slug: 'image-compressor', name: 'Image Compressor', category: 'Image', description: 'Compress image quality client-side.', popular: true },
  { slug: 'image-resizer', name: 'Image Resizer', category: 'Image', description: 'Resize images quickly.' },
  { slug: 'image-format-converter', name: 'Image Format Converter', category: 'Image', description: 'Convert PNG/JPG/WebP formats.' },
  { slug: 'image-base64', name: 'Image Base64', category: 'Image', description: 'Encode/decode image base64.' },
  { slug: 'background-remover', name: 'Background Remover', category: 'Image', description: 'Remove backgrounds by color.' },
  { slug: 'qr-generator', name: 'QR Generator', category: 'Image', description: 'Generate QR-like matrix.', popular: true },
  { slug: 'barcode-generator', name: 'Barcode Generator', category: 'Image', description: 'Render barcode-style output.' }
];

export const toolSlugs = tools.map((t) => t.slug);
