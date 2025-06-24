(async () => {
  try {
    await fetch('http://localhost:3000/usecases/todo/parse');
    await fetch('http://localhost:3000/socialgood/match');
    console.log('SocialGood workflow triggered');
  } catch (err) {
    console.error('Workflow trigger failed', err);
  }
})();
