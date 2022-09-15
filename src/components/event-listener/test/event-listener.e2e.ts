import { newE2EPage } from '@stencil/core/testing';

describe('event-listener', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<event-listener></event-listener>');

    const element = await page.find('event-listener');
    expect(element).toHaveClass('hydrated');
  });
});
