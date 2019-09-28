import React, { Component } from 'react';
// import {VictoryScatter} from 'victory';
// import axios from "axios";
import fortniteMap from "../../img/FORTNITESEASON10MAP.jpg"

const startingData = [{ x: 0, y: 0, amount: 30 },
    { x: 50, y: 55, amount: 40 },
    { x: 95, y: 85, amount: 25 },
    { x: 152, y: 120, amount: 10 },
    { x: 250, y: 220, amount: 45 }];

let trackTransforms = function(ctx, component){
    let svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    let xform = svg.createSVGMatrix();
    // console.log(xform);
    ctx.getTransform = function(){ return xform; };

    let savedTransforms = [];
    let save = ctx.save;
    ctx.save = function(){
        savedTransforms.push(xform.translate(0,0));
        return save.call(ctx);
    };

    let restore = ctx.restore;
    ctx.restore = function(){
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    let scale = ctx.scale;
    ctx.scale = function(sx,sy){
        xform = xform.scaleNonUniform(sx,sy);
        return scale.call(ctx,sx,sy);
    };

    let rotate = ctx.rotate;
    ctx.rotate = function(radians){
        xform = xform.rotate(radians*180/Math.PI);
        return rotate.call(ctx,radians);
    };

    let translate = ctx.translate;
    ctx.translate = function(dx,dy){
        // console.log(`translate x: ${dx} || y: ${dy} || `);
        xform = xform.translate(dx,dy);
        return translate.call(ctx,dx,dy);
    };

    let transform = ctx.transform;
    ctx.transform = function(a,b,c,d,e,f){
        let m2 = svg.createSVGMatrix();
        m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
        xform = xform.multiply(m2);
        return transform.call(ctx,a,b,c,d,e,f);
    };

    let setTransform = ctx.setTransform;
    ctx.setTransform = function(a,b,c,d,e,f){
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx,a,b,c,d,e,f);
    };

    let pt  = svg.createSVGPoint();

    ctx.transformedPoint = function(x,y){
        pt.x=x; pt.y=y;
        return pt.matrixTransform(xform.inverse());
    }
};




class Fmap extends Component {
    constructor(props){
        super(props);
        const canvas = this.refs.canvas;
        let mapIMG = new Image();
        mapIMG.src = fortniteMap;
        this.state = {
            coordsArray: startingData,
            currentVote: {},
            currentMap: mapIMG,
            canvasRef:{},
            canvas:canvas,
            lastX: 0,
            lastY:0,
            dragged:false,
            dragStart:null,
            scaleFactor:1.1,
            savedTransforms:[],
            imgCoords: {x:0,y:0}
        };

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.handleScroll = this.handleScroll.bind(this);


    }


    componentDidMount(props) {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        trackTransforms(ctx, this);
        let currentState = this.state;
        currentState.canvasRef = ctx;
        currentState.canvas = canvas;
        currentState.lastX = canvas.width/2;
        currentState.lastY = canvas.height/2;
        this.setState(currentState);
        this.updateCanvas();
        console.log("component mounted");

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateCanvas();
    }

    updateCanvas(){
        //https://codepen.io/techslides/pen/zowLd
        //https://www.kempsterrrr.xyz/handling-scroll-events-in-react/
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
            // Clear the entire canvas//
            let p1 = ctx.transformedPoint(0,0);
            //console.log("Updating Canvas inside the onLoad function");
            let p2 = ctx.transformedPoint(canvas.width, canvas.height);
            ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

            ctx.save();
            ctx.setTransform(1,0,0,1,0,0);
            ctx.clearRect(0,0, canvas.width, canvas.height);
            ctx.restore();

            ctx.drawImage(this.state.currentMap,0,0, canvas.width, canvas.height);

            ctx.fillStyle = "#ff0000";
            this.state.coordsArray.map( (item)=>{
                ctx.fillRect(item.x, item.y,10,10);
            })
        ctx.fillRect(this.state.currentVote.x, this.state.currentVote.y,5,5);



    }

    mouseDown(evt){
        console.log("mouse Down event");
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        let newlastX = evt.offsetX || (evt.pageX - this.state.canvas.offsetLeft);
        let newlastY = evt.offsetY || (evt.pageY - this.state.canvas.offsetTop);
        let newdragStart = this.state.canvasRef.transformedPoint(newlastX, newlastY);
        let currentState = this.state;
        currentState.dragged = false;
        currentState.lastX = newlastX;
        currentState.lastY = newlastY;
        currentState.dragStart = newdragStart;
        currentState.currentVote = {x:evt.pageX- this.state.canvas.offsetLeft, y:evt.pageY - this.state.canvas.offsetTop};
        this.setState(currentState);
        // console.log(this.state);
    }

    mouseMove(evt) {
        // console.log("mouse move event");
        let newlastX = evt.offsetX || (evt.pageX - this.state.canvas.offsetLeft);
        let newlastY = evt.offsetY || (evt.pageY - this.state.canvas.offsetTop);
        if (this.state.dragStart){
            let pt = this.state.canvasRef.transformedPoint(newlastX,newlastY);
            let xT = pt.x-this.state.dragStart.x;
            let yT = pt.y-this.state.dragStart.y;
            this.state.canvasRef.translate(xT, yT);
            this.updateCanvas();
        }
        let currentState = this.state;
        currentState.dragged = true;
        currentState.lastX = newlastX;
        currentState.lastY = newlastY;
        this.setState(currentState);
    }

    mouseUp(evt){
        console.log("mouse up ")
        let currentState = this.state;
        currentState.dragged = false;
        currentState.dragStart = null;
        this.setState(currentState);
        // console.log(this.state);
       //  let dragged = this.state.dragged;
       // if (!dragged) this.zoom(evt.shiftKey ? -1 : 1 );
    }

    zoom(clicks){
        console.log('zoom');
        let pt = this.state.canvasRef.transformedPoint(this.state.lastX,this.state.lastY);
        this.state.canvasRef.translate(pt.x,pt.y);
        let factor = Math.pow(this.state.scaleFactor,clicks);
        this.state.canvasRef.scale(factor,factor);
        this.state.canvasRef.translate(-pt.x,-pt.y);
        this.updateCanvas();
    }

    handleScroll(evt){
        console.log("handle Scoll");
        let delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
        if (delta) this.zoom(delta);
        return evt.preventDefault() && false;
    }






    async showCoords(event) {
        console.log(event.clientX, event.clientY,);
        let clickCoords = {x: event.clientX, y: event.clientY, z: Math.random}
        //  let coords = "X coords: " + x + ", Y coords: " + y + "Z" + z ;
        // document.getElementById("demo ").innerHTML = coords;

        //POST API CALL TO BACKEND which sends a Coord Object {x float, y float, weight int}
        // and recived an updated coordsArray
        // try {
        //     const response = await axios.post('http://localhost:3001/api/SendVote', {data:{
        //             email:"danielthespy@gmail.com",
        //             sessionId: "5d4e005c005ab1312b8593d8",
        //             vote:{
        //                 x:"42",
        //                 y:"42",
        //                 z:"3"
        //             }
        //         }});
        //     console.log('Returned data:', response);
        // } catch (e) {
        //     this.setState({currentVote: clickCoords})
        //     console.log(`Axios request failed: ${e}`);
        // }

    }

//transparent or rgba(0, 0, 0, 0)
    render() {
        return (
            <div>
                <canvas ref="canvas" width={800} height={800}
                        onMouseDown={this.mouseDown} onMouseUp={this.mouseUp}
                         />
            </div>
        );
    }


}

export default Fmap;
