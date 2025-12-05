describe('проверяем доступность приложения', function () {
  it('сервис должен быть доступен по адресу localhost:4000', function () {
    cy.visit('http://localhost:4000');
  });
});

describe('проверяем конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients**', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
  });

  it('проверяем добавление булки из списка в конструктор', () => {
    cy.get('[data-testid="ingredient-item"]')
      .eq(0)
      .within(() => {
        cy.get('button').click();
      });
    cy.get('[data-testid="noBunTop-message"]').should('not.exist');
    cy.get('[data-testid="noBunBottom-message"]').should('not.exist');
    cy.get('[data-testid="constructor-bunTop"]').should('exist');
    cy.get('[data-testid="constructor-bunBottom"]').should('exist');
  }),
    it('проверяем добавление начинки из списка в конструктор', () => {
      cy.get('[data-testid="ingredient-item"]')
        .eq(1)
        .within(() => {
          cy.get('button').click();
        });

      cy.get('[data-testid="no-filling-message"]').should('not.exist');
      cy.get('[data-testid="constructor-filling-item"]').should('exist');
    }),
    it('проверяем добавление соуса из списка в конструктор', () => {
      cy.get('[data-testid="ingredient-item"]')
        .eq(2)
        .within(() => {
          cy.get('button').click();
        });

      cy.get('[data-testid="no-filling-message"]').should('not.exist');
      cy.get('[data-testid="constructor-filling-item"]').should('exist');
    });
}),

describe('проверяем работу модального окна', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients**', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.get('[data-testid="ingredient-item"]').eq(0).click();
  });

  it('проверяем открытие модального окна', () => {
    cy.get('[data-testid="modal-window"]').should('be.visible');
  });

  it('проверяем закрытие модального окна', () => {
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get('[data-testid="modal-window"]').should('not.exist');
  });

  it('проверяем закрытие модального окна по клику на оверлей', () => {
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="modal-window"]').should('not.exist');
    cy.get('[data-testid="modal-overlay"]').should('not.exist');
  });

  it('проверяем закрытие модального окна клавишей Esc', () => {
    cy.get('body').type('{esc}');
    cy.get('[data-testid="modal-window"]').should('not.exist');
    cy.get('[data-testid="modal-overlay"]').should('not.exist');
  });
});
