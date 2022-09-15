import { newSpecPage } from '@stencil/core/testing';
import { TableExpanding } from '../table-expanding';

describe('table-expanding', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TableExpanding],
      html: `<table-expanding></table-expanding>`,
    });
    expect(page.root).toEqualHtml(`
      <table-expanding>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </table-expanding>
    `);
  });
});
