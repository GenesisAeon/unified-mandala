import { Spaces } from './Spaces';

test('creates space and manages members', () => {
  const spaces = new Spaces();
  const space = spaces.createSpace('alpha');
  spaces.addMember(space.id, 'alice');
  spaces.addMember(space.id, 'bob');
  spaces.addMember(space.id, 'alice'); // duplicate ignored
  expect(spaces.listMembers(space.id)).toEqual(['alice', 'bob']);
});
