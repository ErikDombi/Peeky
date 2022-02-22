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

    constructor(props: StyleBlockState) {
        super(props);

        this.Title = props.Title;
        this.Content = props.Content;
    }

    generateContent(): string {
        return Beautify.css(this.Content);
    }

    override render() : JSX.Element {
        let elem = 

        <div className='code-block'>
            <div className='code-block-header'>
                <span>{this.Title}</span>
                <div className='code-block-close-btn'>
                    -
                </div>
                <div className='code-block-open-btn'>
                    <span>Open</span>
                </div>
            </div>
            <div className='code-block-body'>
                <Highlight className='language-css css'>{`${this.generateContent()}`}</Highlight>
            </div>
        </div>

        return elem;
    }
}

export {StyleBlock};