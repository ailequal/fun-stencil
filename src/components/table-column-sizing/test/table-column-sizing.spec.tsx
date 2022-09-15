import { newSpecPage } from '@stencil/core/testing';
import { TableColumnSizing } from '../table-column-sizing';

describe('table-column-sizing', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TableColumnSizing],
      html: `<table-column-sizing></table-column-sizing>`,
    });
    expect(page.root).toEqualHtml(`
      <table-column-sizing>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </table-column-sizing>
    `);
  });
});
