import { newSpecPage } from '@stencil/core/testing';
import { SimpleCounter } from '../simple-counter';

describe('simple-counter', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SimpleCounter],
      html: `<simple-counter></simple-counter>`,
    });
    expect(page.root).toEqualHtml(`
      <simple-counter>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </simple-counter>
    `);
  });
});
