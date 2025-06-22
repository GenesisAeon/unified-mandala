export default function handler(_req: any, res: any) {
  res.status(200).json({
    leaderboard: [
      { user: 'alice', score: 12 },
      { user: 'bob', score: 9 },
    ],
  });
}
