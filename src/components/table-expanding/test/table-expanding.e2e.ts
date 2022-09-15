import { newE2EPage } from '@stencil/core/testing';

describe('table-expanding', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<table-expanding></table-expanding>');

    const element = await page.find('table-expanding');
    expect(element).toHaveClass('hydrated');
  });
});
