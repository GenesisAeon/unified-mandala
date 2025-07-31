export async function gptSynapse(prompt: string, endpoint: string) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error('GPT request failed');
  return (await res.json()).response as string;
}
