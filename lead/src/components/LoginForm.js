import React, { Component } from "react";
import { Button, Card, CardSection, Input } from "./common";

class LoginForm extends Component {
  state = { type: "" };

  render() {
    return (
      <Card>
        <CardSection>
          <Input
            placeholder="call"
            label="Type"
            value={this.state.type}
            onChangeText={type => this.setState({ type })}
          />
        </CardSection>

        <CardSection>
          <Input
            placeholder="note"
            label="Note"
            value={this.state.note}
            onChangeText={note => this.setState({ note })}
          />
        </CardSection>
      </Card>
    );
  }
}

export default LoginForm;
