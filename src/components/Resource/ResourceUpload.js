import React, {Component} from 'react'
import { Upload, Button, Icon } from 'antd';

const props = {
  // action: 'http://localhost:17699/upload',
  action: 'https://bandori.nekohand.moe/upload',
  listType: 'picture',
  defaultFileList: [],
};

export default class ResourceUpload extends Component{
  render(){
    return (
      <div>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Upload
          </Button>
        </Upload>
      </div>
    )
  }
}
