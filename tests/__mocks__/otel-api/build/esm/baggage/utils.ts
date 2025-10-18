// eslint-disable-next-line import/no-unresolved
import { propagation } from '../../index';

export const createBaggage = propagation.createBaggage;
export const getBaggage = propagation.getBaggage;
export const setBaggage = propagation.setBaggage;
export const baggageEntryMetadataFromString = () => ({ toString: () => '' });
