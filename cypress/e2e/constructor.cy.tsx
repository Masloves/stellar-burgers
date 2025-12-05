describe('проверяем доступность приложения', function() {
    it('сервис должен быть доступен по адресу localhost:4000', function() {
        cy.visit('http://localhost:4000'); 
    });
});

describe('проверяем страницу конструктора бургера', () => {
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
            }
        );
        cy.get('[data-testid="no-bun-message"]').should('not.exist');
        cy.get('[data-testid="constructor-bun-top"]').should('exist');
        cy.get('[data-testid="constructor-bun-bottom"]').should('exist');
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
})