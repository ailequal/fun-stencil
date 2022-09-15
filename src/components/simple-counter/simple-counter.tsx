import { Component, Event, Host, h, Prop, State, EventEmitter } from '@stencil/core';

@Component({
  tag: 'simple-counter',
  styleUrl: 'simple-counter.css',
  shadow: true,
})
export class SimpleCounter {

  @Prop() increase_text: string = '+';
  @Prop() decrease_text: string = '-';
  @Prop() color: string = 'red';

  @State() counter = 0;

  @Event() didReset: EventEmitter<string>;

  increase() {
    this.counter++;
  }

  decrease() {
    this.counter--;
  }

  reset() {
    this.counter = 0;
    this.didReset.emit('The counter has been reset.');
  }

  render() {
    return (
      <Host>
        <h2>simple-counter</h2>
        <h3 style={{ color: this.color }}>Counter: {this.counter}</h3>

        <div>
          <button onClick={() => this.increase()}>
            {this.increase_text}
          </button>

          <button onClick={() => this.decrease()}>
            {this.decrease_text}
          </button>

          <button onClick={() => this.reset()}>Reset</button>
        </div>

      </Host>
    );
  }

}
