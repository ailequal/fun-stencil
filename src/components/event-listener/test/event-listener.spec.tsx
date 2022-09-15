import { newSpecPage } from '@stencil/core/testing';
import { EventListener } from '../event-listener';

describe('event-listener', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [EventListener],
      html: `<event-listener></event-listener>`,
    });
    expect(page.root).toEqualHtml(`
      <event-listener>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </event-listener>
    `);
  });
});
