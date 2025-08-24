declare module 'pdf-parse' {
  export interface PDFParseResult {
    text: string;
    [key: string]: any;
  }
  export default function pdf(
    data: Buffer,
    options?: Record<string, unknown>
  ): Promise<PDFParseResult>;
}
