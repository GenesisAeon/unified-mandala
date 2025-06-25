import { renderHook, act } from '@testing-library/react';

const history: any[] = [];
const addEntryMock = jest.fn((C: number, R: number, E: number, P: number) => {
  history.push({ timestamp: new Date(), C, R, E, P });
});
const getHistoryMock = jest.fn(() => history);

jest.mock('../../crep-engine/CREPManager', () => ({
  CREPManager: jest.fn().mockImplementation(() => ({
    addCREPEntry: addEntryMock,
    getCREPHistory: getHistoryMock,
  })),
}));

const evaluateMock = jest.fn((data: { C: number; R: number; E: number; P: number }) => {
  addEntryMock(data.C, data.R, data.E, data.P);
});

jest.mock('../../crep-engine/CREPEvaluator', () => ({
  CREPEvaluator: jest.fn().mockImplementation(() => ({
    evaluateNewDataPoint: evaluateMock,
  })),
}));

import { useCREP } from './useCREP';

beforeEach(() => {
  history.length = 0;
  jest.clearAllMocks();
});

test('triggerCREP stores entry and updates history state', () => {
  const { result } = renderHook(() => useCREP());

  act(() => {
    result.current.triggerCREP({ C: 1, R: 2, E: 3, P: 4 });
  });

  expect(evaluateMock).toHaveBeenCalledWith({ C: 1, R: 2, E: 3, P: 4 });
  expect(addEntryMock).toHaveBeenCalledWith(1, 2, 3, 4);
  expect(result.current.history).toHaveLength(1);
  expect(result.current.history[0].C).toBe(1);
  expect(getHistoryMock).toHaveBeenCalledTimes(2);
});
