import { StyleBlock } from "../StyleBlock/StyleBlock";
import ReactDOMServer from 'react-dom/server'
import React, { Component, ReactComponentElement } from 'react';
import './StyleSelector.scss'
import {forLoop} from '../../ReactLoop';

type StyleSelectorState = {
    Rules: any[];
}

class StyleSelector extends Component<StyleSelectorState, StyleSelectorState> {
    Rules: any[];

    constructor(props: StyleSelectorState) {
        super(props);

        this.Rules = props.Rules;
    }

    override render() : JSX.Element {
        let elem = 

        <div className="code-block-container">
            <div className="code-block-container-bg"></div>
            <div className='code-block-modal'>
                <div className='selector-header'>
                    <h1>Style Rules</h1>
                    <div className='selector-close'>Close</div>
                </div>
                <div className='rules'>
                    <div>
                        {forLoop(this.Rules.length, (idx) => {
                            let rule = this.Rules[idx];
                            return <StyleBlock key={`element${idx + 1}`} Url={rule.url} Title={`Element Rule #${idx + 1}`} Content={rule.rule}/>
                        })}
                    </div>
                </div>
            </div>
        </div>

        return elem;
    }
}

export {StyleSelector};