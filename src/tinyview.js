/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
/* eslint-disable indent */

/** Class representing Tiny View */

class TinyView {
    /**
    * Create a Tiny View
    * @constructor
    * @param {array}images array of img elements
    */
    constructor(...images) {
        /** Determine if the image is being dragged
         * @type {Boolean}
         * @access private mouseDrag*/
        this.mouseDrag = false;

        /** Record the mouse down X position
         * @type {Float}
        * @access private mouseDownX*/
        this.mouseDownX = 0;

        /** Record the mouse down Y position
         * @type {Float}
        * @access private mouseDownY*/
        this.mouseDownY = 0;

        /** Record the image scale value
         * @type {Integer}
        * @access private scale*/
        this.scale = 100;

        /** Record the image angle
         * @type {Float}
         * @access private angle*/
        this.angle = 0;

        /** Store array of img elements from param
        * @type {Array}
        * @access private images*/
        this.images = images;

        /** Store the div element for canvas
        * @type {HTMLElement}
        * @access private canvas*/
        this.canvas = document.createElement('div');
        this.canvas.id = 'tiny-view-canvas';

        /**  Store the div element for scale label
        * @type {HTMLElement}
        * @access private scaleLabel*/
        this.scaleLabel = document.createElement('div');
        this.scaleLabel.id = 'tiny-view-canvas-label';

        /** Store the div element for canvas buttons
        * @type {HTMLElement}
        * @access private scale*/
        this.canvasBtn = document.createElement('ul');
        this.canvasBtn.id = 'tiny-view-canvas-button';

        /**  Store the div element for ZoomIn buttons
        * @type {HTMLElement}
        * @access private zoomInBtn*/
        this.zoomInBtn = document.createElement('li');
        this.zoomInBtn.classList.add('tiny-view-icon-zoomIn');
        this.canvasBtn.appendChild(this.zoomInBtn);

        /**  Store the div element for ZoomOut buttons
        * @type {HTMLElement}
        * @access private zoomOutBtn*/
        this.zoomOutBtn = document.createElement('li');
        this.zoomOutBtn.classList.add('tiny-view-icon-zoomOut');
        this.canvasBtn.appendChild(this.zoomOutBtn);

        /**  Store the div element for fullScreen buttons
        * @type {HTMLElement}
        * @access private fullScreenBtn*/
        this.fullScreenBtn = document.createElement('li');
        this.fullScreenBtn.classList.add('tiny-view-icon-fullScreen');
        this.canvasBtn.appendChild(this.fullScreenBtn);

        /**  Store the div element for left Rotate buttons
        * @type {HTMLElement}
        * @access private leftRotateBtn*/
        this.leftRotateBtn = document.createElement('li');
        this.leftRotateBtn.classList.add('tiny-view-icon-leftRotate');
        this.canvasBtn.appendChild(this.leftRotateBtn);

        /**  Store the div element for right Rotate buttons
        * @type {HTMLElement}
        * @access private rightRotateBtn*/
        this.rightRotateBtn = document.createElement('li');
        this.rightRotateBtn.classList.add('tiny-view-icon-rightRotate');
        this.canvasBtn.appendChild(this.rightRotateBtn);

        /**  Store the div element for Loader icon
        * @type {HTMLElement}
        * @access private loader*/
        this.loader = document.createElement('div');
        this.loader.classList.add('tiny-view-loader');
        this.canvasBtn.appendChild(this.loader);

        /**  Store the div element for canvas Image
        * @type {HTMLElement}
        * @access private canvasImage*/
        this.canvasImage = document.createElement('img');
        this.canvasImage.id = 'tiny-view-canvas-image';

        /**
         * Called by constructor by binding Events for class memebers of HTML elements or document object
         * zoomInBtn : onclick
         * zoomOutBtn : onclick
         * fullScreenBtn : onclick
         * leftRotateBtn : onclick
         * rightRotateBtn : onclick
         * canvas: onclick,wheel
         * canvasImage: mosueDown,mouseEnter,mosueUp,wheel
         * scaleLabel: animationed
         * window: onresize
         * **/
        const bindEvent = () => {
            this.zoomInBtn.addEventListener('click', (event) => {
                event.deltaY = -100;
                this.scaleImage(event);
            });

            this.zoomOutBtn.addEventListener('click', (event) => {
                event.deltaY = 100;
                this.scaleImage(event);
            });

            this.fullScreenBtn.addEventListener('click', (event) => {
                this.canvasImage.requestFullscreen();
            });

            this.leftRotateBtn.addEventListener('click', () => {
                this.angle -= 90;
                this.canvasImage.style.setProperty('transform', `rotate(${this.angle}deg)`);
            });

            this.rightRotateBtn.addEventListener('click', () => {
                this.angle += 90;
                this.canvasImage.style.setProperty('transform', `rotate(${this.angle}deg)`);
            });


            this.canvas.addEventListener('click', () => {
                this.addStyle([this.canvasImage, this.canvas, this.canvasBtn, this.scaleLabel, this.loader], 'display', 'none');
                document.body.style.overflow = 'auto';
            });

            this.canvasImage.addEventListener('mousedown', (elem) => {
                this.mouseDrag = true;
                this.mouseDownX = elem.offsetX;
                this.mouseDownY = elem.offsetY;
            });

            this.canvasImage.addEventListener('mouseenter', () => {
                this.canvasImage.style.cursor = 'grab';
            });

            this.canvasImage.addEventListener('mouseup', () => {
                this.mouseDrag = false;
            });

            this.canvasImage.addEventListener('mousemove', (elem) => {
                if (this.mouseDrag) {
                    const left = elem.clientX - this.mouseDownX;
                    const top = elem.clientY - this.mouseDownY;
                    this.canvasImage.style.left = left + 'px';
                    this.canvasImage.style.top = top + 'px';
                }
            });

            this.canvas.addEventListener('wheel', (event) => {
                void this.scaleImage(event);
            });

            this.canvasImage.addEventListener('wheel', (event) => {
                void this.scaleImage(event);
            });

            this.scaleLabel.addEventListener('animationend', (event) => {
                if (event.animationName == 'tiny-view-canvas-fadeOut') {
                    this.scaleLabel.style.display = 'none';
                }
            });

            window.onresize = () => {
                this.canvasImage.style.setProperty('top', `${(window.innerHeight - this.canvasImage.clientHeight) / 2}px`);
                this.canvasImage.style.setProperty('left', `${(window.innerWidth - this.canvasImage.clientWidth) / 2}px`);
                this.canvasBtn.style.setProperty('left', `${(window.innerWidth - this.canvasBtn.clientWidth) / 2}px`);
            };
        };
        bindEvent.call(this);


        /**
         * added htlm elements to DOM.
         * bind the click event of the each img element of the args with the openView function
         * **/
        document.body.appendChild(this.scaleLabel);
        document.body.appendChild(this.canvasBtn);
        document.body.appendChild(this.canvasImage);
        document.body.appendChild(this.canvas);
        images.forEach((elem) => {
            console.log(elem.src);
            elem.addEventListener('click', (this.openView.bind(this, elem.src)));
        });
    }


