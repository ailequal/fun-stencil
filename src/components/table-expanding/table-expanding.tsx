import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'table-expanding',
  styleUrl: 'table-expanding.css',
  shadow: true,
})
export class TableExpanding {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
