import { newSpecPage } from '@stencil/core/testing';
import { TableSubComponents } from '../table-sub-components';

describe('table-sub-components', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TableSubComponents],
      html: `<table-sub-components></table-sub-components>`,
    });
    expect(page.root).toEqualHtml(`
      <table-sub-components>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </table-sub-components>
    `);
  });
});
