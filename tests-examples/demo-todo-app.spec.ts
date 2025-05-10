import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3001/');
});

const TODO_ITEMS = [
  'buy some cheese',
  'feed the cat',
  'book a doctors appointment'
] as const;

test('should add a todo', async ({ page }) => {
	await page.getByPlaceholder('Email').click();
	await page.getByPlaceholder('Email').fill('teste@teste.com');
	await page.getByPlaceholder('Password').click();
	await page.getByPlaceholder('Password').fill('123');
	await page.getByPlaceholder('Entrar').press('Enter');

});
