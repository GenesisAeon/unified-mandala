import React from 'react';
import SigilAlert from '../../components/SigilAlert';

describe('SigilAlert E2E', () => {
  it('displays message and closes', () => {
    cy.mount(<SigilAlert message="alert" onClose={() => {}} />);
    cy.get('.sigil-alert').should('contain.text', 'alert');
  });
});
