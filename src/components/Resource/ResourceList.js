import React, {Component} from 'react';
import Head from '@symph/joy/head';
import DashboardModel from '../../models/model';
import controller, {requireModel} from '@symph/joy/controller'
import {routerRedux} from '@symph/joy/router';
import config from '../../services/config'
import {timeFormat} from '../../utils'
import lodash from 'lodash';
import {Button, Card, Upload, Icon} from 'antd';
const { Meta } = Card;
import Masonry from 'react-masonry-component';

const props = {
  action: 'https://bandori.nekohand.moe/upload',
  listType: 'picture',
  defaultFileList: [],
};

const masonryOptions = {
  transitionDuration: 0
};

const imagesLoadedOptions = { background: '.my-bg-image-el' }


@requireModel(DashboardModel)          // register model
@controller((state) => {              // state is store's state
  return {
    model: state.model // bind model's state to props
  }
})

export default class ResourceList extends Component {

  state = {
    fileList: [],
    uploading: false,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'model/filelist'
    });
  }

  render() {
    return (
      <>
        <Head>
          <title>Dashboard / ResouceList</title>
        </Head>
        <h2 style={{ marginBottom: 20 }}>资源列表</h2>
        <div style={{ marginBottom: 20 }}>
          <Upload {...props} supportServerRender multiple onRemove={() => {
            this.props.dispatch({
              type: 'model/filelist'
            });
          }}>
            <Button>
              <Icon type="upload" /> Upload
            </Button>
          </Upload>
        </div>
        <Masonry
          className={'my-gallery-class'} // default ''
          elementType={'ul'} // default 'div'
          options={masonryOptions} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
          imagesLoadedOptions={imagesLoadedOptions} // default {}
        >
            {
              this.props.model.files.map(item => {
                return (
                  <li className="image-element-class" style={{listStyle: 'none', padding: 8}}>
                    <Card
                      hoverable
                      key={item.filehash}
                      style={{ width: 240, float: 'left' }}
                      cover={<img alt="example" src={`${config.fileUrl}/${config.filemodules.nekofile}/${item.fileid}/`} />}
                    >
                      <Meta
                        title={item.filehash}
                        description={timeFormat(item.modifiedAt)}
                      />
                    </Card>
                  </li>
                )
              })
            }
        </Masonry>
      </>
    )
  }
};
