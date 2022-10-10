import { newE2EPage } from '@stencil/core/testing';

describe('table-sub-components', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<table-sub-components></table-sub-components>');

    const element = await page.find('table-sub-components');
    expect(element).toHaveClass('hydrated');
  });
});
