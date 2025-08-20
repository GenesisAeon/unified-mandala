export default function handler(req: any, res: any) {
  res.status(200).json({
    avgCREP: 0.7,
    sigillinAdoption: 5,
    openTodos: 3,
    gpt5AvgLatency: 220,
    gpt5SuccessRate: 0.98,
  });
}
