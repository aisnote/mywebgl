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
            'void main() {' +
            'gl_Position = a_Position;' +   // 设置坐标
            'gl_PointSize = 200.0;' +       // 设置尺寸
            '}';
        // 片元着色器源程序
        var fsSrc = 'void main() {' +
            'gl_FragColor = vec4(1.0, 0.0, 1.0, 0.75);' + // 设置颜色
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
        // 把顶点位置传递给attribute变量
        gl.vertexAttrib3f(a_Position, 0.5, 0.0, 0.0);

        // 绘制点
        gl.drawArrays(gl.POINTS, 0, 1);
    });
})();