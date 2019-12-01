import React, {Component} from 'react';
import Head from '@symph/joy/head';
import DashboardModel from '../../models/model';
import controller, {requireModel} from '@symph/joy/controller'
import config from '../../services/config'
import {timeFormat} from '../../utils'
import {Button, Card, Upload, Icon} from 'antd';
const { Meta } = Card;
import Masonry from 'react-masonry-component';
import {default as configs} from '../../services/config';

const props = {
  action: `${(configs.fileUrl)}/${configs.filemodules.upload}`,
  listType: 'picture',
  defaultFileList: [],
};

const masonryOptions = {
  transitionDuration: 300,
  fitWidth: true
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
    // this.props.dispatch({
    //   type: 'model/filelist'
    // });
    this.props.dispatch({
      type: 'model/filelistbytype',
      payload: {
        filetype: 'png'
      }
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
                  <li key={item.filehash} className="image-element-class" style={{listStyle: 'none', padding: 8}}>
                    <Card
                      hoverable
                      key={item.fid}
                      style={{ width: 240 }}
                      actions={[
                        <Icon type="setting" key="setting" />,
                        <Icon type="edit" key="edit" />,
                        <Icon type="ellipsis" key="ellipsis" />,
                      ]}
                      cover={<img key={item.filehash}
                                  data-src={`${config.fileUrl}/${config.filemodules.nekofile}/${item.fileid}/`}
                                  src={`${config.fileUrl}/${config.filemodules.nekofile}/${item.fileid}/`} />
                      }
                    >
                      <Meta
                        key={item.filehash}
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
