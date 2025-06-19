export default function handler(req: any, res: any) {
  res.status(200).json({ scores: [
    { id: 'meta1', value: 0.75 },
    { id: 'meta2', value: 0.82 }
  ]});
}
