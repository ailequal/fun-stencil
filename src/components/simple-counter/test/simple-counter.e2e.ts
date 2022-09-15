import { newE2EPage } from '@stencil/core/testing';

describe('simple-counter', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<simple-counter></simple-counter>');

    const element = await page.find('simple-counter');
    expect(element).toHaveClass('hydrated');
  });
});
