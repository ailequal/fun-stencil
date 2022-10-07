import { newE2EPage } from '@stencil/core/testing';

describe('table-pagination-controlled', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<table-pagination-controlled></table-pagination-controlled>');

    const element = await page.find('table-pagination-controlled');
    expect(element).toHaveClass('hydrated');
  });
});
