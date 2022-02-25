import ReactDOMServer from 'react-dom/server'
import React, { Component, ReactComponentElement } from 'react';
import './StyleBlock.scss'
import Highlight from 'react-highlight';
import Beautify from 'js-beautify';

type StyleBlockState = {
    Title: string;
    Content: string;  
}

class StyleBlock extends Component<StyleBlockState, StyleBlockState> {
    Title: string;
    Content: string;
    Id: string;

    constructor(props: StyleBlockState) {
        super(props);

        this.Title = props.Title;
        this.Content = props.Content;
        this.Id = this.Title.replace(/\#/gi, '').replace(/\ /gi, '-');
    }

    generateContent(): string {
        return Beautify.css(this.Content, {indent_size: 2, indent_with_tabs: false, indent_char: ' '});
    }

    override render() : JSX.Element {
        let elem = 

        <div className='code-block'>
            <div className='code-block-header'>
                <span>{this.Title}</span>
                <div id={this.Id} className='code-block-close-btn'>-</div>
                <div className='code-block-open-btn'>
                    <span>Open</span>
                </div>
            </div>
            <div className={`code-block-body cb-body-${this.Id}`}>
                <Highlight className='language-css css'>{`${this.generateContent()}`}</Highlight>
            </div>
        </div>

        return elem;
    }
}

export {StyleBlock};