import { Component, Host, h, Listen } from '@stencil/core';

@Component({
  tag: 'event-listener',
  styleUrl: 'event-listener.css',
  shadow: true,
})
export class EventListener {

  @Listen('didReset', { target: 'body' })
  didResetHandler(event: CustomEvent<string>) {
    console.log('didResetHandler', event);
  }

  @Listen('handleSubmitData', { target: 'body' })
  onSubmitData(event: CustomEvent<string>) {
    console.log('onSubmitData', event);
  }

  render() {
    return (
      <Host>
        <h2>event-listener</h2>
      </Host>
    );
  }

}
