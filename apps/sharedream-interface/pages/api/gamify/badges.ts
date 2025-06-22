export default function handler(_req: any, res: any) {
  res.status(200).json({
    badges: [
      { id: 'first-pointer', name: 'First C Pointer reversed' },
      { id: 'hamster-pro', name: 'Hamster AI-Pro' },
    ],
  });
}
