import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'table-sub-components',
  styleUrl: 'table-sub-components.css',
  shadow: true,
})
export class TableSubComponents {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