    /**
     * Scale Image using scale value (+/- 5) calculated from the deltaY value passed from the event param. Change the transform style and the text content of the canvasImage using the scale value
     * @param {object} event event object
     * @return {void}
     */
    scaleImage(event) {
        event.preventDefault();
        const temp = this.scale + Math.round(event.deltaY * -0.01 * 5);
        if (temp >= 5) {
            this.scale = temp;
            this.scaleLabel.style.display = 'block';
            this.scaleLabel.textContent = `${this.scale}%`;
            this.canvasImage.style.transform = `scale(${this.scale}%)`;
        }
    }
    /**
     * Add style to each object in Array.
     * @param {Array} elems array of HTML elements
     * @param {string} property style name
     * @param {string} value style value
     * @return {void}
     */

    addStyle([...elems], property, value) {
        elems.forEach((elem) => {
            elem.style.setProperty(property, value);
        });
    }

    /**
    * Set canvas,scalelabel,canvasImage,loader and canvasbtn to visible and to corresponding poistion.
    * @param {string} imageSrc corresponding image src from img element binded before
    * @return {void}
    */

    openView(imageSrc) {
        this.addStyle([this.canvasImage, this.canvas, this.loader], 'display', 'block');
        this.canvasBtn.style.display = 'flex';
        this.canvasImage.draggable = false;
        this.canvasImage.src = imageSrc;
        this.canvasImage.onload = () => {
            this.loader.style.display = 'none';
        };
        this.loader.style.setProperty('left', `${(window.innerWidth - this.loader.clientWidth) / 2}px`);
        this.loader.style.setProperty('top', `${(window.innerHeight - this.loader.clientHeight) / 2}px`);
        this.canvasBtn.style.setProperty('left', `${(window.innerWidth - this.canvasBtn.clientWidth) / 2}px`);
        this.canvasImage.style.setProperty('top', `${(window.innerHeight - this.canvasImage.clientHeight) / 2}px`);
        this.canvasImage.style.setProperty('left', `${(window.innerWidth - this.canvasImage.clientWidth) / 2}px`);
        document.body.style.overflow = 'hidden';
    }
}


