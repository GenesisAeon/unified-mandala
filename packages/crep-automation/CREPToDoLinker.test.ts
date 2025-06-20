import { linkCREPToDos } from './CREPToDoLinker';

test('suggests tasks based on CREP change', () => {
  const tasks = linkCREPToDos({ R: -1, E: 2 });
  expect(tasks).toContain('Dokumentation aktualisieren');
  expect(tasks).toContain('Diskussion anstoßen');
});
