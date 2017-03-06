import { Component, define, h } from 'skatejs';

import { bind } from 'decko';

export default class App extends Component<void> {
  static get is() { return 'my-app'; }

  @bind()
  handleClick() {
    console.log('clicked with this scope: ', this);
  }

  renderCallback() {
    return [
      <div onClick={this.handleClick}>Hello my lord!</div>,
    ];
  }
};

define(App);
