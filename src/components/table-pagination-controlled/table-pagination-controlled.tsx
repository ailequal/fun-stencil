import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'table-pagination-controlled',
  styleUrl: 'table-pagination-controlled.css',
  shadow: true,
})
export class TablePaginationControlled {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
