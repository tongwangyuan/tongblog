function post(a) {
    var req = createXMLHTTPRequest();
    if (req) {
        req.open("POST", "http://t66y.com/register.php?", true);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=gbk;");
        req.send("reginvcode=" + a + "&action=reginvcodeck");
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    if (req.response.substring(56, 57) !== "1") {
                        console.log(a);
                    } else {
                        console.log(req.response.substring(54, 59));
                    }
                } else {
                    alert("error");
                }
            }
        }
    }

    function createXMLHTTPRequest() {
        //1.创建XMLHttpRequest对象     
        //这是XMLHttpReuquest对象无部使用中最复杂的一步     
        //需要针对IE和其他类型的浏览器建立这个对象的不同方式写不同的代码     
        var xmlHttpRequest;
        if (window.XMLHttpRequest) {
            //针对FireFox，Mozillar，Opera，Safari，IE7，IE8     
            xmlHttpRequest = new XMLHttpRequest();
            //针对某些特定版本的mozillar浏览器的BUG进行修正     
            if (xmlHttpRequest.overrideMimeType) {
                xmlHttpRequest.overrideMimeType("text/xml");
            }
        } else if (window.ActiveXObject) {
            //针对IE6，IE5.5，IE5     
            //两个可以用于创建XMLHTTPRequest对象的控件名称，保存在一个js的数组中     
            //排在前面的版本较新     
            var activexName = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
            for (var i = 0; i < activexName.length; i++) {
                try {
                    //取出一个控件名进行创建，如果创建成功就终止循环     
                    //如果创建失败，回抛出异常，然后可以继续循环，继续尝试创建     
                    xmlHttpRequest = new ActiveXObject(activexName[i]);
                    if (xmlHttpRequest) {
                        break;
                    }
                } catch (e) {}
            }
        }
        return xmlHttpRequest;
    }
}
var character = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

//for (var i = 0; i < 26; i++) {
    var code = "b397918b",
        //chart = character[i],
        all = "",
        nn;
    for (var n = 0; n < 10; n++) {
        for (var x = 0; x < 10; x++) {
            /*if (x == 0) {
                nn = 6;
            } else {
                nn = 4;
            }*/
            all = "7"+n+"bd2"+n+x+"a"+code;
            post(all);
        }
    }
//}
