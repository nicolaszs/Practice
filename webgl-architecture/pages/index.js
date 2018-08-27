import * as React from 'react'

class App extends React.Component {
  componentDidMount() {
    const canvas = document.getElementById('canvas')
    const gl = canvas.getContext('webgl')

    this.initGL(canvas, gl);
    // this.createShaders(gl);
    this.createVertices(gl, this.createShaders(gl))
    this.draw(gl);
  }

  initGL = (canvas, gl) => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);
  }

  createShaders = (gl) => {
    let shaderProgram
    let vs = "";
    vs += "attribute vec4 coords;";
    vs += "attribute float pointSize;";
    vs += "void main(void) {";
    vs += "  gl_Position = coords;";
    vs += "  gl_PointSize = pointSize;";
    vs += "}";

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vs);
    gl.compileShader(vertexShader);

    let fs = "";
    fs += "precision mediump float;";
    fs += "uniform vec4 color;";
    fs += "void main(void) {";
    fs += "  gl_FragColor = color;";
    fs += "}";

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fs);
    gl.compileShader(fragmentShader);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    return shaderProgram
  }

  createVertices = (gl, shaderProgram) => {
    const vertices = [
      -0.9, -0.9, 0.0,
       0.9, -0.9, 0.0,
       0.0,  0.9, 0.0
    ];
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const coords = gl.getAttribLocation(shaderProgram, "coords");
    // gl.vertexAttrib3f(coords, 0.5, 0.5, 0);
    gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coords);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    const pointSize = gl.getAttribLocation(shaderProgram, "pointSize");
    gl.vertexAttrib1f(pointSize, 10);
    
    const color = gl.getUniformLocation(shaderProgram, "color");
    gl.uniform4f(color, 1, 0, 1, 1);
  }

  draw = (gl) => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 3);
  }

  render() {
    return (
      <canvas id="canvas" width="600" height="600" />
    );
  }
}

export default App
