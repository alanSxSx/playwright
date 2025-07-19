import { test, expect } from "@playwright/test";

test.describe("Tela de Login", () => {
  const baseUrl = process.env.BASE_URL || "http://localhost:3001/";

  test("Deve carregar a página de login com título", async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  });

  test("Deve mostrar mensagens de erro se tentar submeter vazio", async ({
    page,
  }) => {
    await page.goto(baseUrl);
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Email is required.")).toBeVisible();
    await expect(page.getByText("Password is required.")).toBeVisible();
  });

  test("Deve exibir erro com email/senha inválidos", async ({ page }) => {
    await page.goto(baseUrl);

    await page.getByLabel("Email").fill("email@invalido.com");
    await page.locator('input[type="password"]').fill("123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByText("Email ou Senha Inválidos")).toBeVisible();
  });

  test("Deve mostrar loader ao enviar formulário", async ({ page }) => {
    await page.goto(baseUrl);

    await page.getByLabel("Email").fill("teste@email.com");
    await page.locator('input[type="password"]').fill("123");

    // Mock da resposta do next-auth (evita login real)
    await page.route("**/api/auth/callback/credentials**", async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ ok: true }),
      });
    });
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByLabel("Carregando Spinner")).toBeVisible();
  });

  test("Deve entrar na tela de testes USUARIO", async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByLabel("Email").fill("teste@teste.com");
    await page.locator('input[type="password"]').fill("123");
    await page.getByRole("button", { name: "Entrar" }).click();

    await page.waitForURL("**/testandouser",{ timeout: 5000 });
    await expect(page.getByText("Olá , bem vindo !")).toBeVisible();
    await expect(
      page.getByText("Você está na página de Testes e você é um Usuário")
    ).toBeVisible();
  });

  test("Deve entrar na tela de testes ADMINISTRADOR", async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByLabel("Email").fill("teste1@teste.com");
    await page.locator('input[type="password"]').fill("123");
    await page.getByRole("button", { name: "Entrar" }).click();

    await page.waitForURL("**/admin", { timeout: 5000 });
    await expect(page.getByText("Olá , bem vindo !")).toBeVisible();
    await expect(
      page.getByText("Você é um Administrador, bem vindo !")
    ).toBeVisible();
  });

  test("Deve deslogar do sistema e voltar na tela de login", async ({
    page,
  }) => {
    await page.goto(baseUrl);
    await page.getByLabel("Email").fill("teste@teste.com");
    await page.locator('input[type="password"]').fill("123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await page.waitForURL("**/testandouser" , { timeout: 5000 });
    await expect(page.getByText("Olá , bem vindo !")).toBeVisible();
    await Promise.all([
      page.waitForURL("**/", { timeout: 5000 }),
      page.getByRole("button", { name: "Sair" }).click(),
    ]);
    await expect(page.getByRole("heading", { name: /login/i })).toBeVisible({ timeout: 10000 });
  });
});
