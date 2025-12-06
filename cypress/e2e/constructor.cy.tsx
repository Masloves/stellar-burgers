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
    cy.wait('@getIngredients')
  });

  it('проверяем добавление булки из списка в конструктор', () => {
    cy.get('[data-testid="ingredient-item"]')
      .eq(0)
      .within(() => {
        cy.get('button').click();
      }
    );
    cy.get('[data-testid="noBunTop-message"]').should('not.exist');
    cy.get('[data-testid="noBunBottom-message"]').should('not.exist');
    cy.get('[data-testid="constructor-bunTop"]').should('exist');
    cy.get('[data-testid="constructor-bunBottom"]').should('exist');
  });

  it('проверяем добавление начинки из списка в конструктор', () => {
    cy.get('[data-testid="ingredient-item"]')
      .eq(1)
      .within(() => {
        cy.get('button').click();
      }
    );

    cy.get('[data-testid="no-filling-message"]').should('not.exist');
    cy.get('[data-testid="constructor-filling-item"]').should('exist');
  });

  it('проверяем добавление соуса из списка в конструктор', () => {
    cy.get('[data-testid="ingredient-item"]')
      .eq(2)
      .within(() => {
        cy.get('button').click();
      }
    );

    cy.get('[data-testid="no-filling-message"]').should('not.exist');
    cy.get('[data-testid="constructor-filling-item"]').should('exist');
  });
});

describe('проверяем работу модального окна', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients**', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients')
    cy.get('[data-testid="ingredient-item"]').eq(0).click();
  });

  it('проверяем открытие модального окна именно того ингредиента, по которому произошел клик', () => {
    cy.get('[data-testid="modal-window"]').should('be.visible');
    cy.get('[data-testid="ingredient-image"]')
      .should('be.visible')
      .and('have.attr', 'src')
      .should('include', 'bun-01-large.png');
    cy.get('[data-testid="ingredient-title"]').should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );
    cy.get('[data-testid="ingredient-details"]').within(() => {
      cy.contains('Калории, ккал').next().should('contain', '643');
      cy.contains('Белки, г').next().should('contain', '44');
      cy.contains('Жиры, г').next().should('contain', '26');
      cy.contains('Углеводы, г').next().should('contain', '85');
    });
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

describe('проверяем создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients**', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user**', { fixture: 'user.json' }).as(
      'getUser'
    );

    cy.intercept('POST', '**/api/orders**', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.setCookie('accessToken', 'test-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    cy.visit('/');
    cy.wait('@getIngredients')

    cy.get('[data-testid="ingredient-item"]')
      .eq(0)
      .within(() => {
        cy.get('button').click();
      }
    );

    cy.get('[data-testid="ingredient-item"]')
      .eq(1)
      .within(() => {
        cy.get('button').click();
      }
    );

    cy.get('[data-testid="ingredient-item"]')
      .eq(2)
      .within(() => {
        cy.get('button').click();
      }
    );
  });

  afterEach(() => {
    cy.clearCookies();
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it('проверяем, что бургер собирается', () => {
    cy.get('[data-testid="constructor-bunTop"]').should('exist');
    cy.get('[data-testid="constructor-bunBottom"]').should('exist');
    cy.get('[data-testid="constructor-filling-item"]').should('exist');
    cy.get('[data-testid="constructor-filling-item"]').should('have.length', 2);
  });

  it('проверяем, что при клике по кнопке «Оформить заказ» открывается модальное окно с верным номером заказа', () => {
    cy.get('[data-testid="order-button"]').click();
    cy.wait('@createOrder');
    cy.get('[data-testid="modal-window"]').should('be.visible');
    cy.get('[data-testid="order-number"]').should('contain', '96383');
  });

  it('проверяем, что при закрытии модального окна очищается конструктор', () => {
    cy.get('[data-testid="order-button"]').click();
    cy.wait('@createOrder');
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get('[data-testid="modal-window"]').should('not.exist');
    cy.get('[data-testid="noBunTop-message"]').should('be.visible');
    cy.get('[data-testid="no-filling-message"]').should('be.visible');
    cy.get('[data-testid="noBunBottom-message"]').should('be.visible');
  });
});