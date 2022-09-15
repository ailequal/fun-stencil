import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'table-column-sizing',
  styleUrl: 'table-column-sizing.css',
  shadow: true,
})
export class TableColumnSizing {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
