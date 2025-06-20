import { CollaborativeEditor } from './CollaborativeEditor';
import * as routes from './federationRoutes';

test('applyLocalChange updates content', () => {
  const editor = new CollaborativeEditor();
  editor.applyLocalChange('hello');
  expect(editor.getContent()).toBe('hello');
});

test('applyLocalChange triggers federation update', () => {
  const spy = jest.spyOn(routes, 'sendUpdate').mockImplementation(() => {});
  const editor = new CollaborativeEditor('https://remote/sync');
  editor.applyLocalChange('world');
  expect(spy).toHaveBeenCalledWith('https://remote/sync', 'world');
  spy.mockRestore();
});
