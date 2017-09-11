/**
 * Created by liuliu on 9/10/17.
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
            'attribute vec2 a_TexCoord;' +  // 接受纹理坐标
            'varying vec2 v_TexCoord;' +    // 传递纹理坐标
            'void main() {' +
            'gl_Position = a_Position;' +   // 设置坐标
            'v_TexCoord = a_TexCoord;' +    // 设置纹理坐标
            '}';
        // 片元着色器源程序
        //!!! 需要声明浮点数精度，否则报错No precision specified for (float)
        var fsSrc = 'precision mediump float;' +
            'uniform sampler2D u_Sampler1;' +   // 取样器1
            'uniform sampler2D u_Sampler2;' +   // 取样器2
            'varying vec2 v_TexCoord;' +        // 接受纹理坐标
            'void main() {' +
            'vec4 color1 = texture2D(u_Sampler1, v_TexCoord);' +    // 抽取纹素颜色1
            'vec4 color2 = texture2D(u_Sampler2, v_TexCoord);' +    // 抽取纹素颜色2
            'gl_FragColor = color1 * color2;' + // 设置颜色
            '}';
        // 1.初始化着色器
        glUtil.initShaders(vsSrc, fsSrc);
        // 2.给attribute变量赋值
        // 获取attribute变量的存储位置
        var a_Position = glUtil.attr('a_Position');
        var a_TexCoord = glUtil.attr('a_TexCoord');
        var arrVtx = new Float32Array([
            // x, y, s, t
            -0.5, 0.5, 0.0, 1.0,
            0.5, 0.5, 1.0, 1.0,
            -0.5, -0.5, 0.0, 0.0,
            0.5, -0.5, 1.0, 0.0

            // 平铺九宫格
            // -0.5, 0.5, -1.0, 2.0,
            // 0.5, 0.5, 2.0, 2.0,
            // -0.5, -0.5, -1.0, -1.0,
            // 0.5, -0.5, 2.0, -1.0

            // 水平平铺2个
            // -0.5, 0.5, 0.0, 1.0,
            // 0.5, 0.5, 2.0, 1.0,
            // -0.5, -0.5, 0.0, 0.0,
            // 0.5, -0.5, 2.0, 0.0
        ]);
        // 4.将缓冲区对象分配给a_Position变量、a_Color变量
        glUtil.createArrayBuffer(arrVtx);
        glUtil.vtxAttrPointer(a_Position, 2, 4);
        glUtil.vtxAttrPointer(a_TexCoord, 2, 4, {
            offset: 2
        });

        // 给uniform变量赋值
        var u_Sampler1 = glUtil.uniform('u_Sampler1');
        var u_Sampler2 = glUtil.uniform('u_Sampler2');
        // 贴图
        var samplers = [{
            sampler: u_Sampler1,
            ready: false
        }, {
            sampler: u_Sampler2,
            ready: false
        }];
        var draw = function(image, unit) {
            var allReady = false;

            // 5.配置纹理图像
            if (image.src.endsWith('.gif') || image.src.endsWith('.png')) {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            }
            else {
                // 默认rgb
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
            }
            // 6.将unit号纹理传递给着色器
            for (var i = 0; i < samplers.length; i++) {
                var item = samplers[i];

                if (!item.ready) {
                    gl.uniform1i(item.sampler, unit);
                    item.ready = true;
                    if (i === samplers.length - 1) {
                        allReady = true;
                    }
                    break;
                }
            }

            // 绘制矩形
            if (allReady) {
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, arrVtx.length / 4);
            }
        };
        glUtil.loadTexture('miao256.jpg', draw);
        glUtil.loadTexture('circle.gif', draw);
    });
})();