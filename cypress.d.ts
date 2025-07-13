/// <reference types="cypress" />
import { MountOptions, MountReturn } from '@cypress/react';
import React from 'react';
declare global {
  namespace Cypress {
    interface Chainable {
      mount(component: React.ReactNode, options?: MountOptions): Chainable<MountReturn>;
    }
  }
}
