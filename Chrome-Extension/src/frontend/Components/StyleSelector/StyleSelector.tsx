import { StyleBlock } from "../StyleBlock/StyleBlock";
import ReactDOMServer from 'react-dom/server'
import React, { Component, ReactComponentElement } from 'react';
import './StyleSelector.scss'
import {forLoop} from '../../ReactLoop';

type StyleSelectorState = {
    Rules: string[];
}

class StyleSelector extends Component<StyleSelectorState, StyleSelectorState> {
    Rules: string[];

    constructor(props: StyleSelectorState) {
        super(props);

        this.Rules = props.Rules;
    }

    generateBlock(index: number) : JSX.Element {
        return <StyleBlock Title="" Content="" />
    }

    override render() : JSX.Element {
        let elem = 

        <div className="code-block-container">
            <div className="code-block-container-bg"></div>
            <div className='code-block-modal'>
                <div className='selector-header'>
                    <h1>Style Rules</h1>
                </div>
                <div className='rules'>
                    {forLoop(this.Rules.length, (idx) => {
                        let rule = this.Rules[idx];
                        return <StyleBlock key={`element${idx + 1}`} Title={`Element Rule #${idx}`} Content={rule}/>
                    })}
                </div>
            </div>
        </div>

        return elem;
    }
}

export {StyleSelector};