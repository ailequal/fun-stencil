import { newSpecPage } from '@stencil/core/testing';
import { TablePaginationControlled } from '../table-pagination-controlled';

describe('table-pagination-controlled', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TablePaginationControlled],
      html: `<table-pagination-controlled></table-pagination-controlled>`,
    });
    expect(page.root).toEqualHtml(`
      <table-pagination-controlled>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </table-pagination-controlled>
    `);
  });
});
