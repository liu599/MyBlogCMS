import {Component} from "react";
import {Tag} from 'antd';
const { CheckableTag } = Tag;

export default class ColorTag extends Component {
  state = {
    checked: this.props.checked || false,
  };

  handleChange = (checked) => {
    if (checked) {
      this.props.cb(this.props.nm);
    }
    // this.setState({ checked });
  };

  render() {
    return (
      <CheckableTag {...this.props}
                    key={this.props.nm}
                    checked={this.props.checked}
                    onChange={this.handleChange} >
        {this.props.nm}
      </CheckableTag>
    );
  }
}
