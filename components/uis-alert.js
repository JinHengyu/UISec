// The ShadowRoot interface of the Shadow DOM API is the root node of a DOM subtree that is rendered separately from a document's main DOM tree.

// shadowRoot里面的元素，无法从外面通过css选择器选中，但可能继承

// 不污染全局变量

// '_'开头的属性是自定义的

// 利用闭包实现安全
(() => {


    // 或者叫shadowRootId
    const uuid = Symbol();



    window.customElements.define('uis-alert', class extends window.HTMLElement {



        // 静态：通用的工具函数

        // 提示帮助文档
        static wiki() {

            // console.table或者直接打印对象

            window.console.table([{ a: 123, b: 56 }, { a: 1, b: 2 }])

        }



        // 快速创建一个modal
        static makeAlert({ title = 'Title', content = 'Content', z = 10 }) {
            const modal = window.document.createElement('uis-alert')
            modal._title = title;
            modal._content = content;

            Object.assign(modal.style, {
                'position': 'fixed',
                'width': '100%',
                'height': '100%',
                'left': '0',
                'top': '0',
                'zIndex': z,
            });
            window.document.body.appendChild(modal)
            return new Promise(resolve => {
                modal._closeButtonCallback = () => {
                    modal.remove();
                    resolve(new Date());
                }
            });
        }




        constructor() {
            super();

            this[uuid] = this.attachShadow({ mode: 'closed' })



            // svg的width和height可以任意缩放
            // 关闭按钮：一个叉叉
            const closeIconSvg = `
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.9 21.9" enable-background="new 0 0 21.9 21.9">
                    <path fill="white" d="M14.1,11.3c-0.2-0.2-0.2-0.5,0-0.7l7.5-7.5c0.2-0.2,0.3-0.5,0.3-0.7s-0.1-0.5-0.3-0.7l-1.4-1.4C20,0.1,19.7,0,19.5,0  c-0.3,0-0.5,0.1-0.7,0.3l-7.5,7.5c-0.2,0.2-0.5,0.2-0.7,0L3.1,0.3C2.9,0.1,2.6,0,2.4,0S1.9,0.1,1.7,0.3L0.3,1.7C0.1,1.9,0,2.2,0,2.4  s0.1,0.5,0.3,0.7l7.5,7.5c0.2,0.2,0.2,0.5,0,0.7l-7.5,7.5C0.1,19,0,19.3,0,19.5s0.1,0.5,0.3,0.7l1.4,1.4c0.2,0.2,0.5,0.3,0.7,0.3  s0.5-0.1,0.7-0.3l7.5-7.5c0.2-0.2,0.5-0.2,0.7,0l7.5,7.5c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l1.4-1.4c0.2-0.2,0.3-0.5,0.3-0.7  s-0.1-0.5-0.3-0.7L14.1,11.3z"/>
                </svg> `;

            this[uuid].innerHTML = `
        <style>
            /* The Modal (background) */
            #modal-outer {
                display: flex; 
                justify-content: center;
                align-items: center; 
                position: absolute; 
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                overflow: auto; 
                background-color: rgba(0,0,0,0.4); 
            }

            /* Modal Content */
            #modal-inner {
                background-color: #fefefe;
                padding: 0;
                border: 1px solid #888;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
                animation-name: myAnimation;
                animation-duration: 0.4s;
                min-width: 200px;
                min-height: 200px;
                max-width: 75%;
                max-height: 75%;
                position: absolute;
                display: flex;
                flex-direction: column;
            }

            /* Add Animation */
            @keyframes myAnimation {
                from { opacity:0}
                to { opacity:1}
            }
            
            #modal-header {
                padding: 2px 16px;
                background-color: #000066;
                color: white;
            }

            /* The Close Buttons */
            #close {
                float: right;
                font-size: 28px;
                font-weight: bold;
                width: 20px;
                filter: blur(1px);
            }
            
            #close:hover,
            #close:focus {
                cursor: pointer;
                filter: unset;
            }
            
            #title{
                font-size: 20px;
            }
            
            #content {
                font-size: 18px;
                padding: 2px 16px;
                margin: 20px 2px;
                overflow: scroll;
                word-break: break-all;
            }

        </style>

        
        <style id="customStyle"> </style>


        <div id="modal-outer">
            <div id="modal-inner">
                <div id="modal-header">
                    <span id="close">${closeIconSvg}</span>
                    <h1 id="title">Title</h1>
                </div>
                <div id="content"> 
                    Content
                <div>
            </div>
        </div>   `
        }




        connectedCallback() {
            this._closeButton = this[uuid].querySelector("#close");


            // 有可能有多个关闭按钮
            //脱离dom，然后自动执行this.disconnectedCallback();

            this._closeButton.onclick = this.remove.bind(this);

            // 修改自身样式需要像外部发请求
            // this.style.left='10px';
        }


        disconnectedCallback() {
            this._closeButton.onclick = null;

        }




        // 所有对外暴露的接口

        // 用户可覆盖的css
        get _customStyle() {
            return this[uuid].querySelector('style#customStyle').innerHTML;
        }
        set _customStyle(newStyle) {
            this[uuid].querySelector('style#customStyle').innerHTML = newStyle;
        }



        get _title() {
            return this[uuid].querySelector('#title').innerHTML;
        }
        set _title(title) {
            this[uuid].querySelector('#title').innerHTML = title;
        }

        get _content() {
            return this[uuid].querySelector('#content').innerHTML;
        }
        set _content(content) {
            this[uuid].querySelector('#content').innerHTML = content;
        }

        set _closeButtonCallback(callback) {

            this._closeButton.onclick = callback.bind(this);

            // delete this;
        }




    });



})();
