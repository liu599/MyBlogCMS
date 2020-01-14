import React from 'react';

export default class _Error extends React.Component {
    render () {
        const { statusCode, message } = this.props;
        const title = statusCode === 404
            ? 'This page could not be found'
            : 'An unexpected error has occurred';

        return (
            <div>
                <h1>Status Code {statusCode}</h1>
                <p>{message}</p>
                <p>无法找到内容。请确认输入的地址是否正确。</p>
                <p>No Content can be found in this page</p>
            </div>
        );
    }
}