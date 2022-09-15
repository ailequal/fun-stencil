import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'simple-counter',
  styleUrl: 'simple-counter.css',
  shadow: true,
})
export class SimpleCounter {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
