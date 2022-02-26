import { IPC, IPCMessage } from "../ipc";
import ReactDOMServer from 'react-dom/server'
import React from 'react';
import {StyleSelector} from './Components/StyleSelector/StyleSelector'
import Highlight from 'highlight.js'

class DOMInterfacer {
  private IPCListener = new IPC();
  popupTimeout: number = 5000; // How long to show the popup in miliseconds
  popupFadeout: number = 300; // How long to hide the popup in miliseconds
  popupFadeoutString: string = `${this.popupFadeout / 1000}s`; // Do not modify

  constructor() {
    this.IPCListener.subscribeMessage('display-error', (event: IPCMessage) => {
      this.ErrorPopup(event.Data);
    });

    //this.SelectCSSRulePopup(document.body);
  }

  ErrorPopup(msg: string): void {
    let elem = document.createElement('div');
    document.body.appendChild(elem);
    elem.innerHTML = ReactDOMServer.renderToString(
      <div style={{background: '#3A3335', display: 'inline-block', position: 'fixed', right: '25px', bottom: '25px', color: 'white', borderRadius: '6px', overflow: 'hidden', fontFamily: 'Roboto', minWidth: '350px', transition: `opacity ${this.popupFadeoutString}`, zIndex: 9999999}}>
        <div style={{padding: '4px 8px', background: '#D81E5B', fontWeight: 400, fontSize: '16pt', letterSpacing: '1px', boxShadow: '0 3px 8px rgba(0,0,0,0.3)'}}>
          <span>Peeky</span>
        </div>
        <div style={{padding: '8px'}}>
          <pre style={{padding: 'unset', fontSize: 'unset', lineHeight: 'unset', color: 'unset', background: 'inherit', backgroundColor: 'unset', borderRadius: 'unset', margin: 'unset', border: 'unset', outline: 'unset'}}>{msg}</pre>
        </div>
      </div>
    );
    elem.addEventListener('click', () => {elem.remove()});
    let child:HTMLElement = elem.children[0] as HTMLElement;
    setTimeout(() => { child.style.setProperty('opacity', '0') }, this.popupTimeout); // Hide the popup
    setTimeout(() => { elem.remove() }, this.popupTimeout + this.popupFadeout + 100); // Delete the element once hidden
  }

  SelectCSSRulePopup(element: HTMLElement): void {
    let elem = document.createElement('div');
    elem.id = 'peeky-ss-container';
    document.body.appendChild(elem);
    elem.innerHTML = ReactDOMServer.renderToString(
      <StyleSelector Rules={this.GetElementCSS(element)}/>
    )
    Highlight.highlightAll();
    document.querySelectorAll('.code-block-close-btn').forEach(CloseButton => {
      let id = CloseButton.getAttribute('id');
      let body = document.querySelector(`.cb-body-${id}`) as HTMLElement;
      let initHeight = window.getComputedStyle(body).height;
      body.style.setProperty('max-height', initHeight);

      CloseButton.addEventListener('click', () => {
        let isClosed: boolean = window.getComputedStyle(body).height === '0px';
        body.style.setProperty('max-height', isClosed ? initHeight : '0px');
        CloseButton.textContent = isClosed ? '-' : '+';
      })
    })
    
    document.body.style.setProperty('overflow', 'hidden');

    document.querySelector('.code-block-container-bg')?.addEventListener('click', () => {
      document.querySelector('#peeky-ss-container')?.remove();
      document.body.style.setProperty('overflow', 'unset');
    });

    document.querySelector('.selector-close')?.addEventListener('click', () => {
      document.querySelector('#peeky-ss-container')?.remove();
      document.body.style.setProperty('overflow', 'unset');
    });
  }

  private GetElementCSS(element: HTMLElement): string[] {
    let sheets = document.styleSheets, ret = [];
    for (let i in sheets) {
        try {
          let rules = sheets[i].rules || sheets[i].cssRules;
            for (let r in rules) {
                if (element.matches((rules[r] as any).selectorText)) {
                    ret.push(rules[r].cssText);
                }
            }
        } catch (e) {
          console.error(e);
        }
    }
    return ret;
  }

  // GetElementCSS(x).map(t => t.split(' {')[0].replaceAll(', ', ',\n'))

  // q.split('audio,\ncanvas,\nprogress,\nvideo')[0].split('\n').slice(-2)[0]
}

export { DOMInterfacer }
