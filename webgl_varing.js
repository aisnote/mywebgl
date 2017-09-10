/**
 * Created by liuliu on 9/9/17.
 */

/* global glUtil, document */

;(function() {
    document.addEventListener('DOMContentLoaded', function() {
        //---webgl
        var webgl = document.getElementById('webgl');
        var gl = glUtil.getContext(webgl);
        glUtil.debug(true); // log error
        if (!gl) {
            return;
        }

        // 指定清空canvas的颜色
        // 参数是rgba，范围0.0~1.0
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // 清空canvas
        // gl.COLOR_BUFFER_BIT颜色缓存，默认清空色rgba(0.0, 0.0, 0.0, 0.0) 透明黑色，通过gl.clearColor指定
        // gl.DEPTH_BUFFER_BIT深度缓存，默认深度1.0，通过gl.clearDepth指定
        // gl.STENCIL_BUFFER_BIT模板缓存，默认值0，通过gl.clearStencil()指定
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 在指定位置绘制点
        // 0.着色器源程序
        // 顶点着色器源程序
        var vsSrc = 'attribute vec4 a_Position;' +
            'attribute vec4 a_Color;' +
            'varying vec4 v_Color;' +       // 声明varying变量
            'void main() {' +
            'gl_Position = a_Position;' +   // 设置坐标
            'gl_PointSize = 7.0;' +         // 设置尺寸
            'v_Color = a_Color;' +          // 给varying变量赋值
            '}';
        // 片元着色器源程序
        //!!! 需要声明浮点数精度，否则报错No precision specified for (float)
        var fsSrc = 'precision mediump float;' +
            'varying vec4 v_Color;' +   // 声明同名varying变量
            'void main() {' +
            'gl_FragColor = v_Color;' + // 设置颜色
            '}';

        // 1.初始化着色器
        glUtil.initShaders(vsSrc, fsSrc);

        // 2.给attribute变量赋值
        // 获取attribute变量的存储位置
        var a_Position = gl.getAttribLocation(glUtil.program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return;
        }
        var a_Color = gl.getAttribLocation(glUtil.program, 'a_Color');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Color');
            return;
        }

        // 也可以把数据分开，创建两个buffer
        // 但这样更好一些，因为如果数据量很大，维护多组顶点数据会很麻烦
        var arrVtx = new Float32Array([
            // x, y, r, g, b
            -0.5, 0.5, 1.0, 0.0, 1.0, 1.0,  // 红色
            0.5, 0.5, 0.0, 1.0, 0.0, 1.0,   // 绿色
            -0.5, -0.5, 0.0, 0.0, 1.0, 1.0  // 蓝色
        ]);

        // 1.创建buffer
        var vBuffer = gl.createBuffer();
        if (!vBuffer) {
            console.log('Failed to create buffer');
            return;
        }
        // 2.把缓冲区对象绑定到目标
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

        // 3.向缓冲区对象写入数据
        gl.bufferData(gl.ARRAY_BUFFER, arrVtx, gl.STATIC_DRAW);

        // 4.将缓冲区对象分配给a_Position变量、a_Color变量
        var size = arrVtx.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, size * 6, 0);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 6, size * 2);
        //!!! 注意：分配完还要enable连接
        // 5.连接a_Position、a_Color变量和分配给它的缓冲区对象
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Color);

        // 绘制点
        gl.drawArrays(gl.POINTS, 0, arrVtx.length / 6);
        setTimeout(function() {
            gl.clear(gl.COLOR_BUFFER_BIT);
            // 绘制三角形
            gl.drawArrays(gl.TRIANGLES, 0, arrVtx.length / 6);
        }, 2000);
    });
})();