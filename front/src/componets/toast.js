const Toast={
    alert : function(title, content, callback) {
        title = title || '提示'
        if (!content) throw '提示内容必填 There must be alert content!'
        alert.T = null
        alert.H = document.createElement('div')
        alert.H.className = 'alert_box'
        alert.H.innerHTML = '<div class="alert animated fadeInDown"><div class="title">' + title + '</div><div class="text">' + content + '</div><div class="buttons"><input type="button" value="确定" id="sure" /></div></div>'
        document.body.appendChild(alert.H)
        alert.H.children[0].children[2].children[0].addEventListener("click", () => {
            alert.H.className = 'alert_box animated fadeOut'
            clearTimeout(alert.T)
            alert.T = setTimeout(() => {
                alert.H.remove()
                clearTimeout(alert.T)
                if (callback) {
                    callback()
                }
            }, 500)
        }, false)
    },
    tip :function(c, t)  {
        if (typeof (c) != 'string' && c.length === 0) {
            console.log('提示内容必填');
            return false
        }
        t = t || 2000;
        let i = window.hasOwnProperty('tips') ? window.tips.length : function () {
            window.tips = new Array();
            return 0
        }()
        window.tips[i] = new Object()
        window.tips[i].stamp = new Date().getTime()
        window.tips[i].dom = document.createElement('div')
        window.tips[i].dom.className = 'tips_box animated fadeIn'
        window.tips[i].dom.innerHTML = '<div class="tips_text"><span class="warn"></span>' + c + '</div>'
        window.tips[i].dom.setAttribute("index", i)
        window.tips[i].destroy = false
        document.body.appendChild(window.tips[i].dom)
        window.tips[i].dom.onclick = function () {
            window.tips[Number(this.getAttribute('index'))].destroy = true
            this.remove()
        }
        window.tips[i].timer = setTimeout(function () {
            for (let j = 0; j < window.tips.length; j++) {
                if (window.tips[j].stamp + t <= new Date().getTime()) {
                    window.tips[j].dom.remove()
                    window.tips[j].destroy = true
                }
            }
            let k
            for (k = 0; k < window.tips.length; k++) {
                if (!window.tips[k].destroy) {
                    break
                }
            }
            if (k === window.tips.length) window.tips = []
        }, t)
    },
    loading :function() {
        let loading = document.createElement('div')
        loading.className = 'rotate_load'
        // loading.innerHTML = '<div class="loading"><div class="load1"><span></span></div><div class="load2"><span></span></div><div class="load3"><span></span></div></div>'
        loading.innerHTML = '<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div></div>'
        if (document.body.getElementsByClassName('rotate_load').length === 0) document.body.appendChild(loading)
    }
    ,
    loaded:function() {
        if (document.body.getElementsByClassName('rotate_load').length != 0)
         document.body.getElementsByClassName('rotate_load')[0].remove()
    }
} 
export default Toast ;

window.Toast=Toast