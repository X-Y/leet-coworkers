describe("template spec", () => {
  it("should visit", () => {
    cy.visit("http://localhost:3000/");
  });

  xit("finds sorter", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("Sort By");
  });

  it("Can use sorter", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("Sort By")
      .parent()
      .find("input")
      .not('[type="hidden"]')
      .click();

    cy.contains("name A-Z").click();
  });
});
