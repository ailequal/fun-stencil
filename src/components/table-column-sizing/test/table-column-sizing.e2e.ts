import { newE2EPage } from '@stencil/core/testing';

describe('table-column-sizing', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<table-column-sizing></table-column-sizing>');

    const element = await page.find('table-column-sizing');
    expect(element).toHaveClass('hydrated');
  });
});
